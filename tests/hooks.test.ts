/**
 * Character hooks: grammar expansion and output quality.
 */

import { describe, expect, it } from 'vitest';
import { buildGrammar, expand, generateHook, __testing } from '../src/engine/hooks.ts';
import { Rng } from '../src/engine/rng.ts';
import { SPECIES_BY_ID } from '../src/data/species/index.ts';
import { BACKGROUNDS_BY_ID } from '../src/data/backgrounds/index.ts';

describe('grammar expansion', () => {
  it('substitutes nested symbols', () => {
    const rng = new Rng(1);
    const grammar = { top: ['a #mid# c'], mid: ['#leaf#'], leaf: ['b'] };
    expect(expand(rng, grammar, 'top')).toBe('a b c');
  });

  it('applies modifiers', () => {
    const rng = new Rng(1);
    const grammar = { top: ['#word.cap# / #word.a# / #word.lower#'], word: ['owl'] };
    const out = expand(rng, grammar, 'top');
    expect(out).toBe('Owl / an owl / owl');
  });

  it('terminates on a cyclic rule instead of hanging', () => {
    const rng = new Rng(1);
    const grammar = { loop: ['#loop#'] };
    expect(() => expand(rng, grammar, 'loop')).not.toThrow();
  });

  it('returns empty for an unknown symbol rather than printing it', () => {
    const rng = new Rng(1);
    expect(expand(rng, { top: ['x #nope# y'] }, 'top')).toBe('x  y');
  });
});

describe('vocabulary merging', () => {
  it('keeps generic fallbacks alongside specific entries', () => {
    const grammar = buildGrammar(SPECIES_BY_ID.get('dwarf'), BACKGROUNDS_BY_ID.get('sage'));
    expect(grammar.bg_place?.length).toBeGreaterThan(6);
    expect(grammar.bg_place?.some((p) => p.includes('library'))).toBe(true);
    expect(grammar.sp_place?.some((p) => p.includes('delve') || p.includes('hold'))).toBe(true);
  });

  it('still fills injected slots with nothing selected', () => {
    const grammar = buildGrammar(null, null);
    for (const key of ['bg_place', 'bg_object', 'bg_person', 'bg_deed', 'bg_trouble', 'bg_habit',
      'sp_place', 'sp_thing', 'sp_trait']) {
      expect(grammar[key]?.length, `${key} has no fallback`).toBeGreaterThan(0);
    }
  });
});

describe('hook output', () => {
  const sample = (n: number, speciesId?: string, backgroundId?: string): string[] => {
    const rng = new Rng(2024);
    const seen = new Set<string>();
    return Array.from({ length: n }, () => generateHook({
      rng,
      species: speciesId ? SPECIES_BY_ID.get(speciesId) : null,
      background: backgroundId ? BACKGROUNDS_BY_ID.get(backgroundId) : null,
      seen,
    }));
  };

  it('always returns a finished sentence', () => {
    for (const hook of sample(400)) {
      expect(hook.length).toBeGreaterThan(20);
      expect(hook).toMatch(/^[A-Z]/);
      expect(hook).toMatch(/[.!?]$/);
    }
  });

  it('never leaks grammar syntax or undefined', () => {
    for (const hook of sample(600, 'tabaxi', 'sailor')) {
      expect(hook).not.toMatch(/#|\{|\}|undefined|null/);
      expect(hook).not.toMatch(/\s{2,}/);
      expect(hook).not.toMatch(/\s[,.;]/);
    }
  });

  it('fixes the article before a vowel', () => {
    const grammar = { top: ['a #word#'], word: ['archivist'] };
    expect(__testing.tidyHook(expand(new Rng(1), grammar, 'top'))).toBe('An archivist.');
  });

  it('is highly varied over a large sample', () => {
    const hooks = sample(500);
    expect(new Set(hooks).size / hooks.length).toBeGreaterThan(0.95);
    // And the openings should vary, not just the tails.
    expect(new Set(hooks.map((h) => h.slice(0, 18))).size).toBeGreaterThan(180);
  });

  it('reflects the selected background', () => {
    const acolyte = sample(150, undefined, 'acolyte').join(' ').toLowerCase();
    const sailor = sample(150, undefined, 'sailor').join(' ').toLowerCase();
    expect(acolyte).toMatch(/shrine|temple|relic|vigil|congregat|pilgrim/);
    expect(sailor).toMatch(/port|ship|crew|harbour|quay|sea|sail/);
  });

  it('reflects the selected species', () => {
    const warforged = sample(150, 'warforged').join(' ').toLowerCase();
    expect(warforged).toMatch(/forge|warforged|discharge|component|chose/);
  });

  it('avoids the generic filler the brief rejects', () => {
    for (const hook of sample(500, 'human', 'soldier')) {
      expect(hook.toLowerCase()).not.toMatch(/brave adventurer|seeking glory|seeks fame|destined for greatness/);
    }
  });

  it('stays to one sentence of reasonable length', () => {
    for (const hook of sample(300, 'elf', 'noble')) {
      expect(hook.length).toBeLessThan(240);
      expect((hook.match(/[.!?]/g) ?? []).length).toBeLessThanOrEqual(3);
    }
  });
});
