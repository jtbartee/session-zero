/**
 * Anti-repetition.
 *
 * The headline case is the one the brief calls out: a batch with no exact
 * duplicates that still reads as the same name four times.
 */

import { describe, expect, it } from 'vitest';
import { BatchGuard, UsageLedger, levenshtein, phoneticSkeleton, rhymeKey, similarity, syllableEstimate }
  from '../src/engine/diversity.ts';
import { CATALOGUE } from '../src/engine/catalogue.ts';
import { MemoryHistory, NameEngine } from '../src/engine/generator.ts';
import type { GenerationOptions } from '../src/types/index.ts';

describe('similarity primitives', () => {
  it('measures edit distance', () => {
    expect(levenshtein('dorrin', 'borrin')).toBe(1);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('same', 'same')).toBe(0);
  });

  it('scores near-identical names high', () => {
    expect(similarity('Dorrin', 'Borrin')).toBeGreaterThan(0.8);
    expect(similarity('Dorrin', 'Ashavelle')).toBeLessThan(0.3);
  });

  it('collapses equivalent spellings to one phonetic skeleton', () => {
    expect(phoneticSkeleton('Caelynn')).toBe(phoneticSkeleton('Kaelin'));
    expect(phoneticSkeleton('Phelan')).toBe(phoneticSkeleton('Felan'));
    expect(phoneticSkeleton('Dorrin')).not.toBe(phoneticSkeleton('Mareth'));
    // A vowel-initial name keeps its opening vowel so it does not collapse
    // into the consonant-initial name that follows it.
    expect(phoneticSkeleton('Amara')).not.toBe(phoneticSkeleton('Mara'));
  });

  it('finds the rhyming tail', () => {
    expect(rhymeKey('Dorrin')).toBe(rhymeKey('Borrin'));
    expect(rhymeKey('Dorrin')).not.toBe(rhymeKey('Dorvak'));
  });

  it('estimates syllables', () => {
    // Vowel groups, not true syllables: "Amakiir" is A-ma-kiir.
    expect(syllableEstimate('Bram')).toBe(1);
    expect(syllableEstimate('Amakiir')).toBe(3);
    expect(syllableEstimate('Galanodel')).toBe(4);
  });
});

describe('BatchGuard', () => {
  const candidate = (full: string, given: string, extra: Partial<{ family: string; familyStem: string }> = {}) => ({
    full, given, structureId: 'test:structure', ...extra,
  });

  it('rejects an exact repeat', () => {
    const guard = new BatchGuard({ batchSize: 5, structureVariants: 4 });
    guard.commit(candidate('Bram Ironfist', 'Bram'));
    expect(guard.check(candidate('Bram Ironfist', 'Bram'))).toBe('duplicate-exact');
  });

  it('rejects a name already in the persistent history', () => {
    const guard = new BatchGuard({ batchSize: 5, recent: ['Bram Ironfist'], structureVariants: 4 });
    expect(guard.check(candidate('Bram Ironfist', 'Bram'))).toBe('duplicate-recent');
  });

  it('rejects the rhyming batch the brief calls out', () => {
    const guard = new BatchGuard({ batchSize: 4, structureVariants: 4 });
    guard.commit(candidate('Dorrin Ironbeard', 'Dorrin', { family: 'Ironbeard', familyStem: 'Iron' }));
    // Borrin/Korrin/Thorrin all rhyme with Dorrin and all share the Iron- stem.
    for (const [full, given, family] of [
      ['Borrin Ironhammer', 'Borrin', 'Ironhammer'],
      ['Korrin Ironforge', 'Korrin', 'Ironforge'],
      ['Thorrin Ironshield', 'Thorrin', 'Ironshield'],
    ] as const) {
      const reason = guard.check(candidate(full, given, { family, familyStem: 'Iron' }));
      expect(reason, `"${full}" should have been rejected`).not.toBeNull();
    }
  });

  it('rejects a repeated surname stem beyond its budget', () => {
    const guard = new BatchGuard({ batchSize: 10, structureVariants: 6 });
    guard.commit(candidate('Alpha Ironbeard', 'Alpha', { family: 'Ironbeard', familyStem: 'Iron' }));
    guard.commit(candidate('Beta Ironhammer', 'Beta', { family: 'Ironhammer', familyStem: 'Iron' }));
    expect(guard.check(candidate('Gamma Ironforge', 'Gamma', { family: 'Ironforge', familyStem: 'Iron' })))
      .toBe('surname-stem-collision');
  });

  it('relaxes under pressure so generation always terminates', () => {
    const guard = new BatchGuard({ batchSize: 4, structureVariants: 4 });
    guard.commit(candidate('Dorrin Ironbeard', 'Dorrin', { family: 'Ironbeard', familyStem: 'Iron' }));
    const strict = guard.check(candidate('Borrin Ironhammer', 'Borrin', { familyStem: 'Iron' }), 0);
    const relaxed = guard.check(candidate('Borrin Ironhammer', 'Borrin', { familyStem: 'Iron' }), 1);
    expect(strict).not.toBeNull();
    expect(relaxed).toBeNull();
  });

  it('does not constrain structure variety a tradition cannot supply', () => {
    // One structure, twenty names: every name must be allowed through.
    const guard = new BatchGuard({ batchSize: 20, structureVariants: 1 });
    for (let i = 0; i < 20; i++) {
      const name = `Name${i} Sur${i}`;
      const reason = guard.check(candidate(name, `Zeta${i}qu`));
      expect(reason, `name ${i} rejected as ${reason}`).not.toBe('structure-overused');
      guard.commit(candidate(name, `Zeta${i}qu`));
    }
  });

  it('skips phonetic keys for serial designations but still limits the head', () => {
    const guard = new BatchGuard({ batchSize: 20, structureVariants: 4 });
    const unit = (n: string) => ({ full: `Unit ${n}`, given: `Unit ${n}`, structureId: 'a:b', skipPhoneticKeys: true });
    guard.commit(unit('Two'));
    guard.commit(unit('Three'));
    // Rhyme/skeleton must not fire on a series...
    expect(guard.check(unit('Four'))).not.toBe('rhyme-collision');
    // ...but the head budget still stops a batch of twenty "Unit" somethings.
    guard.commit(unit('Four'));
    guard.commit(unit('Five'));
    expect(guard.check(unit('Six'))).toBe('head-collision');
  });
});

