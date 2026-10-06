/**
 * Planar and psionic peoples.
 */

import type { CompoundSet, MorphSet, Phonology, SpeciesSpec } from '../../types/index.ts';
import {
  AGENTS, FIRE, GEMS, LIGHT, METALS, SEA_LIFE, STONE, WATER, blend, lower, m, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { LONG, MEDIUM, S, SHORT, ST } from './_helpers.ts';

const PLANAR_GROUP = 'Expanded — Planar and psionic';

// ===========================================================================
// GENASI — four elemental traditions in one species
// ===========================================================================

function elementalPhonology(base: Partial<Phonology>): Phonology {
  return {
    initialOnsets: [['m', 3], ['n', 3], ['l', 3], ['r', 3], ['s', 3], ['t', 3], ['k', 3], ['d', 3], ['v', 2],
      ['z', 2], ['h', 3], ['j', 2], ['sh', 2], ['th', 2], ['b', 2], ['g', 2], ['y', 2]],
    onsets: [['m', 3], ['n', 4], ['l', 4], ['r', 4], ['s', 3], ['t', 3], ['k', 2], ['d', 3], ['v', 2], ['z', 2],
      ['h', 2], ['sh', 2], ['th', 2]],
    nuclei: [['a', 7], ['i', 6], ['e', 5], ['u', 4], ['o', 4]],
    codas: [['n', 4], ['r', 4], ['l', 3], ['s', 3], ['m', 3], ['th', 2], ['k', 2]],
    finalCodas: [['n', 4], ['r', 4], ['l', 3], ['s', 3], ['m', 2], ['th', 2]],
    patterns: [['CV', 6], ['CVK', 5]],
    finalPatterns: [['CVK', 5], ['CV', 5]],
    maxJunctureCluster: 2,
    endings: {
      masculine: [['an', 3], ['ir', 2], ['us', 2], ['ar', 2], ['im', 2]],
      feminine: [['a', 4], ['ia', 2], ['ara', 2], ['ine', 2], ['is', 2]],
      neutral: [['en', 3], ['ir', 2], ['is', 2], ['ael', 2], ['ur', 2]],
    },
    ...base,
  };
}

const AIR_PHON = elementalPhonology({
  initialOnsets: [['f', 3], ['h', 4], ['l', 3], ['m', 2], ['n', 2], ['s', 4], ['sh', 3], ['t', 2], ['th', 3],
    ['v', 3], ['w', 4], ['y', 3], ['z', 2], ['hw', 2], ['sw', 2], ['a', 1], ['e', 1], ['i', 1]],
  nuclei: [['a', 6], ['e', 6], ['i', 7], ['ae', 3], ['ia', 3], ['ea', 3], ['y', 3], ['o', 2]],
  codas: [['l', 4], ['n', 3], ['r', 3], ['s', 3], ['sh', 3], ['th', 3], ['ff', 1]],
  patterns: [['CV', 8], ['CVK', 3], ['V', 2]],
});
const EARTH_PHON = elementalPhonology({
  initialOnsets: [['b', 3], ['br', 2], ['d', 4], ['dr', 2], ['g', 4], ['gr', 3], ['k', 3], ['kr', 2], ['m', 3],
    ['n', 3], ['r', 2], ['t', 3], ['th', 2], ['v', 2], ['z', 2], ['st', 2]],
  nuclei: [['a', 8], ['o', 8], ['u', 7], ['e', 3], ['i', 3]],
  codas: [['k', 4], ['g', 3], ['rn', 3], ['rd', 3], ['n', 4], ['m', 4], ['l', 3], ['st', 2], ['ld', 2]],
  finalCodas: [['k', 4], ['n', 4], ['m', 4], ['rn', 3], ['rd', 2], ['g', 2], ['l', 2]],
  patterns: [['CVK', 8], ['CV', 3]],
});
const FIRE_PHON = elementalPhonology({
  initialOnsets: [['k', 4], ['kh', 3], ['p', 3], ['t', 3], ['tr', 2], ['s', 3], ['sh', 3], ['z', 3], ['j', 3],
    ['r', 3], ['h', 3], ['ch', 3], ['b', 2], ['d', 2], ['f', 2], ['g', 2], ['v', 2]],
  nuclei: [['a', 8], ['i', 7], ['e', 5], ['u', 4], ['ai', 2], ['au', 2]],
  codas: [['sh', 4], ['k', 4], ['z', 3], ['r', 4], ['n', 3], ['ch', 2], ['kh', 2], ['rk', 2]],
  finalCodas: [['sh', 4], ['k', 4], ['r', 4], ['z', 3], ['n', 3], ['kh', 2]],
  patterns: [['CVK', 7], ['CV', 4]],
});
const WATER_PHON = elementalPhonology({
  initialOnsets: [['l', 4], ['m', 4], ['n', 4], ['s', 3], ['sh', 3], ['t', 2], ['th', 3], ['v', 3], ['w', 3],
    ['y', 2], ['d', 3], ['b', 2], ['f', 2], ['h', 2], ['z', 2]],
  nuclei: [['a', 6], ['o', 6], ['u', 6], ['ua', 3], ['oo', 3], ['e', 4], ['ia', 2], ['i', 4]],
  codas: [['l', 5], ['n', 5], ['m', 4], ['r', 3], ['th', 3], ['s', 3], ['v', 2]],
  finalCodas: [['l', 5], ['n', 5], ['m', 3], ['th', 3], ['r', 3], ['s', 2]],
  patterns: [['CV', 8], ['CVK', 4]],
});

function elementalSurname(first: ReturnType<typeof w>, tails: string[]): CompoundSet {
  return {
    first,
    second: lower(blend(retag(AGENTS, 'tail'), w('tail', ...tails))),
    avoidSharedTags: ['elem'],
    casing: 'fused',
  };
}

export const GENASI: SpeciesSpec = {
  id: 'genasi', name: 'Genasi', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Monsters of the Multiverse', 'Elemental Evil Player’s Companion'],
  confidence: 'documented',
  loreNotes: [
    'Genasi use the naming conventions of whoever raised them; the shared common-tongue registers cover that case and the result says so.',
    'Many also carry a name marking their elemental manifestation, and the four elemental lines — air, earth, fire and water — sound noticeably different from one another.',
    'Each element below is a separate naming tradition within this one species entry, rather than four duplicate species.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'fostered', label: 'Name of the people who raised them', weight: 5,
      note: 'An ordinary name from wherever a genasi grew up.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME },
      structures: [
        ST('given-family', 8, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
      ],
    },
    {
      id: 'air', label: 'Air genasi', weight: 3,
      note: 'A name shaped by the Plane of Air: open, breathy, unresolved.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: AIR_PHON, syllables: MEDIUM },
        mark: { kind: 'compound', set: elementalSurname(
          w('elem', 'sky', 'cloud', 'gale', 'breath', 'thin', 'high', 'open', 'swift', 'bright', 'far'),
          ['wind', 'voice', 'whisper', 'rise', 'draught', 'span', 'reach', 'turn']) },
      },
      structures: [
        ST('given-mark', 7, [S('given', 'given'), S('family', 'mark', { label: 'Elemental name' })]),
        ST('given-alone', 5, [S('given', 'given')]),
      ],
    },
    {
      id: 'earth', label: 'Earth genasi', weight: 3,
      note: 'A name shaped by the Plane of Earth: closed, weighted, slow.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: EARTH_PHON, syllables: SHORT },
        mark: { kind: 'compound', set: elementalSurname(
          blend(retag(STONE, 'elem'), retag(METALS, 'elem'), retag(GEMS, 'elem')),
          ['set', 'bed', 'seam', 'root', 'weight', 'ground', 'rest', 'hold']) },
      },
      structures: [
        ST('given-mark', 7, [S('given', 'given'), S('family', 'mark', { label: 'Elemental name' })]),
        ST('given-alone', 5, [S('given', 'given')]),
      ],
    },
    {
      id: 'fire', label: 'Fire genasi', weight: 3,
      note: 'A name shaped by the Plane of Fire: bright, sharp, quick to close.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: FIRE_PHON, syllables: MEDIUM },
        mark: { kind: 'compound', set: elementalSurname(
          blend(retag(FIRE, 'elem'), retag(LIGHT, 'elem')),
          ['catch', 'glow', 'lick', 'flare', 'tongue', 'kindle', 'crown', 'brand']) },
      },
      structures: [
        ST('given-mark', 7, [S('given', 'given'), S('family', 'mark', { label: 'Elemental name' })]),
        ST('given-alone', 5, [S('given', 'given')]),
      ],
    },
    {
      id: 'water', label: 'Water genasi', weight: 3,
      note: 'A name shaped by the Plane of Water: liquid, rounded, continuous.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: WATER_PHON, syllables: MEDIUM },
        mark: { kind: 'compound', set: elementalSurname(
          blend(retag(WATER, 'elem'), retag(SEA_LIFE, 'elem')),
          ['run', 'pull', 'draw', 'fall', 'swell', 'turn', 'fold', 'gather']) },
      },
      structures: [
        ST('given-mark', 7, [S('given', 'given'), S('family', 'mark', { label: 'Elemental name' })]),
        ST('given-alone', 5, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a planar breach', 'a town built over a vent', 'an elemental shrine', 'a cistern'],
    sp_thing: ['a manifestation that arrived without warning', 'a family who did not know what to do with them'],
    sp_trait: ['makes the temperature of a room noticeably wrong', 'is asked to perform their element at parties'],
  },
};

