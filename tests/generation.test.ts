/**
 * Functional generation tests: every control, every combination.
 */

import { describe, expect, it } from 'vitest';
import { CATALOGUE } from '../src/engine/catalogue.ts';
import { MemoryHistory, NameEngine } from '../src/engine/generator.ts';
import { ALL_SPECIES } from '../src/data/species/index.ts';
import { ALL_BACKGROUNDS } from '../src/data/backgrounds/index.ts';
import { validateName } from '../src/engine/validation.ts';
import type { Complexity, GenerationOptions, GenderStyle, NameStyle } from '../src/types/index.ts';

function engine(): NameEngine {
  return new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
}

function options(overrides: Partial<GenerationOptions> = {}): GenerationOptions {
  return {
    species: null, background: null, genderStyle: 'any', style: 'distinctive',
    complexity: 3, count: 1, includeHook: false, ...overrides,
  };
}

describe('batch sizes', () => {
  it.each([1, 5, 10, 20])('produces exactly %i names with no duplicates', (count) => {
    const { characters } = engine().generate(options({ count, seed: 42 }));
    expect(characters).toHaveLength(count);
    expect(new Set(characters.map((c) => c.name)).size).toBe(count);
  });
});

describe('species and background combinations', () => {
  const speciesChoices = [null, 'random', 'dwarf'] as const;
  const backgroundChoices = [null, 'random', 'soldier'] as const;

  for (const species of speciesChoices) {
    for (const background of backgroundChoices) {
      it(`species=${species ?? 'none'} background=${background ?? 'none'}`, () => {
        const { characters } = engine().generate(options({ species, background, count: 10, seed: 7 }));
        expect(characters).toHaveLength(10);

        for (const c of characters) {
          expect(validateName(c.name)).toBeNull();

          if (species === null) {
            expect(c.speciesId).toBeNull();
            expect(c.speciesName).toBeNull();
          } else if (species === 'random') {
            expect(c.speciesId).not.toBeNull();
            expect(ALL_SPECIES.some((s) => s.id === c.speciesId)).toBe(true);
          } else {
            expect(c.speciesId).toBe('dwarf');
          }

          if (background === null) {
            expect(c.backgroundId).toBeNull();
          } else if (background === 'random') {
            expect(ALL_BACKGROUNDS.some((b) => b.id === c.backgroundId)).toBe(true);
          } else {
            expect(c.backgroundId).toBe('soldier');
          }
        }

        if (species === 'random') {
          // A random batch of ten should not land on one species every time.
          expect(new Set(characters.map((c) => c.speciesId)).size).toBeGreaterThan(3);
        }
      });
    }
  }

  it('treats Not Specified and Random Species as different behaviours', () => {
    const unspecified = engine().generate(options({ species: null, count: 20, seed: 3 }));
    const random = engine().generate(options({ species: 'random', count: 20, seed: 3 }));
    expect(unspecified.characters.every((c) => c.speciesName === null)).toBe(true);
    expect(random.characters.every((c) => c.speciesName !== null)).toBe(true);
  });
});

describe('style and complexity', () => {
  const styles: NameStyle[] = ['traditional', 'distinctive', 'wild'];

  it.each(styles)('%s produces valid names for every species', (style) => {
    const e = engine();
    for (const spec of ALL_SPECIES) {
      const { characters } = e.generate(options({ species: spec.id, style, count: 3, seed: 11 }));
      expect(characters.length, `${spec.id} produced nothing at ${style}`).toBe(3);
      for (const c of characters) expect(validateName(c.name), `${spec.id}: ${c.name}`).toBeNull();
    }
  });

  it.each([1, 2, 3, 4, 5] as Complexity[])('complexity %i produces valid names for every species', (complexity) => {
    const e = engine();
    for (const spec of ALL_SPECIES) {
      const { characters } = e.generate(options({ species: spec.id, complexity, count: 3, seed: 5 }));
      expect(characters.length, `${spec.id} produced nothing at complexity ${complexity}`).toBe(3);
      for (const c of characters) expect(validateName(c.name), `${spec.id}: ${c.name}`).toBeNull();
    }
  });

  it('makes elaborate names longer than simple ones on average', () => {
    const measure = (complexity: Complexity): number => {
      const { characters } = engine().generate(options({ species: 'elf', complexity, count: 40, seed: 19 }));
      return characters.reduce((n, c) => n + c.name.length, 0) / characters.length;
    };
    expect(measure(5)).toBeGreaterThan(measure(1));
  });

  it('Wild reaches components Traditional rarely touches', () => {
    const heads = (style: NameStyle): Set<string> => {
      const { characters } = engine().generate(options({ species: 'dwarf', style, count: 60, seed: 23 }));
      return new Set(characters.map((c) => c.name.slice(0, 2).toLowerCase()));
    };
    // Not a strict superset — just measurably broader.
    expect(heads('wild').size).toBeGreaterThanOrEqual(heads('traditional').size);
  });
});

