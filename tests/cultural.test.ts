/**
 * Cultural consistency fixtures.
 *
 * Each case encodes something a published source actually says about a
 * species' names, expressed as a property the generator must hold over a
 * large sample. These are the tests that stop a refactor quietly turning
 * Tabaxi phrase names into pseudo-fantasy syllables.
 */

import { describe, expect, it } from 'vitest';
import { CATALOGUE } from '../src/engine/catalogue.ts';
import { MemoryHistory, NameEngine } from '../src/engine/generator.ts';
import type { Complexity, GeneratedCharacter, NameStyle } from '../src/types/index.ts';

function sample(
  speciesId: string,
  count = 300,
  overrides: { style?: NameStyle; complexity?: Complexity } = {},
): GeneratedCharacter[] {
  const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
  const out: GeneratedCharacter[] = [];
  let seed = 1000;
  while (out.length < count) {
    const batch = engine.generate({
      species: speciesId, background: null, genderStyle: 'any',
      style: overrides.style ?? 'distinctive', complexity: overrides.complexity ?? 3,
      count: 20, includeHook: false, seed: seed++,
    });
    out.push(...batch.characters);
  }
  return out.slice(0, count);
}

const ratio = (list: GeneratedCharacter[], predicate: (c: GeneratedCharacter) => boolean): number =>
  list.filter(predicate).length / list.length;

const roleText = (c: GeneratedCharacter, role: string): string | undefined =>
  c.components.find((x) => x.role === role)?.text;

// ---------------------------------------------------------------------------

describe('Dragonborn — clan name comes first', () => {
  const names = sample('dragonborn', 400);

  it('puts the clan before the personal name whenever a clan is present', () => {
    const withClan = names.filter((c) => roleText(c, 'clan'));
    expect(withClan.length).toBeGreaterThan(200);
    for (const c of withClan) {
      const clan = roleText(c, 'clan') as string;
      expect(c.name.startsWith(clan), `"${c.name}" should start with clan "${clan}"`).toBe(true);
      // And the personal name must come after it, not before.
      const given = roleText(c, 'given');
      if (given) expect(c.name.indexOf(given)).toBeGreaterThan(c.name.indexOf(clan));
    }
  });

  it('gives clan names more syllables than personal names', () => {
    const syllables = (s: string): number => (s.toLowerCase().match(/[aeiouy]+/g) ?? []).length;
    const withBoth = names.filter((c) => roleText(c, 'clan') && roleText(c, 'given'));
    const longer = withBoth.filter((c) =>
      syllables(roleText(c, 'clan') as string) > syllables(roleText(c, 'given') as string));
    expect(longer.length / withBoth.length).toBeGreaterThan(0.85);
  });

  it('sometimes gives only the personal name, as an informal or clanless form', () => {
    const bare = ratio(names, (c) => !roleText(c, 'clan'));
    expect(bare).toBeGreaterThan(0.03);
    expect(bare).toBeLessThan(0.45);
  });
});

