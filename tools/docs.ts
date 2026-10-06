/**
 * Regenerates the machine-derived sections of RESEARCH.md and TESTING.md from
 * the actual data and the last stress run, so the documentation cannot drift
 * away from the code.
 *
 *   npx vite-node tools/docs.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { ALL_SPECIES, CORE_SPECIES, EXPANDED_SPECIES, GENERIC } from '../src/data/species/index.ts';
import { ALL_BACKGROUNDS } from '../src/data/backgrounds/index.ts';
import type { SpeciesSpec } from '../src/types/index.ts';

const CONFIDENCE_LABEL = {
  documented: 'Documented',
  partial: 'Partial',
  original: 'Original',
} as const;

function speciesSection(spec: SpeciesSpec): string {
  const lines: string[] = [];
  lines.push(`### ${spec.name}`);
  lines.push('');
  lines.push(`- **Classification:** ${spec.tier === 'core' ? 'Core — 2024 Player’s Handbook' : 'Expanded'}`);
  lines.push(`- **Sources:** ${spec.sources.join('; ')}`);
  lines.push(`- **Confidence:** ${CONFIDENCE_LABEL[spec.confidence]}`);
  lines.push(`- **Naming traditions:** ${spec.traditions.map((t) => `${t.label} (weight ${t.weight})`).join(', ')}`);
  lines.push(`- **Architectures used:** ${architectures(spec).join(', ')}`);
  lines.push(`- **Structures:** ${spec.traditions.reduce((n, t) => n + t.structures.length, 0)}`);
  lines.push('');
  lines.push('Naming observations:');
  lines.push('');
  for (const note of spec.loreNotes) lines.push(`- ${note}`);
  if (spec.citations.length > 0) {
    lines.push('');
    lines.push(`Citations: ${spec.citations.map((c) => (c.startsWith('http') ? `<${c}>` : c)).join(', ')}`);
  }
  lines.push('');
  return lines.join('\n');
}

function architectures(spec: SpeciesSpec): string[] {
  const kinds = new Set<string>();
  const walk = (producer: unknown): void => {
    const p = producer as { kind: string; options?: ReadonlyArray<readonly [unknown, number]>; parts?: unknown[] };
    if (p.kind === 'oneOf') { for (const [inner] of p.options ?? []) walk(inner); return; }
    if (p.kind === 'sequence') { for (const inner of p.parts ?? []) walk(inner); return; }
    kinds.add(p.kind);
  };
  for (const tradition of spec.traditions) for (const producer of Object.values(tradition.producers)) walk(producer);
  const names: Record<string, string> = {
    phonetic: 'phonetic', morph: 'morphological', compound: 'compound',
    phrase: 'descriptive phrase', virtue: 'chosen/virtue', closed: 'closed set',
  };
  return [...kinds].map((k) => names[k] ?? k).sort();
}

function replaceBlock(file: string, marker: string, body: string): void {
  if (!existsSync(file)) {
    console.warn(`skipping ${file}: not written yet`);
    return;
  }
  const source = readFileSync(file, 'utf8');
  const open = `<!-- BEGIN ${marker} -->`;
  const close = `<!-- END ${marker} -->`;
  const start = source.indexOf(open);
  const end = source.indexOf(close);
  if (start < 0 || end < 0) {
    console.warn(`skipping ${file}: no ${marker} markers`);
    return;
  }
  const next = `${source.slice(0, start + open.length)}\n\n${body.trim()}\n\n${source.slice(end)}`;
  writeFileSync(file, next);
  console.log(`updated ${marker} in ${file}`);
}

// --- species catalogue -------------------------------------------------
const byConfidence = { documented: 0, partial: 0, original: 0 };
for (const spec of ALL_SPECIES) byConfidence[spec.confidence]++;

const summary = [
  `**${ALL_SPECIES.length} playable species and lineages** — ${CORE_SPECIES.length} core, ${EXPANDED_SPECIES.length} expanded.`,
  `**${ALL_SPECIES.reduce((n, s) => n + s.traditions.length, 0)} naming traditions** across them, and`,
  `**${ALL_SPECIES.reduce((n, s) => n + s.traditions.reduce((m, t) => m + t.structures.length, 0), 0)} name structures**.`,
  '',
  `Confidence split: ${byConfidence.documented} documented, ${byConfidence.partial} partial, ${byConfidence.original} original.`,
  '',
  '| Species | Tier | Confidence | Traditions | Architectures |',
  '| --- | --- | --- | --- | --- |',
  ...ALL_SPECIES.map((s) =>
    `| ${s.name} | ${s.tier === 'core' ? 'Core' : 'Expanded'} | ${CONFIDENCE_LABEL[s.confidence]} | `
    + `${s.traditions.length} | ${architectures(s).join(', ')} |`),
].join('\n');

replaceBlock('RESEARCH.md', 'SPECIES_SUMMARY', summary);

const detail = [...CORE_SPECIES, ...EXPANDED_SPECIES, GENERIC].map(speciesSection).join('\n');
replaceBlock('RESEARCH.md', 'SPECIES_DETAIL', detail);

const backgrounds = [
  '| Background | Tier | Source | Register | Byname chance |',
  '| --- | --- | --- | --- | --- |',
  ...ALL_BACKGROUNDS.map((b) =>
    `| ${b.name} | ${b.tier === 'core' ? 'Core' : 'Expanded'} | ${b.source} | ${b.register} | ${Math.round(b.bynameChance * 100)}% |`),
].join('\n');
replaceBlock('RESEARCH.md', 'BACKGROUNDS', backgrounds);

// --- stress results ----------------------------------------------------
const statsPath = 'tools/out/stress.json';
if (existsSync(statsPath)) {
  const data = JSON.parse(readFileSync(statsPath, 'utf8')) as {
    generatedAt: string; perSpecies: number; batchSize: number; totalNames: number;
    overallUniquePct: number;
    reports: Array<{
      name: string; uniquePct: number; uniqueGiven: number; nearDupPairsPerBatch: number;
      rejectionRate: number; usPerName: number; attemptsPerName: number; total: number;
      topRejections: Array<[string, number]>; topPrefixes: Array<[string, number]>;
      topSuffixes: Array<[string, number]>; structures: Array<[string, number]>;
      uniqueFamily: number; familyBearing: number; topGivenRepeat: number; topFamilyRepeat: number;
    }>;
    sessionScale: { perSpecies: number; overallUniquePct: number; reports: Array<{ name: string; uniquePct: number }> };
  };

  const session = new Map(data.sessionScale.reports.map((r) => [r.name, r]));
  const sorted = [...data.reports].sort((a, b) => a.uniquePct - b.uniquePct);
  const above = sorted.filter((r) => r.uniquePct >= 99.5).length;
  const meanUs = data.reports.reduce((n, r) => n + r.usPerName * r.total, 0) / data.totalNames;
  const meanAttempts = data.reports.reduce((n, r) => n + r.attemptsPerName * r.total, 0) / data.totalNames;

  const rejections: Record<string, number> = {};
  for (const r of data.reports) for (const [k, v] of r.topRejections) rejections[k] = (rejections[k] ?? 0) + v;

  const headline = [
    `_Measured ${new Date(data.generatedAt).toISOString().slice(0, 10)} with \`npm run stress -- --n ${data.perSpecies}\`._`,
    '',
    `| Measurement | Result |`,
    `| --- | --- |`,
    `| Total names generated | ${data.totalNames.toLocaleString()} |`,
    `| Subjects | ${data.reports.length} (56 species + Not Specified) |`,
    `| Names per subject | ${data.perSpecies.toLocaleString()}, in batches of ${data.batchSize} |`,
    `| **Unique full names, 10,000-name sample** | **${data.overallUniquePct.toFixed(2)}%** |`,
    `| **Unique full names, 500-name sample** | **${data.sessionScale.overallUniquePct.toFixed(3)}%** (zero duplicates in ${(data.sessionScale.perSpecies * data.sessionScale.reports.length).toLocaleString()} names) |`,
    `| Subjects at or above the 99.5% target (10k) | ${above} of ${sorted.length} |`,
    `| Median subject uniqueness (10k) | ${(sorted[Math.floor(sorted.length / 2)]?.uniquePct ?? 0).toFixed(2)}% |`,
    `| Mean generation time | ${meanUs.toFixed(0)} µs per name |`,
    `| Mean attempts per accepted name | ${meanAttempts.toFixed(2)} |`,
    '',
    '### Why candidates were rejected',
    '',
    'Every rejection is a filter doing its job. Counts are across the whole run.',
    '',
    '| Reason | Count |',
    '| --- | --- |',
    ...Object.entries(rejections).sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `| \`${k}\` | ${v.toLocaleString()} |`),
  ].join('\n');
  replaceBlock('TESTING.md', 'STRESS_HEADLINE', headline);

  const table = [
    '| Species | Unique @10k | Unique @500 | Distinct given names | Most-repeated given | Near-dup pairs per batch of 20 | Rejection rate | µs/name |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...sorted.map((r) => {
      const s = session.get(r.name);
      return `| ${r.name} | ${r.uniquePct.toFixed(2)}% | ${(s?.uniquePct ?? 0).toFixed(1)}% | `
        + `${r.uniqueGiven.toLocaleString()} | ${r.topGivenRepeat}× | ${r.nearDupPairsPerBatch.toFixed(2)} | `
        + `${(r.rejectionRate * 100).toFixed(1)}% | ${r.usPerName.toFixed(0)} |`;
    }),
  ].join('\n');
  replaceBlock('TESTING.md', 'STRESS_TABLE', table);

  const components = [
    '| Species | Most common given-name openings | Most common given-name endings | Structure spread |',
    '| --- | --- | --- | --- |',
    ...sorted.slice(0, 20).map((r) =>
      `| ${r.name} | ${r.topPrefixes.map(([k, v]) => `${k} ${v}`).join(', ')} | `
      + `${r.topSuffixes.map(([k, v]) => `${k} ${v}`).join(', ')} | `
      + `${r.structures.slice(0, 4).map(([k, v]) => `${k} ${v}`).join(', ')} |`),
  ].join('\n');
  replaceBlock('TESTING.md', 'STRESS_COMPONENTS', components);
} else {
  console.warn('no stress results found; run `npm run stress -- --write` first');
}
