/**
 * Shared "common tongue" naming material.
 *
 * Several species *documentedly* use the naming conventions of the people who
 * raised them — aasimar, many tieflings, genasi, changelings wearing a face,
 * and the Ravenloft lineages, which keep the name the person had before they
 * were changed. Rather than quietly reusing another species' generator, those
 * traditions explicitly import these shared registers and say so in the UI.
 *
 * The registers below are *original fantasy regional dialects*. They are not
 * pastiches of real-world ethnic groups: inventing a phonology and labelling
 * it with a real culture is exactly the kind of caricature the project brief
 * warns against. Each register is internally consistent and geographically
 * named for an unspecified fantasy world.
 */

import type { CompoundSet, Phonology, Producer } from '../../types/index.ts';
import { AGENTS, BEARING, BIRDS, COLOURS, HARVEST, HIGHLAND, LOWLAND, STRUCTURES, TREES, UNDERGROWTH, WATER, blend, lower, m, retag, w } from '../vocabulary/palette.ts';
import { MEDIUM, SHORT } from './_helpers.ts';

// ---------------------------------------------------------------------------
// Regional registers
// ---------------------------------------------------------------------------

/** Settled farmland and market towns. Soft Anglo-Frankish shapes. */
export const HEARTLANDS: Phonology = {
  initialOnsets: [['b', 5], ['c', 4], ['d', 4], ['f', 3], ['g', 3], ['h', 4], ['j', 2], ['l', 3], ['m', 5],
    ['n', 3], ['p', 3], ['r', 4], ['s', 4], ['t', 4], ['v', 2], ['w', 3], ['br', 2], ['cl', 1], ['cr', 2],
    ['dr', 1], ['fl', 1], ['fr', 2], ['gr', 2], ['pr', 1], ['tr', 2], ['th', 2], ['wh', 1], ['sh', 1], ['st', 2]],
  onsets: [['b', 3], ['d', 4], ['l', 5], ['m', 4], ['n', 4], ['r', 5], ['s', 3], ['t', 4], ['v', 3], ['c', 2],
    ['g', 2], ['f', 2], ['th', 2], ['w', 1], ['br', 1], ['dr', 1], ['tr', 1], ['st', 1], ['nn', 1], ['ll', 1]],
  nuclei: [['a', 7], ['e', 7], ['i', 6], ['o', 5], ['u', 3], ['ea', 2], ['ai', 2], ['ie', 2], ['ou', 1], ['y', 2]],
  codas: [['n', 5], ['r', 4], ['l', 4], ['s', 3], ['t', 3], ['d', 2], ['m', 2], ['rd', 2], ['rt', 2], ['nd', 2],
    ['st', 1], ['lk', 1], ['ck', 1], ['ll', 1], ['rn', 1]],
  finalCodas: [['n', 6], ['r', 4], ['l', 3], ['s', 3], ['t', 2], ['m', 2], ['d', 2], ['th', 1], ['rd', 1], ['ck', 1]],
  patterns: [['CV', 6], ['CVK', 5], ['V', 1], ['VK', 1]],
  finalPatterns: [['CV', 4], ['CVK', 6]],
  endings: {
    masculine: [['an', 3], ['en', 3], ['ard', 2], ['wen', 1], ['mund', 1], ['ric', 2], ['win', 2], ['bert', 1],
      ['is', 2], ['us', 1], ['el', 2], ['on', 2]],
    feminine: [['a', 5], ['ine', 3], ['elle', 2], ['wyn', 2], ['ith', 2], ['essa', 2], ['ora', 2], ['ette', 1],
      ['ia', 2], ['anne', 2]],
    neutral: [['en', 3], ['el', 3], ['is', 2], ['ar', 2], ['yn', 2], ['ae', 1], ['ow', 1], ['er', 2]],
  },
  forbidJunctures: ['qq', 'jj', 'vv', 'ww'],
  maxLength: 11,
};

