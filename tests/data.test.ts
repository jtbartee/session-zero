/**
 * Data integrity.
 *
 * These catch the class of bug that is invisible until a user picks exactly
 * the wrong option: a structure referencing a producer key that does not
 * exist, a weight of zero, a species with no citation.
 */

import { describe, expect, it } from 'vitest';
import { ALL_SPECIES, EXPANDED_SPECIES, CORE_SPECIES, GENERIC, SPECIES_BY_ID, speciesGroups } from '../src/data/species/index.ts';
import { ALL_BACKGROUNDS, CORE_BACKGROUNDS } from '../src/data/backgrounds/index.ts';
import type { Producer, SpeciesSpec } from '../src/types/index.ts';

const CORE_2024 = [
  'Aasimar', 'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath', 'Halfling', 'Human', 'Orc', 'Tiefling',
];

const CORE_BACKGROUND_NAMES = [
  'Acolyte', 'Artisan', 'Charlatan', 'Criminal', 'Entertainer', 'Farmer', 'Guard', 'Guide', 'Hermit',
  'Merchant', 'Noble', 'Sage', 'Sailor', 'Scribe', 'Soldier', 'Wayfarer',
];

describe('catalogue shape', () => {
  it('includes all ten 2024 Player’s Handbook species, marked core', () => {
    const core = CORE_SPECIES.map((s) => s.name).sort();
    expect(core).toEqual([...CORE_2024].sort());
    for (const spec of CORE_SPECIES) {
      expect(spec.tier).toBe('core');
      expect(spec.group).toMatch(/^Core/);
    }
  });

  it('includes all sixteen 2024 backgrounds', () => {
    expect(CORE_BACKGROUNDS.map((b) => b.name).sort()).toEqual([...CORE_BACKGROUND_NAMES].sort());
  });

  it('ships at least 40 distinct playable options', () => {
    expect(ALL_SPECIES.length).toBeGreaterThanOrEqual(40);
    expect(EXPANDED_SPECIES.length).toBeGreaterThan(0);
  });

  it('has no duplicate species or background ids', () => {
    const speciesIds = ALL_SPECIES.map((s) => s.id);
    expect(new Set(speciesIds).size).toBe(speciesIds.length);
    const backgroundIds = ALL_BACKGROUNDS.map((b) => b.id);
    expect(new Set(backgroundIds).size).toBe(backgroundIds.length);
  });

  it('keeps the Unspecified model out of the picker', () => {
    expect(ALL_SPECIES.find((s) => s.id === GENERIC.id)).toBeUndefined();
    expect(SPECIES_BY_ID.get(GENERIC.id)).toBe(GENERIC);
  });

  it('groups every species under a labelled heading', () => {
    const grouped = speciesGroups().flatMap((g) => g.species);
    expect(grouped.length).toBe(ALL_SPECIES.length);
    expect(speciesGroups()[0]?.label).toMatch(/^Core/);
  });
});

function collectProducerKeys(producer: Producer, seen: Set<string>): void {
  if (producer.kind === 'oneOf') {
    for (const [inner] of producer.options) collectProducerKeys(inner, seen);
  } else if (producer.kind === 'sequence') {
    for (const inner of producer.parts) collectProducerKeys(inner, seen);
  }
  seen.add(producer.kind);
}

describe.each([...ALL_SPECIES, GENERIC].map((s) => [s.name, s] as [string, SpeciesSpec]))(
  '%s specification',
  (_name, spec) => {
    it('documents its naming practice and sources', () => {
      expect(spec.loreNotes.length).toBeGreaterThan(0);
      expect(spec.sources.length).toBeGreaterThan(0);
      expect(['documented', 'partial', 'original']).toContain(spec.confidence);
      // Anything claiming to follow published material must cite something.
      if (spec.confidence !== 'original' && spec.id !== GENERIC.id) {
        expect(spec.citations.length).toBeGreaterThan(0);
      }
    });

    it('has at least one tradition with at least one structure', () => {
      expect(spec.traditions.length).toBeGreaterThan(0);
      for (const tradition of spec.traditions) {
        expect(tradition.structures.length).toBeGreaterThan(0);
        expect(tradition.weight).toBeGreaterThan(0);
        expect(tradition.note.length).toBeGreaterThan(0);
      }
    });

    it('only references producers that exist', () => {
      for (const tradition of spec.traditions) {
        const available = new Set([
          ...Object.keys(spec.sharedProducers ?? {}),
          ...Object.keys(tradition.producers),
        ]);
        for (const structure of tradition.structures) {
          expect(structure.weight).toBeGreaterThan(0);
          expect(structure.slots.length).toBeGreaterThan(0);
          for (const slot of structure.slots) {
            expect(
              available.has(slot.producer),
              `${spec.id}/${tradition.id}/${structure.id} references missing producer "${slot.producer}"`,
            ).toBe(true);
          }
        }
      }
    });

    it('uses unique structure ids within a tradition', () => {
      for (const tradition of spec.traditions) {
        const ids = tradition.structures.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    it('has a usable complexity window on every structure', () => {
      for (const tradition of spec.traditions) {
        for (const structure of tradition.structures) {
          const min = structure.minComplexity ?? 1;
          const max = structure.maxComplexity ?? 5;
          expect(min).toBeLessThanOrEqual(max);
        }
      }
    });

    it('offers at least one structure at every complexity level', () => {
      for (const level of [1, 2, 3, 4, 5] as const) {
        const usable = spec.traditions.some((t) =>
          t.structures.some((s) => (s.minComplexity ?? 1) <= level && (s.maxComplexity ?? 5) >= level));
        expect(usable, `${spec.id} has no structure at complexity ${level}`).toBe(true);
      }
    });

    it('uses only known producer kinds', () => {
      const kinds = new Set<string>();
      for (const tradition of spec.traditions) {
        for (const producer of Object.values(tradition.producers)) collectProducerKeys(producer, kinds);
      }
      for (const kind of kinds) {
        expect(['phonetic', 'morph', 'compound', 'phrase', 'virtue', 'closed', 'oneOf', 'sequence'])
          .toContain(kind);
      }
    });
  },
);

describe('backgrounds', () => {
  it.each(ALL_BACKGROUNDS.map((b) => [b.name, b] as const))('%s is well formed', (_name, background) => {
    expect(background.source.length).toBeGreaterThan(0);
    expect(background.bynameChance).toBeGreaterThanOrEqual(0);
    expect(background.bynameChance).toBeLessThanOrEqual(1);
    // Hook vocabulary is what makes a background felt rather than announced.
    const keys = Object.keys(background.hookVocabulary);
    expect(keys.length).toBeGreaterThanOrEqual(4);
    for (const key of keys) {
      expect(key.startsWith('bg_'), `${background.id} vocabulary key "${key}" must be bg_*`).toBe(true);
      expect(background.hookVocabulary[key]!.length).toBeGreaterThan(0);
    }
  });

  it('uses only species-scoped keys in species hook vocabulary', () => {
    for (const spec of ALL_SPECIES) {
      for (const key of Object.keys(spec.hookVocabulary ?? {})) {
        expect(key.startsWith('sp_'), `${spec.id} vocabulary key "${key}" must be sp_*`).toBe(true);
      }
    }
  });
});