describe('UsageLedger', () => {
  it('penalises repeated components and recovers through decay', () => {
    const ledger = new UsageLedger();
    expect(ledger.penalty('stem', 'iron')).toBe(1);
    ledger.record('stem', 'iron');
    const once = ledger.penalty('stem', 'iron');
    ledger.record('stem', 'iron');
    ledger.record('stem', 'iron');
    const thrice = ledger.penalty('stem', 'iron');
    expect(once).toBeLessThan(1);
    expect(thrice).toBeLessThan(once);

    for (let i = 0; i < 60; i++) ledger.decay();
    expect(ledger.penalty('stem', 'iron')).toBe(1);
  });

  it('suppresses components harder than structures', () => {
    const ledger = new UsageLedger();
    for (let i = 0; i < 3; i++) {
      ledger.record('stem', 'iron');
      ledger.record('structure', 'dwarf:given-clan');
    }
    // Structures must stay close to their authored weights, or a dwarf stops
    // usually having a clan name.
    expect(ledger.penalty('structure', 'dwarf:given-clan'))
      .toBeGreaterThan(ledger.penalty('stem', 'iron') * 2);
  });

  it('keeps its map bounded', () => {
    const ledger = new UsageLedger();
    for (let i = 0; i < 400; i++) ledger.record('stem', `stem-${i}`);
    for (let i = 0; i < 80; i++) ledger.decay();
    expect(ledger.size).toBe(0);
  });
});

describe('engine-level repetition', () => {
  const base: GenerationOptions = {
    species: 'dwarf', background: null, genderStyle: 'any', style: 'distinctive',
    complexity: 3, count: 20, includeHook: false,
  };

  it('never repeats inside a batch of 20, for any species', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    for (const spec of CATALOGUE.pickableSpecies) {
      const { characters } = engine.generate({ ...base, species: spec.id, seed: 2024 });
      const names = characters.map((c) => c.name);
      expect(new Set(names).size, `${spec.id} repeated inside one batch`).toBe(names.length);
    }
  });

  it('avoids the Ironbeard/Ironhammer pattern in a real dwarf batch', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const { characters } = engine.generate({ ...base, count: 20, seed: 606 });
    const stems = characters
      .map((c) => c.components.find((x) => x.role === 'clan')?.text)
      .filter(Boolean)
      .map((f) => (f as string).slice(0, 4).toLowerCase());
    const counts = new Map<string, number>();
    for (const stem of stems) counts.set(stem, (counts.get(stem) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(3);
  });

  it('keeps rhyme clusters out of a batch', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const { characters } = engine.generate({ ...base, count: 20, seed: 707 });
    const givens = characters.map((c) => c.components[0]?.text ?? c.name);
    let clusters = 0;
    for (let i = 0; i < givens.length; i++) {
      for (let j = i + 1; j < givens.length; j++) {
        if (similarity(givens[i] as string, givens[j] as string) > 0.72) clusters++;
      }
    }
    expect(clusters).toBe(0);
  });

  it('remembers across batches so a session does not loop', () => {
    const history = new MemoryHistory(600);
    const engine = new NameEngine({ catalogue: CATALOGUE, history });
    const seen = new Set<string>();
    for (let i = 0; i < 15; i++) {
      for (const c of engine.generate({ ...base, count: 20 }).characters) seen.add(c.name);
    }
    // 300 names requested; the recent-name history should keep nearly all unique.
    expect(seen.size).toBeGreaterThanOrEqual(299);
  });

  it('deduplicates across random-species and fixed-species runs alike', () => {
    const history = new MemoryHistory(600);
    const engine = new NameEngine({ catalogue: CATALOGUE, history });
    const all: string[] = [];
    for (let i = 0; i < 5; i++) {
      all.push(...engine.generate({ ...base, species: 'random', count: 20 }).characters.map((c) => c.name));
      all.push(...engine.generate({ ...base, species: 'elf', count: 20 }).characters.map((c) => c.name));
    }
    expect(new Set(all).size).toBe(all.length);
  });
});
