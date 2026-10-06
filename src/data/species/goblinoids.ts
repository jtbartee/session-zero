/**
 * Goblinoids and kobolds.
 *
 * Goblin, hobgoblin and bugbear share a language family in published material,
 * so they share a phonetic base here — but their naming *structures* are very
 * different, which is the point: a hobgoblin legion designation and a goblin
 * single name are not the same tradition wearing different clothes.
 */

import type { CompoundSet, MorphSet, Phonology, SpeciesSpec } from '../../types/index.ts';
import { AGENTS, BEARING, COLOURS, SMALL_NUMBERS, STONE, WEATHER, blend, lower, m, retag, w } from '../vocabulary/palette.ts';
import { MEDIUM, S, SHORT, ST, TERSE } from './_helpers.ts';

const GOBLINOID_GROUP = 'Expanded — Goblinoids';

/** The shared goblinoid sound: clipped, plosive, back-of-the-mouth. */
const GOBLINOID_BASE: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['g', 4], ['gr', 3], ['h', 3], ['k', 4], ['kr', 2], ['m', 3], ['n', 3],
    ['r', 2], ['s', 3], ['sn', 2], ['sk', 2], ['t', 3], ['th', 2], ['v', 2], ['z', 3], ['dr', 2], ['br', 2],
    ['y', 2], ['w', 1], ['f', 2], ['kh', 2], ['ch', 2]],
  onsets: [['b', 2], ['d', 3], ['g', 3], ['k', 3], ['l', 2], ['m', 3], ['n', 3], ['r', 3], ['s', 2], ['t', 3],
    ['z', 2], ['v', 1], ['sh', 2], ['ch', 1], ['gg', 1], ['kk', 1]],
  nuclei: [['i', 8], ['a', 7], ['u', 6], ['o', 5], ['e', 4], ['ee', 1], ['oo', 1]],
  initialNuclei: [['i', 7], ['a', 8], ['u', 6], ['o', 5], ['e', 4]],
  codas: [['k', 5], ['g', 4], ['t', 3], ['n', 4], ['sh', 3], ['z', 2], ['rk', 2], ['nk', 3], ['ng', 3],
    ['b', 2], ['d', 2], ['ks', 2], ['sk', 1], ['m', 2], ['rg', 1]],
  finalCodas: [['k', 6], ['g', 4], ['t', 3], ['n', 4], ['sh', 3], ['nk', 2], ['z', 2], ['ks', 2], ['m', 1]],
  patterns: [['CVK', 8], ['CV', 3], ['VK', 2]],
  finalPatterns: [['CVK', 9], ['CV', 1]],
  maxJunctureCluster: 3,
};

// ---------------------------------------------------------------------------
// GOBLIN
// ---------------------------------------------------------------------------

const GOBLIN_PHON: Phonology = {
  ...GOBLINOID_BASE,
  endings: {
    masculine: [['ik', 3], ['ak', 2], ['ub', 2], ['og', 2], ['nk', 2], ['et', 1]],
    feminine: [['a', 3], ['ki', 2], ['na', 2], ['iz', 2], ['ula', 1], ['ett', 1]],
    neutral: [['ik', 3], ['uk', 2], ['ez', 2], ['in', 2], ['ot', 2]],
  },
};

const GOBLIN_EARNED: CompoundSet = {
  first: blend(retag(SMALL_NUMBERS, 'count'), retag(COLOURS, 'colour'),
    w('q', 'quick', 'small', 'loud', 'lucky', 'spare', 'second', 'crooked', 'lopsided', 'patched', 'borrowed',
      'half', 'twice', 'first', 'last', 'leftover')),
  second: lower(w('tail', 'pot', 'knife', 'ladder', 'rope', 'sack', 'whistle', 'fuse', 'lamp', 'cart', 'latch',
    'ear', 'tooth', 'boot', 'hat', 'barrel', 'spoon', 'hook', 'wheel', 'bucket', 'nail')),
  avoidSharedTags: ['count', 'colour', 'q'],
  casing: 'spaced',
};