/** Cold coasts and longboat country. Hard consonants, Norse-adjacent. */
export const NORTHREACH: Phonology = {
  initialOnsets: [['b', 3], ['br', 3], ['d', 3], ['dr', 2], ['f', 3], ['fr', 2], ['g', 3], ['gr', 3], ['h', 4],
    ['k', 4], ['kr', 2], ['l', 2], ['m', 3], ['n', 2], ['r', 3], ['s', 3], ['sk', 3], ['sn', 2], ['st', 3],
    ['sv', 2], ['t', 3], ['th', 4], ['thr', 2], ['v', 3], ['y', 1], ['hj', 1], ['kv', 1]],
  onsets: [['d', 3], ['g', 3], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['v', 3],
    ['th', 2], ['b', 2], ['f', 2], ['gr', 1], ['dr', 1], ['st', 1], ['sk', 1], ['ld', 1], ['nn', 1]],
  nuclei: [['a', 8], ['o', 6], ['u', 5], ['e', 4], ['i', 4], ['au', 2], ['ei', 2], ['ja', 1], ['y', 2], ['oe', 1]],
  codas: [['r', 5], ['n', 4], ['k', 4], ['ld', 3], ['rn', 3], ['rk', 3], ['st', 2], ['g', 2], ['th', 3], ['lf', 2],
    ['rd', 2], ['nd', 2], ['ng', 2], ['m', 2], ['ft', 1], ['sk', 2], ['lm', 1]],
  finalCodas: [['r', 5], ['n', 5], ['k', 3], ['th', 3], ['rn', 2], ['ld', 2], ['g', 2], ['st', 1], ['m', 2], ['nd', 1]],
  patterns: [['CVK', 7], ['CV', 4], ['VK', 1]],
  finalPatterns: [['CVK', 7], ['CV', 3]],
  endings: {
    masculine: [['ar', 4], ['ur', 3], ['grim', 1], ['vald', 1], ['leif', 1], ['mund', 1], ['nar', 2], ['kil', 1], ['orn', 2]],
    feminine: [['a', 4], ['dis', 2], ['hild', 2], ['unn', 2], ['run', 2], ['vor', 1], ['lin', 2], ['rid', 2], ['ny', 1]],
    neutral: [['en', 2], ['i', 2], ['ir', 2], ['ar', 2], ['ul', 1], ['ask', 1]],
  },
  forbidJunctures: ['kk k', 'hh'],
  maxLength: 11,
};

/** Caravan roads and walled oasis cities. Open syllables, emphatic consonants. */
export const SUNWARD: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['f', 3], ['h', 4], ['j', 3], ['k', 4], ['kh', 3], ['l', 3], ['m', 4],
    ['n', 3], ['q', 2], ['r', 3], ['s', 4], ['sh', 3], ['t', 3], ['z', 3], ['y', 2], ['gh', 2], ['th', 1], ['w', 2]],
  onsets: [['b', 2], ['d', 3], ['f', 2], ['h', 3], ['j', 2], ['l', 4], ['m', 4], ['n', 4], ['r', 4], ['s', 3],
    ['sh', 2], ['t', 3], ['z', 2], ['kh', 2], ['q', 1], ['y', 2], ['w', 1], ['dh', 1]],
  nuclei: [['a', 11], ['i', 7], ['u', 5], ['e', 4], ['o', 3], ['aa', 1], ['ai', 2], ['ei', 1], ['ia', 1]],
  codas: [['r', 4], ['n', 4], ['m', 3], ['l', 3], ['d', 2], ['s', 2], ['z', 2], ['t', 2], ['sh', 2], ['k', 2], ['f', 1], ['q', 1]],
  finalCodas: [['r', 4], ['n', 4], ['m', 3], ['l', 3], ['d', 3], ['z', 2], ['s', 2], ['sh', 2], ['f', 1]],
  patterns: [['CV', 7], ['CVK', 5], ['V', 1]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  endings: {
    masculine: [['im', 2], ['an', 3], ['ir', 3], ['ud', 2], ['ah', 1], ['az', 2], ['il', 2], ['ar', 2]],
    feminine: [['a', 6], ['ah', 3], ['iya', 2], ['een', 1], ['ira', 2], ['una', 2], ['isa', 2]],
    neutral: [['ai', 2], ['im', 2], ['an', 2], ['ur', 2], ['is', 1]],
  },
  maxLength: 11,
};

