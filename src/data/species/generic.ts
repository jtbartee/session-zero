/**
 * The "Not Specified" naming model.
 *
 * When a user leaves species unset they are asking for a name that fits a
 * fantasy world without committing to a people. This is NOT another species'
 * generator wearing a disguise: it is its own set of four original phonologies
 * plus the shared common-tongue registers, with surnames applied less often
 * than any single culture would.
 */

import type { CompoundSet, Phonology, SpeciesSpec, VirtueSet } from '../../types/index.ts';
import {
  AGENTS, BEARING, BIRDS, COLOURS, CONCEPTS, HIGHLAND, LIGHT, LOWLAND, STONE, TREES, UNDERGROWTH,
  VIRTUES, WATER, WEATHER, blend, lower, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { MEDIUM, S, SHORT, ST } from './_helpers.ts';

/** Open, liquid, vowel-forward. */
const PAN_FLOWING: Phonology = {
  initialOnsets: [['l', 4], ['m', 4], ['n', 4], ['r', 4], ['s', 4], ['t', 3], ['v', 3], ['th', 3], ['k', 3],
    ['d', 3], ['f', 2], ['b', 2], ['g', 2], ['y', 2], ['h', 2], ['el', 1], ['il', 1], ['sh', 2], ['c', 2]],
  onsets: [['l', 5], ['n', 5], ['r', 5], ['m', 4], ['s', 3], ['v', 3], ['th', 3], ['d', 3], ['t', 3], ['n', 2],
    ['ll', 2], ['rr', 1], ['nn', 1], ['k', 2], ['y', 1]],
  nuclei: [['a', 8], ['e', 7], ['i', 6], ['o', 5], ['u', 3], ['ae', 2], ['ia', 2], ['ea', 2], ['ai', 2], ['y', 2]],
  codas: [['n', 5], ['l', 4], ['r', 4], ['s', 3], ['th', 2], ['m', 2], ['nd', 1]],
  finalCodas: [['n', 5], ['l', 4], ['r', 3], ['s', 3], ['th', 2], ['m', 2]],
  patterns: [['CV', 7], ['CVK', 5], ['V', 1]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  endings: {
    masculine: [['an', 3], ['en', 2], ['or', 2], ['ir', 2], ['us', 2], ['on', 2], ['el', 2], ['as', 2]],
    feminine: [['a', 5], ['ia', 3], ['elle', 2], ['wen', 2], ['ara', 2], ['ine', 2], ['is', 2]],
    neutral: [['en', 3], ['el', 3], ['is', 2], ['ae', 2], ['yn', 2], ['ir', 2]],
  },
};

/** Clipped, consonant-final, grounded. */
const PAN_GROUNDED: Phonology = {
  initialOnsets: [['b', 3], ['br', 2], ['d', 3], ['dr', 2], ['f', 3], ['g', 3], ['gr', 2], ['h', 3], ['k', 4],
    ['kr', 2], ['m', 3], ['n', 3], ['r', 2], ['s', 3], ['st', 3], ['t', 3], ['th', 3], ['v', 2], ['w', 2], ['sk', 2]],
  onsets: [['b', 2], ['d', 3], ['g', 2], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['r', 4], ['s', 3], ['t', 3],
    ['th', 2], ['v', 2], ['dr', 1], ['gr', 1]],
  nuclei: [['a', 8], ['o', 6], ['e', 5], ['u', 5], ['i', 4], ['au', 1], ['ei', 1]],
  codas: [['r', 4], ['n', 4], ['k', 3], ['rn', 3], ['ld', 2], ['rk', 2], ['st', 2], ['th', 2], ['m', 3], ['g', 2], ['nd', 2]],
  finalCodas: [['n', 5], ['r', 4], ['k', 3], ['th', 2], ['m', 3], ['rn', 2], ['st', 1], ['ld', 1]],
  patterns: [['CVK', 7], ['CV', 4]],
  finalPatterns: [['CVK', 7], ['CV', 3]],
  endings: {
    masculine: [['ar', 3], ['or', 2], ['ek', 2], ['un', 2], ['in', 2], ['os', 2]],
    feminine: [['a', 5], ['ra', 2], ['na', 2], ['wyn', 2], ['da', 2], ['eth', 2]],
    neutral: [['en', 3], ['ir', 2], ['ar', 2], ['ek', 2], ['um', 1]],
  },
};

/** Bright, sibilant, quick. */
const PAN_BRIGHT: Phonology = {
  initialOnsets: [['s', 4], ['sh', 3], ['t', 3], ['tr', 2], ['k', 3], ['kl', 2], ['p', 3], ['pr', 2], ['f', 3],
    ['fl', 2], ['z', 2], ['j', 2], ['ch', 2], ['v', 2], ['n', 3], ['m', 3], ['l', 3], ['r', 2], ['qu', 1], ['w', 2]],
  onsets: [['s', 3], ['t', 3], ['k', 3], ['l', 4], ['n', 4], ['m', 3], ['r', 3], ['v', 2], ['z', 2], ['sh', 2],
    ['ch', 1], ['p', 2], ['f', 2], ['ss', 1]],
  nuclei: [['i', 8], ['e', 7], ['a', 6], ['y', 3], ['o', 3], ['u', 2], ['ie', 2], ['ea', 2], ['ei', 1]],
  codas: [['s', 4], ['t', 3], ['n', 4], ['l', 3], ['sh', 2], ['k', 3], ['x', 2], ['st', 2], ['sk', 1], ['ck', 2]],
  finalCodas: [['s', 4], ['n', 4], ['t', 3], ['l', 3], ['x', 2], ['sh', 2], ['ck', 2]],
  patterns: [['CV', 6], ['CVK', 6]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  endings: {
    masculine: [['is', 3], ['os', 2], ['ix', 2], ['en', 2], ['et', 2], ['ar', 2]],
    feminine: [['a', 4], ['is', 2], ['ette', 2], ['ina', 2], ['ys', 2], ['ia', 2]],
    neutral: [['ix', 3], ['is', 3], ['et', 2], ['yn', 2], ['el', 2]],
  },
};

/** Low, breathy, archaic. */
const PAN_DEEP: Phonology = {
  initialOnsets: [['h', 4], ['th', 4], ['v', 3], ['m', 4], ['n', 3], ['g', 3], ['gh', 2], ['b', 3], ['d', 3],
    ['w', 3], ['r', 3], ['l', 3], ['z', 2], ['dh', 2], ['kh', 2], ['o', 1], ['u', 1], ['a', 1]],
  onsets: [['h', 3], ['th', 3], ['v', 3], ['m', 4], ['n', 4], ['r', 4], ['l', 3], ['g', 2], ['d', 3], ['b', 2],
    ['w', 2], ['dh', 1], ['z', 1]],
  nuclei: [['o', 8], ['u', 7], ['a', 6], ['e', 4], ['oa', 2], ['ou', 2], ['ua', 1], ['i', 3]],
  codas: [['m', 4], ['n', 4], ['th', 3], ['r', 3], ['l', 3], ['gh', 2], ['v', 2], ['rn', 2], ['lm', 1], ['ng', 2]],
  finalCodas: [['m', 4], ['n', 4], ['th', 3], ['r', 3], ['l', 2], ['gh', 2], ['ng', 1]],
  patterns: [['CVK', 6], ['CV', 5], ['VK', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  endings: {
    masculine: [['oth', 2], ['um', 2], ['or', 3], ['an', 2], ['ul', 2]],
    feminine: [['a', 4], ['oa', 2], ['una', 2], ['eth', 2], ['ora', 2]],
    neutral: [['om', 2], ['uth', 2], ['ar', 2], ['en', 2], ['ol', 2]],
  },
};

const PAN_SURNAME: CompoundSet = {
  first: blend(retag(LIGHT, 'img'), retag(WEATHER, 'img'), retag(STONE, 'img'), retag(TREES, 'img'),
    retag(WATER, 'img'), retag(HIGHLAND, 'img'), retag(LOWLAND, 'img'), retag(BIRDS, 'img'),
    retag(UNDERGROWTH, 'img'), retag(COLOURS, 'col'), retag(BEARING, 'q')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'mark', 'march', 'reach', 'fall', 'rise', 'gate', 'cross', 'hollow', 'ridge', 'bank', 'light',
      'shade', 'wind', 'song', 'stride', 'hand', 'heart', 'vale', 'barrow', 'haven'))),
  avoidSharedTags: ['img', 'col', 'q'],
  casing: 'fused',
};

const PAN_CHOSEN: VirtueSet = {
  concepts: blend(VIRTUES, CONCEPTS),
  qualifiers: w('qualifier', 'Ever', 'Half', 'Lesser', 'Latter', 'Quiet', 'Unbroken', 'Second'),
  qualifierChance: { 1: 0.02, 2: 0.06, 3: 0.14, 4: 0.26, 5: 0.4 },
  casing: 'spaced',
};

/**
 * Not registered in the species picker — the engine reaches for it directly
 * whenever `species` is `null`.
 */
export const GENERIC: SpeciesSpec = {
  id: '__generic__',
  name: 'Unspecified',
  tier: 'core',
  group: 'Unspecified',
  sources: ['Original to Session Zero'],
  confidence: 'original',
  loreNotes: [
    'Used when no species is chosen. Four original phonologies plus the shared common-tongue registers produce a name that reads as fantasy without claiming any particular people.',
    'Surnames appear less often here than in any single culture, because an unspecified character should not be quietly assigned a family tradition.',
  ],
  citations: [],
  traditions: [
    {
      id: 'unspecified',
      label: 'Unspecified',
      weight: 1,
      note: 'A general fantasy-compatible name with no cultural claim.',
      genderPolicy: 'mixed',
      producers: {
        given: {
          kind: 'oneOf',
          options: [
            [{ kind: 'phonetic', phonology: PAN_FLOWING, syllables: MEDIUM }, 5],
            [{ kind: 'phonetic', phonology: PAN_GROUNDED, syllables: SHORT }, 4],
            [{ kind: 'phonetic', phonology: PAN_BRIGHT, syllables: MEDIUM }, 4],
            [{ kind: 'phonetic', phonology: PAN_DEEP, syllables: SHORT }, 3],
            [COMMON_GIVEN, 5],
          ],
        },
        surname: {
          kind: 'oneOf',
          options: [
            [{ kind: 'compound', set: PAN_SURNAME }, 5],
            [COMMON_SURNAME, 4],
          ],
        },
        chosen: { kind: 'virtue', set: PAN_CHOSEN },
      },
      structures: [
        ST('given-surname', 8, [S('given', 'given'), S('family', 'surname', { label: 'Family' })]),
        ST('given-alone', 6, [S('given', 'given')]),
        ST('given-of-place', 2, [S('given', 'given'), S('descriptor', 'surname', { prefix: 'of ', label: 'From' })],
          { minComplexity: 2 }),
        ST('given-chosen', 1.5, [S('given', 'given'),
          S('epithet', 'chosen', { separator: ', ', prefix: 'called ', label: 'Called' })],
          { minComplexity: 3 }),
        ST('chosen-alone', 1, [S('given', 'chosen', { label: 'Chosen name' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a town on a trade road', 'a borderland', 'a river valley', 'a port', 'a highland village'],
    sp_thing: ['an object they did not choose to inherit', 'a letter with no return address',
      'a debt that predates them'],
    sp_trait: ['is better at one specific thing than anyone expects',
      'has a habit from a life they no longer lead'],
  },
};
