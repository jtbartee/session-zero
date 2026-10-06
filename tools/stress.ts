/**
 * Generation stress harness.
 *
 * Measures the things that actually matter for a name generator: how often it
 * repeats itself, how evenly it uses its own grammar, and how much work the
 * validators are doing. Every number printed is measured, not asserted.
 *
 *   npm run stress          # 10,000 names per species
 *   npm run stress:full     # 100,000 names per species
 *   npx vite-node tools/stress.ts --n 25000 --species dwarf,elf
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { CATALOGUE } from '../src/engine/catalogue.ts';
import { MemoryHistory, NameEngine } from '../src/engine/generator.ts';
import { similarity, syllableEstimate } from '../src/engine/diversity.ts';
import { ALL_SPECIES } from '../src/data/species/index.ts';
import type { GenerationOptions } from '../src/types/index.ts';

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
function flag(name: string): string | undefined {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}
const FULL = argv.includes('--full');
const TARGET = Number(flag('n') ?? (FULL ? 100_000 : 10_000));
const BATCH = Number(flag('batch') ?? 20);
const ONLY = flag('species')?.split(',').map((s) => s.trim()).filter(Boolean);
const WRITE = argv.includes('--write');

const subjects = ONLY
  ? ALL_SPECIES.filter((s) => ONLY.includes(s.id))
  : ALL_SPECIES;

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

interface SpeciesReport {
  id: string;
  name: string;
  tier: string;
  total: number;
  uniqueFull: number;
  uniquePct: number;
  uniqueGiven: number;
  uniqueFamily: number;
  familyBearing: number;
  topGivenRepeat: number;
  topFamilyRepeat: number;
  topPrefixes: Array<[string, number]>;
  topSuffixes: Array<[string, number]>;
  structures: Array<[string, number]>;
  traditions: Array<[string, number]>;
  nearDupPairsPerBatch: number;
  rejectionRate: number;
  topRejections: Array<[string, number]>;
  attemptsPerName: number;
  usPerName: number;
}

function topN(map: Map<string, number>, n: number): Array<[string, number]> {
  return [...map].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function bump(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function measure(speciesId: string | null, label: string, tier: string, total: number): SpeciesReport {
  // A fresh engine per species: no cross-contamination of the ledger.
  const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
  const base: GenerationOptions = {
    species: speciesId,
    background: null,
    genderStyle: 'any',
    style: 'distinctive',
    complexity: 3,
    count: BATCH,
    includeHook: false,
  };

  const full = new Set<string>();
  const given = new Map<string, number>();
  const family = new Map<string, number>();
  const prefixes = new Map<string, number>();
  const suffixes = new Map<string, number>();
  const structures = new Map<string, number>();
  const traditions = new Map<string, number>();
  const rejections = new Map<string, number>();

  let produced = 0;
  let attempts = 0;
  let rejectionTotal = 0;
  let familyBearing = 0;
  let nearDupPairs = 0;
  let batches = 0;
  let seed = 0x5eed;

  const started = process.hrtime.bigint();
  while (produced < total) {
    const count = Math.min(BATCH, total - produced);
    const result = engine.generate({ ...base, count, seed: seed++ });
    batches++;
    attempts += result.diagnostics.attempts;
    for (const [reason, n] of Object.entries(result.diagnostics.rejections)) {
      rejections.set(reason, (rejections.get(reason) ?? 0) + n);
      rejectionTotal += n;
    }

    const batchGivens: string[] = [];
    for (const c of result.characters) {
      produced++;
      full.add(c.name.toLowerCase());
      structures.set(`${c.structureId}`, (structures.get(`${c.structureId}`) ?? 0) + 1);
      if (c.traditionId) bump(traditions, c.traditionId);

      const g = c.components.find((x) => x.role === 'given' || x.role === 'birthname')?.text
        ?? c.components[0]?.text ?? c.name;
      bump(given, g.toLowerCase());
      batchGivens.push(g);
      const flat = g.toLowerCase().replace(/[^a-z]/g, '');
      if (flat.length >= 3) {
        bump(prefixes, flat.slice(0, 3));
        bump(suffixes, flat.slice(-3));
      }

      const f = c.components.find((x) => x.role === 'family' || x.role === 'clan')?.text;
      if (f) {
        familyBearing++;
        bump(family, f.toLowerCase());
      }
    }

    // Phonetic near-duplicates inside a delivered batch.
    for (let i = 0; i < batchGivens.length; i++) {
      for (let j = i + 1; j < batchGivens.length; j++) {
        const a = batchGivens[i] as string;
        const b = batchGivens[j] as string;
        if (Math.abs(syllableEstimate(a) - syllableEstimate(b)) > 1) continue;
        if (similarity(a, b) > 0.72) nearDupPairs++;
      }
    }
  }
  const elapsedNs = Number(process.hrtime.bigint() - started);

  return {
    id: speciesId ?? '(unspecified)',
    name: label,
    tier,
    total: produced,
    uniqueFull: full.size,
    uniquePct: (full.size / produced) * 100,
    uniqueGiven: given.size,
    uniqueFamily: family.size,
    familyBearing,
    topGivenRepeat: Math.max(0, ...given.values()),
    topFamilyRepeat: family.size ? Math.max(...family.values()) : 0,
    topPrefixes: topN(prefixes, 5),
    topSuffixes: topN(suffixes, 5),
    structures: topN(structures, 8),
    traditions: topN(traditions, 5),
    nearDupPairsPerBatch: nearDupPairs / batches,
    rejectionRate: rejectionTotal / attempts,
    topRejections: topN(rejections, 5),
    attemptsPerName: attempts / produced,
    usPerName: elapsedNs / produced / 1000,
  };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log(`Session Zero — generation stress test`);
console.log(`${subjects.length} species + unspecified, ${TARGET.toLocaleString()} names each, batches of ${BATCH}\n`);

const reports: SpeciesReport[] = [];
/**
 * A second, smaller pass. 10,000 names per species is a stress figure; a busy
 * table session is a few hundred. Both numbers are reported because they
 * answer different questions: the large one measures the grammar's reach, the
 * small one measures what a DM will actually experience.
 */