// ===========================================================================
// GITHYANKI / GITHZERAI
// ===========================================================================

const GITH_BASE: Phonology = {
  initialOnsets: [['b', 2], ['d', 3], ['f', 2], ['g', 3], ['gr', 2], ['h', 2], ['j', 2], ['k', 3], ['kr', 2],
    ['l', 2], ['m', 2], ['n', 2], ['p', 2], ['q', 2], ['r', 2], ['s', 3], ['sh', 2], ['t', 3], ['th', 2],
    ['tr', 2], ['v', 3], ['x', 2], ['z', 3], ['zh', 2]],
  onsets: [['d', 3], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['r', 4], ['s', 3], ['t', 3], ['v', 2], ['z', 2],
    ['th', 2], ['sh', 2], ['x', 1], ['g', 2]],
  nuclei: [['a', 8], ['i', 7], ['u', 5], ['e', 5], ['o', 4]],
  codas: [['th', 4], ['s', 4], ['n', 4], ['r', 4], ['k', 3], ['sh', 3], ['l', 3], ['z', 2], ['m', 2], ['rth', 1]],
  finalCodas: [['th', 5], ['s', 4], ['n', 4], ['k', 3], ['r', 3], ['sh', 3], ['l', 2], ['z', 2]],
  patterns: [['CVK', 7], ['CV', 4], ['VK', 1]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  maxJunctureCluster: 3,
};

const GITHYANKI_PHON: Phonology = {
  ...GITH_BASE,
  internalMark: { mark: "'", chance: 0.3 },
  endings: {
    masculine: [['an', 2], ['os', 2], ['ith', 2], ['ar', 2], ['us', 2], ['ac', 1]],
    feminine: [['a', 3], ['el', 2], ['ir', 2], ['anne', 1], ['ia', 2], ['yl', 2]],
    neutral: [['ith', 3], ['as', 2], ['el', 2], ['un', 2], ['ir', 2]],
  },
};

const GITHZERAI_PHON: Phonology = {
  ...GITH_BASE,
  nuclei: [['a', 7], ['u', 8], ['e', 6], ['i', 5], ['o', 3], ['uu', 3]],
  patterns: [['CVK', 9], ['CV', 2]],
  finalPatterns: [['CVK', 9], ['CV', 1]],
  endings: {
    masculine: [['th', 2], ['rm', 2], ['rk', 2], ['z', 2], ['g', 2], ['rth', 1]],
    feminine: [['a', 4], ['ya', 3], ['eya', 2], ['axa', 1], ['in', 2]],
    neutral: [['th', 3], ['rm', 2], ['zh', 2], ['ek', 2], ['un', 2]],
  },
};

const GITHYANKI_HOUSE: MorphSet = {
  initial: [
    m('Tu', 'the red throne'), m('Kar', 'the first blade'), m('Veth', 'the silver flight'),
    m('Zan', 'the long raid'), m('Orr', 'the broken crèche'), m('Shaa', 'the knife of dawn'),
    m('Mel', 'the quiet court'), m('Draa', 'the far wing'), m('Ix', 'the hollow tower'),
    m('Rhen', 'the second oath'),
  ],
  final: [
    m('kith', 'brood'), m('zaar', 'wing'), m('moth', 'line'), m('vash', 'standing'), m('rakh', 'house'),
    m('thir', 'keep'), m('sul', 'crèche'), m('nath', 'blood'),
  ],
  linkers: [["'", 6], ['', 5], ['a', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [[2, 8], [3, 2]] },
};

export const GITHYANKI: SpeciesSpec = {
  id: 'githyanki', name: 'Githyanki', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'documented',
  loreNotes: [
    'Published githyanki names are hard and angular, frequently carrying an internal apostrophe, with -th and -s endings common.',
    'Githyanki organise by crèche rather than family; the crèche or house name is the second element where one is used.',
    'The specific house vocabulary here is original; the apostrophised shape follows published examples.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'creche', label: 'Name and crèche', weight: 10,
      note: 'A hard personal name, sometimes with the crèche a githyanki was raised in.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: GITHYANKI_PHON, syllables: MEDIUM },
        house: { kind: 'morph', set: GITHYANKI_HOUSE },
      },
      structures: [
        ST('given-alone', 7, [S('given', 'given')]),
        ST('given-house', 6, [S('given', 'given'), S('clan', 'house', { prefix: 'of ', label: 'Crèche' })]),
        ST('given-house-plain', 2.5, [S('given', 'given'), S('clan', 'house', { label: 'Crèche' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a crèche on a dead god', 'an astral fortress', 'a raiding camp they walked away from'],
    sp_thing: ['a silver sword with no owner', 'an obligation to a queen they no longer serve'],
    sp_trait: ['assumes command of any situation within a minute', 'is still learning what leisure is for'],
  },
};

export const GITHZERAI: SpeciesSpec = {
  id: 'githzerai', name: 'Githzerai', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'documented',
  loreNotes: [
    'Published githzerai names are shorter and blunter than githyanki ones, heavy with doubled vowels and consonant endings, and carry no apostrophes.',
    'Githzerai identify by the monastery they trained in rather than by family. The monastery names here are original.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'monastery', label: 'Name and monastery', weight: 10,
      note: 'A blunt personal name, often with the monastery that trained them.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: GITHZERAI_PHON, syllables: SHORT },
        monastery: { kind: 'phonetic', phonology: GITHZERAI_PHON, syllables: LONG },
      },
      structures: [
        ST('given-alone', 7, [S('given', 'given')]),
        ST('given-monastery', 6, [S('given', 'given'),
          S('clan', 'monastery', { prefix: 'of ', label: 'Monastery' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a monastery anchored to nothing', 'a stone fortress in Limbo', 'a meditation hall'],
    sp_thing: ['a discipline they practise daily and will not discuss', 'a teaching they have begun to doubt'],
    sp_trait: ['is entirely unmoved by chaos', 'answers a question with a better question'],
  },
};

// ===========================================================================
// KALASHTAR
// ===========================================================================

const KALASHTAR_PHON: Phonology = {
  initialOnsets: [['b', 2], ['ch', 2], ['d', 3], ['h', 3], ['k', 3], ['kh', 2], ['l', 3], ['m', 3], ['n', 3],
    ['r', 2], ['s', 3], ['sh', 3], ['t', 3], ['th', 3], ['v', 3], ['y', 2], ['j', 2], ['g', 2], ['p', 2],
    ['dh', 2], ['bh', 1], ['hr', 1], ['kr', 1], ['pr', 1], ['tr', 1], ['vr', 1], ['z', 2], ['f', 2]],
  onsets: [['l', 4], ['m', 3], ['n', 3], ['r', 4], ['s', 3], ['sh', 2], ['t', 3], ['th', 3], ['v', 3], ['d', 3],
    ['k', 2], ['y', 2], ['h', 2], ['b', 2], ['g', 2], ['p', 2], ['z', 2], ['dh', 1], ['j', 1], ['ll', 1], ['nn', 1]],
  nuclei: [['a', 9], ['u', 6], ['i', 6], ['e', 5], ['o', 4], ['aa', 3], ['ee', 2], ['ai', 2], ['ia', 2], ['oo', 2]],
  codas: [['l', 3], ['n', 3], ['r', 3], ['s', 2], ['t', 2], ['sh', 2], ['m', 2], ['th', 2], ['v', 1]],
  finalCodas: [['l', 3], ['n', 3], ['r', 3], ['t', 2], ['m', 2], ['sh', 1]],
  patterns: [['CV', 9], ['CVK', 2]],
  finalPatterns: [['CV', 9], ['CVK', 1]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['ram', 4], ['harath', 3], ['vir', 2], ['tash', 2], ['dan', 2]],
    feminine: [['ra', 4], ['shana', 3], ['lata', 2], ['ani', 2], ['vei', 2]],
    neutral: [['tal', 3], ['sha', 3], ['ren', 2], ['vai', 2], ['ash', 2]],
  },
  maxLength: 11,
};

const QUORI_NAME: Phonology = {
  ...KALASHTAR_PHON,
  endings: undefined,
  nuclei: [['a', 8], ['u', 7], ['i', 6], ['e', 4], ['o', 4]],
};

export const KALASHTAR: SpeciesSpec = {
  id: 'kalashtar', name: 'Kalashtar', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Eberron: Rising from the Last War', 'Monsters of the Multiverse', 'Eberron: Forge of the Artificer'],
  confidence: 'documented',
  loreNotes: [
    'A kalashtar name blends a personal element with the name of the bonded quori spirit; published names are almost always two syllables.',
    'Gender is marked by a soft suffix, and the spirit’s gender identity need not match the kalashtar’s — so a kalashtar of any identity may carry any of these suffixes. This generator does not enforce a match.',
    'The quori spirit’s own name is not spoken to outsiders, which is why it appears here only at the most elaborate settings and is labelled as unspoken.',
  ],
  citations: [
    'https://www.dndbeyond.com/species',
    'https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf',
  ],
  traditions: [
    {
      id: 'bonded', label: 'Bonded name', weight: 10,
      note: 'A personal element fused with the bonded spirit’s, two syllables, softly suffixed.',
      genderPolicy: 'mixed',
      producers: {
        // Two syllables is the documented norm, so the table barely deviates.
        given: {
          kind: 'phonetic',
          phonology: KALASHTAR_PHON,
          syllables: {
            1: [[1, 2], [2, 8]],
            2: [[1, 1], [2, 9]],
            3: [[2, 9], [3, 1]],
            4: [[2, 8], [3, 2]],
            5: [[2, 6], [3, 4]],
          },
        },
        quori: { kind: 'phonetic', phonology: QUORI_NAME, syllables: SHORT },
      },
      structures: [
        ST('given-alone', 9, [S('given', 'given')]),
        ST('given-quori', 2, [S('given', 'given'),
          S('descriptor', 'quori', { separator: ' — ', prefix: 'bonded to ', label: 'Spirit (unspoken)' })],
          { minComplexity: 5, note: 'The spirit’s name, which a kalashtar does not say aloud to outsiders.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a monastery in exile', 'a community that moved three times', 'a dream'],
    sp_thing: ['a memory belonging to someone who never lived here', 'a warning they cannot source'],
    sp_trait: ['dreams someone else’s life every night', 'is never quite alone and has stopped minding'],
  },
};

// ===========================================================================
// CHANGELING
// ===========================================================================

const CHANGELING_TRUE: Phonology = {
  initialOnsets: [['b', 3], ['c', 3], ['d', 3], ['f', 3], ['g', 2], ['h', 3], ['j', 3], ['k', 3], ['l', 3],
    ['m', 3], ['n', 3], ['p', 3], ['r', 3], ['s', 3], ['t', 3], ['v', 2], ['w', 2], ['y', 2], ['z', 2],
    ['br', 1], ['dr', 1], ['tr', 1], ['sh', 2], ['th', 1], ['bl', 1], ['cl', 1], ['cr', 1], ['fl', 1],
    ['fr', 1], ['gl', 1], ['gr', 1], ['kr', 1], ['pl', 1], ['pr', 1], ['sk', 1], ['sl', 1], ['sn', 1],
    ['sp', 1], ['st', 1], ['sw', 1], ['tw', 1], ['ch', 2], ['wh', 1], ['qu', 1]],
  onsets: [['l', 2], ['n', 2], ['r', 2], ['s', 2]],
  nuclei: [['a', 7], ['i', 7], ['o', 6], ['e', 5], ['u', 5], ['y', 3], ['ou', 2], ['ai', 2], ['ee', 2], ['oo', 2]],
  codas: [['x', 4], ['z', 3], ['s', 4], ['n', 4], ['m', 3], ['k', 4], ['t', 3], ['l', 3], ['sh', 2], ['rs', 2],
    ['g', 2], ['ks', 2], ['p', 2], ['v', 1], ['ch', 2], ['ft', 2], ['nk', 2], ['sk', 2], ['st', 2], ['rk', 2],
    ['ld', 2], ['nt', 2], ['mp', 2], ['th', 2], ['b', 2], ['d', 2], ['f', 2]],
  finalCodas: [['x', 4], ['z', 3], ['s', 4], ['n', 4], ['m', 3], ['k', 4], ['t', 3], ['l', 3], ['sh', 2],
    ['rs', 2], ['ch', 2], ['ft', 2], ['nk', 2], ['sk', 2], ['st', 2], ['rk', 2], ['ld', 2], ['nt', 2],
    ['mp', 2], ['th', 2], ['g', 2], ['p', 2], ['b', 2], ['d', 2]],
  patterns: [['CVK', 10]],
  finalPatterns: [['CVK', 10]],
  maxJunctureCluster: 2,
};

export const CHANGELING: SpeciesSpec = {
  id: 'changeling', name: 'Changeling', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Eberron: Rising from the Last War', 'Monsters of the Multiverse', 'Eberron: Forge of the Artificer'],
  confidence: 'documented',
  loreNotes: [
    'A changeling’s true name is almost always a single syllable, and it is shared sparingly.',
    'Changelings adopt a different name for each persona, as readily as a face, so most of the names a changeling uses are perfectly ordinary names from wherever the persona lives.',
    'That is why this entry has two traditions: the monosyllabic true name, and a complete common-tongue identity.',
  ],
  citations: [
    'https://www.dndbeyond.com/species',
    'https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf',
  ],
  traditions: [
    {
      id: 'true-name', label: 'True name', weight: 3,
      note: 'The single-syllable name a changeling was given, rarely offered to strangers.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: { given: { kind: 'phonetic', phonology: CHANGELING_TRUE, syllables: { 1: [1], 2: [1], 3: [1], 4: [1], 5: [[1, 9], [2, 1]] } } },
      structures: [ST('true', 10, [S('given', 'given', { label: 'True name' })])],
    },
    {
      id: 'persona', label: 'A persona', weight: 6,
      note: 'A full, ordinary identity built for one purpose.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: {
        given: COMMON_GIVEN,
        family: COMMON_SURNAME,
        truename: { kind: 'phonetic', phonology: CHANGELING_TRUE, syllables: { 1: [1], 2: [1], 3: [1], 4: [1], 5: [1] } },
      },
      structures: [
        ST('persona-full', 8, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('persona-with-true', 3, [S('given', 'given'), S('family', 'family', { label: 'Family' }),
          S('nickname', 'truename', { prefix: '(', suffix: ')', label: 'True name' })],
          { minComplexity: 4, note: 'The persona, with the true name behind it.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a city where they have three addresses', 'a guild they joined twice', 'a town that knows two of them'],
    sp_thing: ['a wardrobe for four different people', 'a persona they can no longer put down'],
    sp_trait: ['is never asked their real name and prefers it that way',
      'keeps a written record of which lie they told whom'],
  },
};

// ===========================================================================
// TRITON
// ===========================================================================

const TRITON_PHON: Phonology = {
  initialOnsets: [['b', 2], ['d', 3], ['f', 2], ['j', 2], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['p', 2],
    ['r', 2], ['s', 3], ['sh', 2], ['t', 3], ['th', 3], ['v', 3], ['w', 2], ['y', 2], ['z', 2], ['g', 2], ['kh', 1]],
  onsets: [['l', 5], ['m', 4], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['th', 3], ['v', 3], ['d', 3], ['z', 2],
    ['sh', 2], ['y', 1]],
  nuclei: [['o', 7], ['a', 7], ['e', 6], ['i', 6], ['u', 5], ['y', 3], ['ae', 2]],
  codas: [['s', 4], ['n', 4], ['r', 4], ['l', 3], ['th', 3], ['m', 2], ['sh', 1]],
  finalCodas: [['s', 5], ['n', 4], ['r', 3], ['th', 3], ['l', 2], ['m', 2]],
  patterns: [['CV', 7], ['CVK', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['os', 3], ['us', 2], ['is', 2], ['on', 2], ['ar', 2]],
    feminine: [['yn', 3], ['a', 3], ['ryn', 2], ['en', 2], ['ora', 2]],
    neutral: [['ys', 3], ['os', 2], ['yn', 2], ['il', 2], ['an', 2]],
  },
  maxLength: 12,
};

const TRITON_FAMILY: MorphSet = {
  initial: [
    m('Ahlor', 'deep current'), m('Puma', 'warm shallow'), m('Vuu', 'long swell'), m('Lamvae', 'still water'),
    m('Thess', 'coral shelf'), m('Oron', 'the trench'), m('Yllav', 'the bright reef'), m('Serim', 'the gyre'),
    m('Delna', 'the quiet depth'), m('Korav', 'the cold line'), m('Mathu', 'the surfacing'),
    m('Nerev', 'the first crossing'),
  ],
  final: [
    m('sath', 'house'), m('nath', 'line'), m('lys', 'keeping'), m('ren', 'watch'), m('mar', 'bound'),
    m('thys', 'hold'), m('nor', 'guard'), m('vaen', 'descent'),
  ],
  linkers: [['', 10], ['a', 2]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [[2, 8], [3, 2]] },
};

export const TRITON: SpeciesSpec = {
  id: 'triton', name: 'Triton', tier: 'expanded', group: PLANAR_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'Tritons use a personal name and a surname, and the surname marks the family a triton belongs to — published material is explicit that the surname matters to them.',
    'Published names are flowing, with -os and -yn endings common.',
    'The specific family vocabulary here is original; the structure follows the published convention.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'family', label: 'Personal name and family', weight: 10,
      note: 'A personal name with the family surname tritons are known by.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: TRITON_PHON, syllables: MEDIUM },
        family: { kind: 'morph', set: TRITON_FAMILY },
      },
      structures: [
        ST('given-family', 10, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 2, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a sentry post on the ocean floor', 'a sunken outpost', 'a surface city they find overwhelming'],
    sp_thing: ['a duty handed down the family', 'a report on something rising that nobody surfaced has read'],
    sp_trait: ['carries themselves as though on official business at all times',
      'is sincerely baffled by how land folk organise anything'],
  },
};

export const PLANAR_SPECIES: SpeciesSpec[] = [GENASI, GITHYANKI, GITHZERAI, KALASHTAR, CHANGELING, TRITON];