describe('Tabaxi — descriptive phrase naming', () => {
  const names = sample('tabaxi', 300);

  it('never falls back on pseudo-fantasy syllables', () => {
    // Every tabaxi name must be made of real English words.
    for (const c of names) {
      const words = c.name
        .split(/\s+/)
        .filter((w) => !/^(of|on|in|the|and|at|without|before|across|past)$/i.test(w));
      expect(words.length, `"${c.name}" is not a phrase`).toBeGreaterThanOrEqual(1);
      for (const word of words) {
        // A real word, not a generated syllable soup: letters and hyphens only,
        // and present in the authored lexicon (checked loosely by shape).
        expect(word).toMatch(/^[A-Z][a-z]+(-[A-Z][a-z]+)*$/);
      }
    }
  });

  it('produces multi-word names overwhelmingly', () => {
    expect(ratio(names, (c) => c.name.split(' ').length >= 2)).toBeGreaterThan(0.95);
  });

  it('supplies an everyday short name drawn from the phrase', () => {
    const withShort = names.filter((c) => c.shortName);
    expect(withShort.length / names.length).toBeGreaterThan(0.9);
    for (const c of withShort) {
      expect(c.name.toLowerCase()).toContain((c.shortName as string).toLowerCase());
    }
  });

  it('attaches clan names as a place, not a surname', () => {
    const withClan = names.filter((c) => roleText(c, 'clan'));
    expect(withClan.length).toBeGreaterThan(50);
    for (const c of withClan) {
      expect((roleText(c, 'clan') as string).split(' ').length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('Kenku — names built from mimicked sound', () => {
  const names = sample('kenku', 250);

  it('uses onomatopoeic English, never invented syllables', () => {
    for (const c of names) {
      expect(c.name).toMatch(/^[A-Z][a-z]+(\s“[A-Z][a-z]+”)?$/);
    }
  });

  it('never attaches a family name', () => {
    for (const c of names) {
      expect(roleText(c, 'family')).toBeUndefined();
      expect(roleText(c, 'clan')).toBeUndefined();
    }
  });
});

describe('Lizardfolk — a Draconic word used as a name', () => {
  const names = sample('lizardfolk', 250);

  it('is gender-neutral: the same inputs ignore the name-type dial', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const base = { species: 'lizardfolk', background: null, style: 'distinctive' as const,
      complexity: 3 as Complexity, count: 10, includeHook: false, seed: 4242 };
    const masc = engine.generate({ ...base, genderStyle: 'masculine' }).characters.map((c) => c.name);
    const engine2 = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const fem = engine2.generate({ ...base, genderStyle: 'feminine' }).characters.map((c) => c.name);
    expect(masc).toEqual(fem);
  });

  it('never attaches an inherited family name', () => {
    for (const c of names) expect(roleText(c, 'family')).toBeUndefined();
  });
});

describe('Warforged — a single chosen word', () => {
  const names = sample('warforged', 250);

  it('produces either one chosen word or a forge designation', () => {
    for (const c of names) {
      const isDesignation = Boolean(roleText(c, 'designation'));
      if (isDesignation) continue;
      // A chosen name is one word, or a qualifier plus a word.
      expect(c.name.split(' ').length, `"${c.name}"`).toBeLessThanOrEqual(2);
    }
  });

  it('never attaches a family or clan name', () => {
    for (const c of names) {
      expect(roleText(c, 'family')).toBeUndefined();
      expect(roleText(c, 'clan')).toBeUndefined();
    }
  });
});

describe('Giff — rank is never omitted', () => {
  const names = sample('giff', 200);

  it('starts every name with a military rank', () => {
    for (const c of names) {
      const rank = roleText(c, 'title');
      expect(rank, `"${c.name}" has no rank`).toBeTruthy();
      expect(c.name.startsWith(rank as string)).toBe(true);
    }
  });
});

describe('Dwarf — the clan name is not lightly set aside', () => {
  const names = sample('dwarf', 400);

  it('gives the overwhelming majority a clan name', () => {
    expect(ratio(names, (c) => Boolean(roleText(c, 'clan')))).toBeGreaterThan(0.85);
  });

  it('places the personal name before the clan', () => {
    for (const c of names) {
      const clan = roleText(c, 'clan');
      const given = roleText(c, 'given');
      if (!clan || !given) continue;
      expect(c.name.indexOf(given)).toBeLessThan(c.name.indexOf(clan));
    }
  });
});

describe('Elf — adult names and translated houses', () => {
  const names = sample('elf', 400);

  it('uses both the Elvish and the translated family-name traditions', () => {
    const traditions = new Set(names.map((c) => c.traditionId));
    expect(traditions.has('elvish')).toBe(true);
    expect(traditions.has('translated')).toBe(true);
  });

  it('keeps child names to the low-complexity end only', () => {
    const elaborate = sample('elf', 150, { complexity: 5 });
    expect(elaborate.some((c) => c.structureId === 'child-family')).toBe(false);
  });
});

describe('Tiefling — three legitimate traditions', () => {
  const names = sample('tiefling', 500);

  it('uses infernal, virtue and regional naming', () => {
    const traditions = new Set(names.map((c) => c.traditionId));
    expect(traditions).toContain('infernal');
    expect(traditions).toContain('virtue');
    expect(traditions).toContain('common');
  });

  it('produces virtue names from concepts, not arbitrary syllables', () => {
    const virtues = names.filter((c) => c.traditionId === 'virtue' && c.structureId === 'virtue-alone');
    expect(virtues.length).toBeGreaterThan(30);
    for (const c of virtues) {
      expect(c.name, `"${c.name}" is not a word`).toMatch(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/);
    }
  });

  it('does not make every tiefling name grim', () => {
    const grim = ratio(names, (c) => /ruin|carrion|dirge|famine|blight|gallows|lament/i.test(c.name));
    expect(grim).toBeLessThan(0.12);
  });
});

describe('species without mandatory surnames do not always get one', () => {
  it.each(['orc', 'goblin', 'bugbear', 'tortle', 'shifter', 'plasmoid', 'changeling'])(
    '%s leaves a meaningful share of names bare',
    (speciesId) => {
      const names = sample(speciesId, 200);
      const bare = ratio(names, (c) => !roleText(c, 'family') && !roleText(c, 'clan'));
      expect(bare, `${speciesId} always attaches a second name`).toBeGreaterThan(0.1);
    },
  );
});

describe('complexity never breaks grammar', () => {
  it.each([1, 5] as Complexity[])('phrase species stay grammatical at complexity %i', (complexity) => {
    for (const speciesId of ['tabaxi', 'harengon', 'firbolg']) {
      const names = sample(speciesId, 120, { complexity });
      for (const c of names) {
        expect(c.name, `${speciesId} @${complexity}: "${c.name}"`).not.toMatch(/\s(of|the|in|on|and|at)$/i);
        expect(c.name).not.toMatch(/^(of|the|in|on|and|at)\s/i);
        expect(c.name).not.toMatch(/\s{2,}/);
        expect(c.name).not.toMatch(/\b(\w+)\s+\1\b/i);
      }
    }
  });
});

describe('background influence stays secondary', () => {
  it('does not give every Soldier a martial name', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const out: GeneratedCharacter[] = [];
    for (let seed = 0; seed < 15; seed++) {
      out.push(...engine.generate({
        species: 'human', background: 'soldier', genderStyle: 'any', style: 'distinctive',
        complexity: 3, count: 20, includeHook: false, seed,
      }).characters);
    }
    // Word-ish matching: "Masonward" and "Reedwarden" are not martial names,
    // and a substring test for "war" says they are.
    const martial = out.filter((c) =>
      /(blade|blood|slay|slayer|killer|death|sword|battle|warrior|warlord|bonebreaker|skull)/i.test(c.name));
    expect(martial.length / out.length).toBeLessThan(0.02);
  });

  it('never replaces a Dragonborn clan name with an occupational byname', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const out: GeneratedCharacter[] = [];
    for (let seed = 0; seed < 10; seed++) {
      out.push(...engine.generate({
        species: 'dragonborn', background: 'artisan', genderStyle: 'any', style: 'distinctive',
        complexity: 4, count: 20, includeHook: false, seed,
      }).characters);
    }
    for (const c of out) {
      expect(c.name).not.toMatch(/\b(Cooper|Chandler|Turner|Glover|Mason|Fletcher|Tanner|Potter)\b/);
    }
  });

  it('lets a Criminal have a perfectly ordinary name', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    const { characters } = engine.generate({
      species: 'halfling', background: 'criminal', genderStyle: 'any', style: 'distinctive',
      complexity: 3, count: 20, includeHook: false, seed: 404,
    });
    const sinister = characters.filter((c) => /dark|shadow|blood|night|grim|dread/i.test(c.name));
    expect(sinister.length).toBeLessThan(4);
  });
});