const SESSION = 500;
const sessionReports: SpeciesReport[] = [];

reports.push(measure(null, 'Unspecified', 'core', TARGET));
sessionReports.push(measure(null, 'Unspecified', 'core', SESSION));
for (const spec of subjects) {
  const report = measure(spec.id, spec.name, spec.tier, TARGET);
  reports.push(report);
  sessionReports.push(measure(spec.id, spec.name, spec.tier, SESSION));
  const warn = report.uniquePct < 99.5 ? '  <-- below 99.5%' : '';
  process.stdout.write(
    `${spec.name.padEnd(26)} unique ${report.uniquePct.toFixed(2).padStart(6)}%  ` +
    `givens ${String(report.uniqueGiven).padStart(7)}  ` +
    `nearDup/batch ${report.nearDupPairsPerBatch.toFixed(2).padStart(5)}  ` +
    `rej ${(report.rejectionRate * 100).toFixed(1).padStart(5)}%  ` +
    `${report.usPerName.toFixed(0).padStart(4)}us${warn}\n`,
  );
}

// --- summary ---------------------------------------------------------------
const sorted = [...reports].sort((a, b) => a.uniquePct - b.uniquePct);
console.log('\n--- lowest uniqueness ---');
for (const r of sorted.slice(0, 8)) {
  console.log(`  ${r.name.padEnd(26)} ${r.uniquePct.toFixed(2)}%  topGivenRepeat=${r.topGivenRepeat}  ` +
    `topPrefixes=${r.topPrefixes.map(([k, v]) => `${k}:${v}`).join(' ')}`);
}
console.log('\n--- worst in-batch phonetic clustering ---');
for (const r of [...reports].sort((a, b) => b.nearDupPairsPerBatch - a.nearDupPairsPerBatch).slice(0, 8)) {
  console.log(`  ${r.name.padEnd(26)} ${r.nearDupPairsPerBatch.toFixed(2)} pairs/batch of ${BATCH}`);
}
console.log('\n--- slowest ---');
for (const r of [...reports].sort((a, b) => b.usPerName - a.usPerName).slice(0, 5)) {
  console.log(`  ${r.name.padEnd(26)} ${r.usPerName.toFixed(0)}us/name  ${r.attemptsPerName.toFixed(2)} attempts/name`);
}

const sessionWorst = [...sessionReports].sort((a, b) => a.uniquePct - b.uniquePct).slice(0, 6);
console.log(`\n--- session scale (${SESSION} names per species) ---`);
for (const r of sessionWorst) {
  console.log(`  ${r.name.padEnd(26)} ${r.uniquePct.toFixed(2)}% unique`);
}
const sessionTotal = sessionReports.reduce((n, r) => n + r.total, 0);
const sessionUnique = sessionReports.reduce((n, r) => n + r.uniqueFull, 0) / sessionTotal * 100;
const sessionBelow = sessionReports.filter((r) => r.uniquePct < 99.5);
console.log(`  overall ${sessionUnique.toFixed(3)}% unique; ` +
  `${sessionBelow.length} species below 99.5%` +
  (sessionBelow.length ? ` (${sessionBelow.map((r) => `${r.name} ${r.uniquePct.toFixed(1)}%`).join(', ')})` : ''));

const totalNames = reports.reduce((n, r) => n + r.total, 0);
const weightedUnique = reports.reduce((n, r) => n + r.uniqueFull, 0) / totalNames * 100;
const belowTarget = reports.filter((r) => r.uniquePct < 99.5);
console.log(`\nTotal generated: ${totalNames.toLocaleString()}`);
console.log(`Overall unique full names: ${weightedUnique.toFixed(3)}%`);
console.log(`Species below the 99.5% target: ${belowTarget.length}` +
  (belowTarget.length ? ` (${belowTarget.map((r) => r.name).join(', ')})` : ''));

if (WRITE) {
  mkdirSync('tools/out', { recursive: true });
  writeFileSync('tools/out/stress.json', JSON.stringify({
    generatedAt: new Date().toISOString(),
    perSpecies: TARGET, batchSize: BATCH, totalNames,
    overallUniquePct: weightedUnique, reports,
    sessionScale: { perSpecies: SESSION, overallUniquePct: sessionUnique, reports: sessionReports },
  }, null, 2));
  console.log('\nWrote tools/out/stress.json');
}