/** Grass seas and horse-herds. Liquid clusters and soft sibilants. */
export const STEPPE: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['g', 3], ['k', 3], ['l', 2], ['m', 3], ['n', 3], ['r', 2], ['s', 3],
    ['t', 3], ['v', 3], ['z', 3], ['zh', 2], ['ch', 2], ['sh', 2], ['br', 2], ['dr', 2], ['gr', 2], ['kr', 2],
    ['tr', 2], ['vl', 1], ['sl', 2], ['sv', 1], ['mst', 1], ['y', 2]],
  onsets: [['d', 3], ['g', 2], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['v', 3],
    ['z', 2], ['sh', 2], ['ch', 2], ['zh', 1], ['sk', 1], ['st', 1]],
  nuclei: [['a', 8], ['o', 6], ['i', 5], ['e', 4], ['u', 4], ['y', 2], ['ya', 2], ['io', 1], ['ei', 1]],
  codas: [['n', 5], ['r', 4], ['sh', 3], ['v', 3], ['l', 3], ['k', 3], ['s', 2], ['t', 2], ['zh', 2], ['ch', 2],
    ['nk', 2], ['st', 1], ['rk', 1], ['m', 2]],
  finalCodas: [['n', 5], ['r', 3], ['v', 3], ['sh', 3], ['k', 3], ['l', 2], ['ch', 2], ['t', 2], ['s', 2], ['zh', 1]],
  patterns: [['CVK', 6], ['CV', 5], ['V', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  endings: {
    masculine: [['ov', 3], ['ek', 2], ['an', 2], ['imir', 1], ['oslav', 1], ['ar', 2], ['ko', 2], ['ash', 2]],
    feminine: [['a', 6], ['ova', 2], ['ina', 3], ['ya', 3], ['ka', 2], ['eva', 2], ['itsa', 1]],
    neutral: [['en', 2], ['ar', 2], ['esh', 2], ['in', 2], ['oi', 1]],
  },
  maxLength: 11,
};

/** A long-collapsed river empire whose descendants keep its formal register. */
export const OLD_EMPIRE: Phonology = {
  initialOnsets: [['a', 1], ['h', 4], ['k', 3], ['kh', 3], ['m', 4], ['n', 4], ['p', 3], ['r', 3], ['s', 4],
    ['sh', 3], ['t', 4], ['th', 3], ['ts', 2], ['w', 2], ['y', 2], ['b', 2], ['d', 2], ['n', 3], ['ps', 1]],
  onsets: [['h', 3], ['k', 3], ['m', 4], ['n', 4], ['p', 2], ['r', 3], ['s', 3], ['sh', 2], ['t', 4], ['th', 2],
    ['kh', 2], ['f', 1], ['b', 1], ['d', 2], ['w', 1], ['ts', 1]],
  nuclei: [['a', 8], ['e', 5], ['i', 5], ['u', 4], ['o', 3], ['ai', 2], ['au', 1], ['ua', 1], ['ei', 1]],
  codas: [['n', 5], ['m', 4], ['r', 3], ['s', 3], ['t', 3], ['k', 2], ['kh', 2], ['sh', 2], ['f', 1], ['th', 2], ['p', 1]],
  finalCodas: [['n', 5], ['m', 4], ['s', 3], ['r', 3], ['t', 2], ['kh', 2], ['sh', 2], ['f', 1]],
  patterns: [['CV', 6], ['CVK', 6], ['V', 2], ['VK', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  endings: {
    masculine: [['es', 2], ['on', 2], ['ar', 2], ['nen', 1], ['tep', 1], ['mes', 1], ['un', 2], ['is', 2]],
    feminine: [['et', 2], ['it', 2], ['ara', 2], ['is', 2], ['ense', 1], ['ia', 2], ['ane', 2], ['ut', 1]],
    neutral: [['en', 2], ['is', 2], ['et', 2], ['ar', 1], ['am', 2]],
  },
  maxLength: 11,
};

/** Canal towns and lock-keepers. Clipped, practical, consonant-final. */
export const RIVER_CANTONS: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['f', 3], ['g', 2], ['h', 3], ['j', 2], ['k', 3], ['l', 3], ['m', 3],
    ['n', 3], ['p', 3], ['r', 3], ['s', 3], ['t', 3], ['v', 3], ['w', 2], ['z', 2], ['bl', 1], ['kl', 1],
    ['pl', 1], ['sp', 2], ['str', 1], ['sw', 1], ['tw', 1], ['vr', 1]],
  onsets: [['b', 2], ['d', 3], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['p', 2], ['r', 4], ['s', 3], ['t', 3],
    ['v', 2], ['z', 1], ['g', 2], ['f', 2], ['nk', 1], ['st', 1]],
  nuclei: [['a', 6], ['e', 7], ['i', 6], ['o', 5], ['u', 4], ['oo', 2], ['ij', 1], ['ui', 1], ['aa', 1]],
  codas: [['k', 4], ['t', 4], ['s', 3], ['n', 4], ['l', 3], ['r', 3], ['p', 2], ['m', 2], ['rt', 2], ['lk', 2],
    ['st', 2], ['nd', 1], ['ng', 1], ['ch', 1]],
  finalCodas: [['k', 4], ['t', 3], ['s', 3], ['n', 4], ['l', 3], ['r', 2], ['p', 2], ['m', 2], ['rt', 1], ['st', 1]],
  patterns: [['CVK', 7], ['CV', 4]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  endings: {
    masculine: [['ert', 1], ['ik', 2], ['os', 2], ['en', 2], ['er', 2], ['as', 2], ['ut', 1]],
    feminine: [['ke', 2], ['je', 2], ['a', 3], ['ien', 2], ['et', 2], ['sje', 1], ['il', 1]],
    neutral: [['en', 3], ['el', 2], ['ir', 2], ['ek', 2], ['is', 1]],
  },
  maxLength: 11,
};

export const REGISTERS = {
  heartlands: HEARTLANDS,
  northreach: NORTHREACH,
  sunward: SUNWARD,
  steppe: STEPPE,
  oldEmpire: OLD_EMPIRE,
  riverCantons: RIVER_CANTONS,
} as const;

// ---------------------------------------------------------------------------
// Composite producers
// ---------------------------------------------------------------------------

/** A personal name from any of the common-tongue registers. */
export const COMMON_GIVEN: Producer = {
  kind: 'oneOf',
  options: [
    [{ kind: 'phonetic', phonology: HEARTLANDS, syllables: MEDIUM }, 5],
    [{ kind: 'phonetic', phonology: NORTHREACH, syllables: SHORT }, 3],
    [{ kind: 'phonetic', phonology: SUNWARD, syllables: MEDIUM }, 3],
    [{ kind: 'phonetic', phonology: STEPPE, syllables: MEDIUM }, 3],
    [{ kind: 'phonetic', phonology: OLD_EMPIRE, syllables: MEDIUM }, 2],
    [{ kind: 'phonetic', phonology: RIVER_CANTONS, syllables: SHORT }, 2],
  ],
};

const CRAFT_WORDS = w('craft', 'hammer', 'anvil', 'quill', 'loom', 'kiln', 'ladle', 'awl', 'plane');

/** Occupational surnames: the trade, not the person's character. */
export const TRADE_SURNAME: CompoundSet = {
  first: blend(
    w('trade', 'cooper', 'fletch', 'thatch', 'tanner', 'chandler', 'mason', 'carter', 'weaver', 'glover',
      'baker', 'brewer', 'miller', 'potter', 'turner', 'salter', 'dyer', 'harrow', 'shepherd', 'wain',
      'cordwain', 'fuller', 'lister', 'wheel', 'barrel', 'candle', 'kettle'),
    retag(CRAFT_WORDS, 'trade'),
  ),
  second: lower(blend(
    w('tail', 'wright', 'smith', 'man', 'er', 'son', 'hand', 'ward', 'field', 'ton', 'ley', 'well', 'bridge'),
  )),
  casing: 'fused',
};

/** Place-based surnames: where the family is from. */
export const TOPONYM_SURNAME: CompoundSet = {
  first: blend(COLOURS, retag(TREES, 'place'), retag(HIGHLAND, 'place'), retag(LOWLAND, 'place'),
    retag(WATER, 'place'), w('place', 'north', 'south', 'east', 'west', 'nether', 'upper', 'lower', 'far', 'near', 'old', 'new')),
  second: lower(blend(
    w('tail', 'field', 'ford', 'bridge', 'gate', 'bury', 'borough', 'wick', 'thorpe', 'combe', 'stead', 'mere',
      'march', 'holt', 'hurst', 'leigh', 'bank', 'crest', 'reach', 'row', 'end', 'wold', 'haven', 'cross'),
  )),
  avoidSharedTags: ['place'],
  casing: 'fused',
};

/** Descriptive surnames drawn from bearing, animals and the natural world. */
export const DESCRIPTIVE_SURNAME: CompoundSet = {
  first: blend(retag(BEARING, 'desc'), retag(COLOURS, 'desc'), retag(BIRDS, 'desc'), retag(HARVEST, 'desc'),
    retag(UNDERGROWTH, 'desc')),
  second: lower(blend(retag(AGENTS, 'tail'), retag(STRUCTURES, 'tail'),
    w('tail', 'foot', 'hand', 'hood', 'cloak', 'coat', 'collar', 'heart', 'wit', 'step', 'brook', 'leaf'))),
  avoidSharedTags: ['desc'],
  casing: 'fused',
};

export const COMMON_SURNAME: Producer = {
  kind: 'oneOf',
  options: [
    [{ kind: 'compound', set: TRADE_SURNAME }, 4],
    [{ kind: 'compound', set: TOPONYM_SURNAME }, 4],
    [{ kind: 'compound', set: DESCRIPTIVE_SURNAME }, 3],
  ],
};

/** Shared epithet vocabulary: earned, not inherited. Never violence-coded. */
export const EARNED_EPITHET: CompoundSet = {
  first: blend(retag(BEARING, 'ep'), retag(COLOURS, 'ep'),
    w('ep', 'long', 'far', 'late', 'first', 'last', 'half', 'twice', 'thrice', 'nine', 'ten', 'lone', 'open')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'road', 'winter', 'summer', 'market', 'crossing', 'ledger', 'lantern', 'promise', 'return', 'debt', 'bargain'))),
  avoidSharedTags: ['ep'],
  casing: 'fused',
};

export const PLACE_STEMS = blend(
  retag(HIGHLAND, 'geo'), retag(LOWLAND, 'geo'), retag(WATER, 'geo'), retag(TREES, 'geo'),
  [m('ashford', 'ash ford', ['geo']), m('stonemarch', 'stone march', ['geo']), m('lowmere', 'low mere', ['geo'])],
);