export const GOBLIN: SpeciesSpec = {
  id: 'goblin', name: 'Goblin', tier: 'expanded', group: GOBLINOID_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters', 'Guildmasters’ Guide to Ravnica'],
  confidence: 'partial',
  loreNotes: [
    'Published goblin names are short, one or two syllables, heavy on hard consonants, and are not consistently marked for gender.',
    'Goblins commonly acquire a practical nickname for a specific thing they did or carry; this generator favours those over inherited surnames, which goblins generally lack.',
    'Goblins in the current rules are a people with their own communities, so nothing here is coded as monstrous or evil.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'single-and-earned', label: 'Single name and earned nickname', weight: 8,
      note: 'One short name, often with a nickname for something specific.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: GOBLIN_PHON, syllables: TERSE },
        earned: { kind: 'compound', set: GOBLIN_EARNED },
      },
      structures: [
        ST('given-alone', 7, [S('given', 'given')]),
        ST('given-earned', 7, [S('given', 'given'), S('nickname', 'earned', { prefix: '“', suffix: '”', label: 'Called' })]),
        ST('given-the-earned', 3, [S('given', 'given'),
          S('epithet', 'earned', { prefix: 'the ', label: 'Epithet' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a warren under a bigger settlement', 'a scrap yard', 'a tunnel with four exits', 'a shared kitchen'],
    sp_thing: ['a contraption that works exactly once', 'a tally of who has been fair to them'],
    sp_trait: ['is on excellent terms with everyone who feeds them', 'improvises first and explains later'],
  },
};

// ---------------------------------------------------------------------------
// HOBGOBLIN
// ---------------------------------------------------------------------------

const HOBGOBLIN_PHON: Phonology = {
  ...GOBLINOID_BASE,
  nuclei: [['a', 8], ['u', 6], ['o', 6], ['i', 5], ['e', 4], ['aa', 1]],
  internalMark: { mark: "'", chance: 0.18 },
  endings: {
    masculine: [['ar', 3], ['ur', 3], ['akh', 2], ['on', 2], ['dar', 2], ['esh', 2]],
    feminine: [['a', 3], ['ira', 2], ['una', 2], ['ash', 2], ['eth', 2], ['ka', 2]],
    neutral: [['ak', 3], ['ur', 2], ['esh', 2], ['in', 2], ['or', 2]],
  },
};

const HOBGOBLIN_CLAN: MorphSet = {
  initial: [
    m('Dhak', 'the first banner'), m('Ghaal', 'the great host'), m('Rhuk', 'the stone line'),
    m('Taar', 'the standing order'), m('Vesh', 'the grey column'), m('Kol', 'the hammer rank'),
    m('Mur', 'the wall'), m('Zhan', 'the watch'), m('Brag', 'the horn'), m('Nuul', 'the quiet march'),
    m('Serk', 'the shield line'), m('Ozh', 'the long road'), m('Khel', 'the gate'), m('Yurd', 'the ford'),
  ],
  final: [
    m('dar', 'people of'), m('taal', 'legion'), m('rukh', 'cohort'), m('shan', 'banner'), m('vash', 'standing'),
    m('nok', 'post'), m('gath', 'muster'), m('zul', 'company'), m('mahr', 'line'), m('kesh', 'order'),
  ],
  linkers: [["'", 6], ['', 5], ['a', 2]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [[2, 8], [3, 2]] },
};

export const HOBGOBLIN: SpeciesSpec = {
  id: 'hobgoblin', name: 'Hobgoblin', tier: 'expanded', group: GOBLINOID_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters', 'Eberron: Rising from the Last War'],
  confidence: 'partial',
  loreNotes: [
    'Hobgoblin society in published material is organised around legions and clans, and a hobgoblin is identified by their unit as much as by their personal name.',
    'Eberron’s Dhakaani hobgoblins use apostrophised clan names, which is the documented basis for the internal mark here.',
    'Monsters of the Multiverse reframes hobgoblins as fey-touched and intensely communal; the naming here reflects that collective identity rather than a military stereotype.',
  ],
  citations: ['https://www.dndbeyond.com/species', 'https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf'],
  traditions: [
    {
      id: 'clan-and-rank', label: 'Personal name and clan', weight: 8,
      note: 'A personal name followed by the clan or legion a hobgoblin belongs to.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: HOBGOBLIN_PHON, syllables: SHORT },
        clan: { kind: 'morph', set: HOBGOBLIN_CLAN },
        standing: { kind: 'closed', items: [['of the First Muster', 2], ['of the Second Muster', 2],
          ['of the Long Watch', 2], ['of the Standing Line', 2], ['of the Fourth Banner', 2],
          ['of the Rear Column', 1], ['of the Broken Standard', 1], ['of the Quiet March', 1]] },
      },
      structures: [
        ST('given-clan', 9, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' })]),
        ST('given-clan-standing', 3, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' }),
          S('title', 'standing', { separator: ', ', label: 'Standing' })], { minComplexity: 3 }),
        ST('given-alone', 2, [S('given', 'given')], { note: 'A hobgoblin outside any legion.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a legion encampment', 'a muster field', 'a clan hall', 'a disbanded cohort'],
    sp_thing: ['a standing order with no one left to rescind it', 'a muster roll with their name struck through'],
    sp_trait: ['organises any group they join within the hour', 'keeps accounts of collective effort, not individual credit'],
  },
};

// ---------------------------------------------------------------------------
// BUGBEAR
// ---------------------------------------------------------------------------

const BUGBEAR_PHON: Phonology = {
  ...GOBLINOID_BASE,
  nuclei: [['a', 8], ['u', 7], ['o', 6], ['e', 4], ['i', 4], ['oo', 2]],
  patterns: [['CVK', 7], ['CV', 4]],
  endings: {
    masculine: [['uk', 3], ['ag', 2], ['oth', 2], ['un', 2], ['rak', 2]],
    feminine: [['a', 3], ['ga', 2], ['una', 2], ['ra', 2], ['esh', 2]],
    neutral: [['uk', 3], ['ag', 2], ['en', 2], ['or', 2], ['ash', 2]],
  },
};

const BUGBEAR_EPITHET: CompoundSet = {
  first: blend(retag(BEARING, 'q'), retag(WEATHER, 'nature'),
    w('q', 'soft', 'silent', 'long', 'slow', 'wide', 'tall', 'low', 'patient', 'first', 'last', 'lone')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'step', 'shoulder', 'reach', 'shadow', 'arm', 'breath', 'hand', 'watch'))),
  avoidSharedTags: ['q', 'nature'],
  casing: 'fused',
};

export const BUGBEAR: SpeciesSpec = {
  id: 'bugbear', name: 'Bugbear', tier: 'expanded', group: GOBLINOID_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'partial',
  loreNotes: [
    'Bugbears share the goblinoid tongue; published names are one or two heavy syllables with no inherited family name.',
    'Epithets describing reach, quiet and patience are an original extension built on the documented bugbear traits of stealth and long arms.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'single-and-epithet', label: 'Single name and epithet', weight: 8,
      note: 'A heavy single name, sometimes with an earned epithet.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: BUGBEAR_PHON, syllables: TERSE },
        epithet: { kind: 'compound', set: BUGBEAR_EPITHET },
      },
      structures: [
        ST('given-alone', 7, [S('given', 'given')]),
        ST('given-epithet', 6, [S('given', 'given'), S('epithet', 'epithet', { label: 'Epithet' })]),
        ST('given-the-epithet', 2, [S('given', 'given'), S('epithet', 'epithet', { prefix: 'the ', label: 'Epithet' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a deep wood', 'a lodge', 'a hunting range', 'a place where they were the only one of their kind'],
    sp_thing: ['a reputation they did not ask for', 'a pack far lighter than people assume'],
    sp_trait: ['moves more quietly than anything that size should', 'is habitually gentle with small things'],
  },
};

// ---------------------------------------------------------------------------
// KOBOLD
// ---------------------------------------------------------------------------

const KOBOLD_PHON: Phonology = {
  initialOnsets: [['d', 3], ['dr', 3], ['g', 3], ['gr', 2], ['k', 4], ['kr', 3], ['m', 2], ['n', 3], ['p', 2],
    ['r', 2], ['s', 3], ['sn', 2], ['sk', 2], ['t', 3], ['tr', 2], ['v', 3], ['y', 2], ['z', 3], ['kl', 2],
    ['ch', 2], ['th', 2], ['x', 1]],
  onsets: [['d', 3], ['g', 2], ['k', 3], ['l', 3], ['n', 3], ['r', 3], ['s', 3], ['t', 3], ['v', 2], ['z', 2],
    ['x', 2], ['sh', 1], ['b', 1], ['m', 2]],
  nuclei: [['i', 9], ['a', 7], ['e', 6], ['o', 4], ['u', 4], ['y', 2]],
  initialNuclei: [['i', 8], ['a', 7], ['e', 6], ['o', 4], ['u', 3]],
  codas: [['x', 4], ['k', 4], ['t', 3], ['ss', 3], ['n', 3], ['sh', 2], ['rt', 2], ['sk', 2], ['p', 2], ['l', 2]],
  finalCodas: [['x', 5], ['k', 4], ['ss', 3], ['t', 3], ['n', 3], ['sh', 2], ['p', 1]],
  patterns: [['CVK', 7], ['CV', 4]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['ix', 4], ['ek', 2], ['ar', 2], ['oss', 2], ['it', 2]],
    feminine: [['ia', 3], ['issa', 2], ['ix', 2], ['ara', 2], ['et', 2]],
    neutral: [['ix', 4], ['ek', 3], ['iss', 2], ['ot', 2], ['ax', 2]],
  },
};

const KOBOLD_TRADE: CompoundSet = {
  first: blend(retag(STONE, 'material'), retag(COLOURS, 'colour'),
    w('q', 'quick', 'small', 'sharp', 'bright', 'low', 'deep', 'first', 'second', 'spare', 'clever', 'tidy')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'digger', 'propper', 'trapper', 'scout', 'tally', 'wick', 'lamp', 'spike', 'brace', 'shim'))),
  avoidSharedTags: ['material', 'colour', 'q'],
  casing: 'fused',
};

export const KOBOLD: SpeciesSpec = {
  id: 'kobold', name: 'Kobold', tier: 'expanded', group: GOBLINOID_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'partial',
  loreNotes: [
    'Kobold names draw on Draconic sounds — sibilants and hard stops with frequent -ix and -ss endings — and are short.',
    'Kobolds organise around a warren and a job, so a trade-name attached to the personal name is the common full form. The specific trade vocabulary here is original.',
    'Monsters of the Multiverse detaches kobolds from draconic servitude; nothing here implies subservience.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'warren', label: 'Name and trade', weight: 8,
      note: 'A short Draconic-sounding name with the job they do for the warren.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: KOBOLD_PHON, syllables: TERSE },
        trade: { kind: 'compound', set: KOBOLD_TRADE },
        warren: { kind: 'phonetic', phonology: KOBOLD_PHON, syllables: MEDIUM },
      },
      structures: [
        ST('given-trade', 8, [S('given', 'given'), S('family', 'trade', { label: 'Trade' })]),
        ST('given-alone', 5, [S('given', 'given')]),
        ST('given-of-warren', 3, [S('given', 'given'), S('clan', 'warren', { prefix: 'of ', label: 'Warren' })],
          { minComplexity: 2 }),
        ST('given-trade-warren', 2, [S('given', 'given'), S('family', 'trade', { label: 'Trade' }),
          S('clan', 'warren', { prefix: 'of ', label: 'Warren' })], { minComplexity: 4 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a warren with excellent drainage', 'a tunnel shored up by hand', 'a trap corridor', 'a shared nursery'],
    sp_thing: ['a job rota', 'a trap design they are quietly proud of', 'a count of everyone still alive'],
    sp_trait: ['thinks in terms of what the group needs', 'is a genuinely excellent engineer and expects no credit'],
  },
};

export const GOBLINOIDS_SPECIES: SpeciesSpec[] = [GOBLIN, HOBGOBLIN, BUGBEAR, KOBOLD];