describe('name type', () => {
  const styles: GenderStyle[] = ['any', 'masculine', 'feminine', 'neutral'];

  it.each(styles)('%s produces valid names', (genderStyle) => {
    const { characters } = engine().generate(options({ species: 'human', genderStyle, count: 15, seed: 31 }));
    expect(characters).toHaveLength(15);
    for (const c of characters) expect(validateName(c.name)).toBeNull();
  });

  it('records the requested presentation on each result', () => {
    const { characters } = engine().generate(options({ genderStyle: 'feminine', count: 5, seed: 2 }));
    for (const c of characters) expect(c.settings.genderStyle).toBe('feminine');
  });

  it('produces different distributions for masculine and feminine on a gendered culture', () => {
    const tail = (genderStyle: GenderStyle): string[] =>
      engine().generate(options({ species: 'dwarf', genderStyle, count: 60, seed: 17 }))
        .characters.map((c) => (c.components[0]?.text ?? '').slice(-2).toLowerCase());
    const masc = new Set(tail('masculine'));
    const fem = new Set(tail('feminine'));
    const overlap = [...masc].filter((t) => fem.has(t)).length;
    // They may share some endings, but they must not be the same set.
    expect(overlap).toBeLessThan(Math.min(masc.size, fem.size));
  });
});

describe('determinism', () => {
  it('reproduces a batch exactly from the same seed', () => {
    const a = engine().generate(options({ species: 'tiefling', count: 10, seed: 123456, includeHook: true }));
    const b = engine().generate(options({ species: 'tiefling', count: 10, seed: 123456, includeHook: true }));
    expect(a.characters.map((c) => c.name)).toEqual(b.characters.map((c) => c.name));
    expect(a.characters.map((c) => c.hook)).toEqual(b.characters.map((c) => c.hook));
  });

  it('produces different batches from different seeds', () => {
    const a = engine().generate(options({ species: 'tiefling', count: 10, seed: 1 }));
    const b = engine().generate(options({ species: 'tiefling', count: 10, seed: 2 }));
    expect(a.characters.map((c) => c.name)).not.toEqual(b.characters.map((c) => c.name));
  });
});

describe('reroll', () => {
  it('returns a name that collides with none of its siblings', () => {
    const e = engine();
    const { characters } = e.generate(options({ species: 'halfling', count: 10, seed: 55 }));
    const siblings = characters.slice(1).map((c) => c.name);
    const replacement = e.reroll(options({ species: 'halfling', count: 1, seed: 56 }), siblings);
    expect(replacement).not.toBeNull();
    expect(siblings).not.toContain(replacement!.name);
    expect(replacement!.speciesId).toBe('halfling');
  });

  it('keeps the settings that were in force', () => {
    const e = engine();
    const replacement = e.reroll(
      options({ species: 'orc', background: 'guard', style: 'wild', complexity: 5, count: 1, seed: 9 }),
      [],
    );
    expect(replacement?.settings.style).toBe('wild');
    expect(replacement?.settings.complexity).toBe(5);
    expect(replacement?.backgroundId).toBe('guard');
  });
});

describe('character hooks', () => {
  it('produces one hook per name when requested, and none when not', () => {
    const on = engine().generate(options({ count: 10, includeHook: true, seed: 77 }));
    expect(on.characters.every((c) => typeof c.hook === 'string' && c.hook.length > 20)).toBe(true);
    const off = engine().generate(options({ count: 10, includeHook: false, seed: 77 }));
    expect(off.characters.every((c) => c.hook === undefined)).toBe(true);
  });

  it('writes hooks with no species and no background selected', () => {
    const { characters } = engine().generate(options({ count: 12, includeHook: true, seed: 88 }));
    for (const c of characters) {
      expect(c.hook).toMatch(/[.!?]$/);
      expect(c.hook).not.toMatch(/#|undefined|\{|\}/);
    }
  });

  it('varies hooks within a batch', () => {
    const { characters } = engine().generate(
      options({ species: 'gnome', background: 'artisan', count: 20, includeHook: true, seed: 99 }));
    const hooks = characters.map((c) => c.hook as string);
    expect(new Set(hooks).size).toBeGreaterThanOrEqual(19);
    // Nor should they all open the same way.
    expect(new Set(hooks.map((h) => h.slice(0, 14))).size).toBeGreaterThan(10);
  });

  it('avoids the generic filler the brief calls out', () => {
    const { characters } = engine().generate(options({ count: 50, includeHook: true, seed: 101 }));
    for (const c of characters) {
      expect(c.hook?.toLowerCase()).not.toMatch(/brave adventurer|seeking glory|seeks glory|on a quest for glory/);
    }
  });
});

describe('performance', () => {
  it('generates a batch of 20 in well under a second', () => {
    const e = engine();
    const started = Date.now();
    const { characters } = e.generate(options({ species: 'random', count: 20, includeHook: true }));
    const elapsed = Date.now() - started;
    expect(characters).toHaveLength(20);
    expect(elapsed).toBeLessThan(400);
  });
});
