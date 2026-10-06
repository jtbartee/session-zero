/**
 * Name validation, including the cases that made the first implementation
 * wrong in both directions.
 */

import { describe, expect, it } from 'vitest';
import { __testing, validateName } from '../src/engine/validation.ts';
import { CATALOGUE } from '../src/engine/catalogue.ts';
import { MemoryHistory, NameEngine } from '../src/engine/generator.ts';

describe('acceptance', () => {
  it.each([
    'Bram Ironfist',
    'Thora Stonehelm',
    'Amakiirel Moonwhisper',
    'Cloud on the Mountaintop of Distant Rain',
    'Sergeant Brunhold Powderworthy',
    'Ja’adoc of Veth’kith',
    'Left-Handed Hummingbird',
    'Unit Seven “Tock”',
    'Nevertheless',
  ])('accepts %s', (name) => {
    expect(validateName(name)).toBeNull();
  });
});

describe('pronounceability', () => {
  it('rejects a word with no vowel', () => expect(validateName('Brkktl')).toBe('no-vowel'));
  it('rejects a consonant pileup', () => expect(validateName('Vaklpmtur')).toBe('consonant-pileup'));
  it('allows a legitimate cluster that reads as fewer sounds', () => {
    // "str" and "th" are single units, so "Thrakstrond" is sayable.
    expect(validateName('Thrakstrond')).toBeNull();
  });
  it('rejects a vowel pileup', () => expect(validateName('Aeiouan')).toBe('vowel-pileup'));
  it('rejects a tripled letter', () => expect(validateName('Thrennnar')).toBe('repeated-letter'));
  it('rejects a stuttered syllable', () => expect(validateName('Baladalada')).toBe('stutter'));
  it('rejects too much punctuation', () => expect(validateName("Ka'a'a'an")).toBe('punctuation-overload'));
  it('rejects an over-long word', () => expect(validateName('Verthisathurgieshalomar')).toBe('too-long'));
  it('rejects an empty name', () => expect(validateName('   ')).toBe('empty'));

  it('counts digraphs as one consonant', () => {
    // th-r-sh is three units, not six letters' worth.
    expect(__testing.longestConsonantRun('thrsh')).toBeLessThanOrEqual(3);
    expect(validateName('Thrashen')).toBeNull();
  });

  it('judges a hyphenated compound by its longest segment', () => {
    expect(validateName('Escapement-Ninety-Six')).toBeNull();
  });
});

describe('canonical names', () => {
  it.each(['Drizzt', 'Legolas Greenleaf', 'Elminster', 'Tasslehoff', 'Geralt', 'Gandalf'])(
    'rejects %s', (name) => expect(validateName(name)).toBe('canonical'));

  it('rejects a near-miss on a long canonical name', () => {
    expect(validateName('Drizzta')).toBe('canonical');
    expect(validateName('Legolan')).toBe('canonical');
  });

  it('does not reject an unrelated name that merely shares a few letters', () => {
    expect(validateName('Dravin')).toBeNull();
    expect(validateName('Elmara Stonebrook')).toBeNull();
  });
});

describe('profanity screening', () => {
  const { wordIsProfane, rot13 } = __testing;

  it('catches a slur inside a generated word', () => {
    expect(wordIsProfane(rot13('puvaxnt'))).toBe(true);
    expect(validateName(`${rot13('tbbx')}esh`)).toBe('profanity');
  });

  it('does not fire across a word boundary', () => {
    // "Quiet Water" flattens to a string containing a slur; it is not one.
    expect(validateName('Quiet Water')).toBeNull();
    expect(validateName('Silentwatch')).toBeNull();
    expect(validateName('Quietwatcher of the Still Pool')).toBeNull();
  });

  it('does not fire on ordinary English that contains a short term', () => {
    for (const word of ['Scrape', 'Scraper', 'Grape', 'Drapes', 'Raccoon', 'Spice', 'Therapist']) {
      expect(validateName(word), `"${word}" was flagged`).toBeNull();
    }
  });

  it('catches a mild term used as a whole word', () => {
    expect(validateName(rot13('fyhg'))).toBe('profanity');
  });
});

describe('banned substrings per species', () => {
  it('honours a species-specific ban list', () => {
    expect(validateName('Thalomir', { banned: ['thalo'] })).toBe('banned-substring');
    expect(validateName('Thalomir')).toBeNull();
  });
});

describe('every generated name passes validation', () => {
  it('holds across every species, style and complexity', () => {
    const engine = new NameEngine({ catalogue: CATALOGUE, history: new MemoryHistory(600) });
    let checked = 0;
    for (const spec of CATALOGUE.pickableSpecies) {
      for (const style of ['traditional', 'distinctive', 'wild'] as const) {
        for (const complexity of [1, 3, 5] as const) {
          const { characters } = engine.generate({
            species: spec.id, background: 'merchant', genderStyle: 'any',
            style, complexity, count: 5, includeHook: false, seed: 909,
          });
          for (const c of characters) {
            expect(validateName(c.name, { banned: spec.banned }),
              `${spec.id}/${style}/${complexity}: "${c.name}"`).toBeNull();
            checked++;
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(2000);
  });
});
