/**
 * The ten species of the 2024 Player's Handbook.
 *
 * Each entry records what published material actually says about naming, a
 * confidence rating, and citations. Where lore is thin the gap is stated in
 * `loreNotes` rather than papered over.
 */

import type { CompoundSet, MorphSet, Phonology, SpeciesSpec, VirtueSet } from '../../types/index.ts';
import {
  ADVERBIAL_CONCEPTS, AGENTS, BEARING, BEASTS, BIRDS, COLOURS, CONCEPTS, CRAFT_TOOLS, DARK_CONCEPTS, DEEP_PLACES, FIRE, GEMS,
  HARVEST, HIGHLAND, LIGHT, METALS, QUALIFIERS, SMALL_NUMBERS, STONE, TREES,
  UNDERGROWTH, VIRTUES, WEATHER, blend, lower, m, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME, EARNED_EPITHET, NORTHREACH } from './_shared.ts';
import { EPIC, LONG, MEDIUM, S, SHORT, ST, TERSE } from './_helpers.ts';

// ===========================================================================
// DWARF
// ===========================================================================

export const DWARF_GIVEN: Phonology = {
  initialOnsets: [['b', 4], ['br', 3], ['d', 4], ['dr', 3], ['f', 3], ['fr', 2], ['g', 3], ['gr', 3], ['h', 3],
    ['k', 4], ['kr', 3], ['l', 2], ['m', 3], ['n', 2], ['r', 3], ['s', 3], ['sk', 2], ['sn', 2], ['st', 3],
    ['t', 3], ['th', 4], ['thr', 3], ['v', 3], ['w', 2], ['gl', 1], ['bl', 1], ['kv', 1], ['hr', 1], ['y', 1]],
  onsets: [['b', 2], ['d', 3], ['g', 3], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['r', 4], ['s', 2], ['t', 3],
    ['th', 2], ['v', 2], ['dr', 1], ['gr', 1], ['br', 1], ['kr', 1], ['nn', 1], ['ld', 1], ['rg', 1], ['f', 1]],
  nuclei: [['a', 9], ['o', 7], ['u', 6], ['i', 5], ['e', 5], ['au', 1], ['ei', 1], ['y', 2]],
  initialNuclei: [['a', 9], ['o', 7], ['u', 6], ['i', 5], ['e', 5], ['y', 1]],
  codas: [['r', 4], ['rn', 4], ['rk', 3], ['rd', 3], ['ld', 3], ['lf', 2], ['lk', 2], ['m', 3], ['n', 4], ['ng', 2],
    ['th', 3], ['g', 3], ['d', 2], ['k', 3], ['t', 2], ['s', 2], ['st', 2], ['nn', 2], ['ll', 2], ['rr', 2],
    ['lm', 2], ['rg', 2], ['nd', 2], ['ft', 1], ['mb', 1]],
  finalCodas: [['n', 6], ['r', 6], ['k', 4], ['th', 3], ['rn', 3], ['rd', 3], ['m', 3], ['g', 2], ['ld', 2],
    ['st', 1], ['nd', 1]],
  patterns: [['CVK', 8], ['CV', 3], ['VK', 1]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  endings: {
    masculine: [['ar', 3], ['ur', 3], ['in', 3], ['i', 2], ['unn', 2], ['rik', 1], ['gar', 2], ['li', 2],
      ['orn', 2], ['ek', 1], ['dar', 1]],
    feminine: [['a', 5], ['ra', 3], ['hild', 2], ['dis', 2], ['unn', 2], ['lin', 2], ['ryd', 1], ['wyn', 2],
      ['na', 2], ['eth', 1], ['grid', 1]],
    neutral: [['en', 3], ['el', 2], ['ir', 2], ['ki', 1], ['un', 2], ['ar', 2], ['ith', 1]],
  },
  forbidJunctures: ['hh', 'jj', 'qq', 'wv'],
  maxJunctureCluster: 3,
  maxLength: 12,
};

export const DWARF_CLAN_TRANSPARENT: CompoundSet = {
  first: blend(
    retag(METALS, 'material'), retag(STONE, 'material'), retag(GEMS, 'material'),
    retag(FIRE, 'element'), retag(DEEP_PLACES, 'place'),
    w('element', 'frost', 'storm', 'thunder', 'cinder', 'ash'),
    retag(COLOURS, 'colour'),
    w('attr', 'stout', 'broad', 'true', 'old', 'hard', 'fast', 'sure', 'high', 'under', 'elder', 'grand', 'low'),
  ),
  second: lower(w('tail',
    'forge', 'beard', 'fist', 'brow', 'anvil', 'hammer', 'helm', 'shield', 'axe', 'hand', 'heart', 'blood',
    'breaker', 'finder', 'warden', 'back', 'boot', 'seeker', 'bellows', 'horn', 'brand', 'mantle', 'gird',
    'delve', 'hold', 'gate', 'vault', 'spark', 'tread', 'grip', 'chisel', 'tongs', 'maul', 'rivet', 'plate',
    'ridge', 'stride', 'oath', 'word', 'bond', 'cask', 'hearth', 'rune', 'mark', 'pillar', 'arch', 'keel')),
  avoidSharedTags: ['material', 'element', 'place'],
  casing: 'fused',
};

export const DWARF_CLAN_OPAQUE: MorphSet = {
  initial: [
    m('Bram', 'hearth'), m('Dren', 'standing stone'), m('Gol', 'gold vein'), m('Hald', 'height'),
    m('Kaz', 'forge'), m('Mor', 'deep dark'), m('Narv', 'delving'), m('Orv', 'anvil'), m('Ruk', 'stout'),
    m('Skal', 'shield wall'), m('Thom', 'thunder'), m('Vel', 'deep'), m('Yurn', 'iron'), m('Zhor', 'ember'),
    m('Brund', 'cask'), m('Daek', 'oath'), m('Farn', 'far road'), m('Halv', 'half'), m('Jorn', 'hammer'),
    m('Kved', 'work song'), m('Lorn', 'long hall'), m('Munt', 'mountain'), m('Prak', 'fracture'),
    m('Rovn', 'taproot'), m('Serk', 'strength'), m('Turv', 'turf'), m('Umr', 'the under'), m('Vask', 'wall'),
    m('Gorm', 'weathered'), m('Thur', 'tower'), m('Dag', 'daylight'), m('Nol', 'northward'), m('Krenn', 'cleft'),
    m('Beld', 'bellows'), m('Stok', 'stock'), m('Wergn', 'warden'),
  ],
  final: [
    m('derk', 'hold'), m('kil', 'kin'), m('unn', 'line'), m('hek', 'stone'), m('err', 'forge'),
    m('heim', 'home'), m('eln', 'hall'), m('art', 'hearthside'), m('rim', 'edge'), m('dul', 'depth'),
    m('bek', 'brook'), m('mar', 'boundary'), m('gar', 'guard'), m('nak', 'anvil'), m('vek', 'way'),
    m('durn', 'door'), m('kirn', 'core'), m('thal', 'vault'), m('grun', 'ground'), m('stal', 'stall'),
    m('ven', 'vein'), m('bult', 'bolt'), m('rond', 'ring'), m('skar', 'scar'), m('tunn', 'tun'),
    m('arn', 'eagle stone'), m('ildr', 'kindling'), m('oth', 'oath'),
  ],
  linkers: [['', 8], ['a', 2], ['e', 1], ['o', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [[2, 8], [3, 2]], 5: [[2, 6], [3, 4]] },
};

const DWARF_EPITHET: CompoundSet = {
  first: blend(
    w('quality', 'steady', 'sure', 'stubborn', 'patient', 'dour', 'canny', 'keen', 'true', 'hard', 'quick',
      'wary', 'bold', 'deep', 'long', 'first', 'last', 'twice'),
    retag(COLOURS, 'quality'), retag(CRAFT_TOOLS, 'thing'),
    w('thing', 'rune', 'ledger', 'lamp', 'tunnel', 'vein', 'seam', 'ore', 'key', 'ledge', 'shaft', 'gate')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'wright', 'setter', 'sinker', 'raiser', 'surveyor', 'assayer'))),
  avoidSharedTags: ['quality', 'thing'],
  casing: 'fused',
};

export const DWARF: SpeciesSpec = {
  id: 'dwarf',
  name: 'Dwarf',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'documented',
  loreNotes: [
    'A dwarf carries a personal name and a clan name; the clan name is granted by clan elders and is not lightly set aside.',
    'Published clan names come in two flavours: transparent Common compounds built from stone, metal and craft, and opaque names that sound like the dwarves’ own tongue.',
    'Personal names lean Old Norse and Germanic in sound: hard stops, heavy codas, and dark vowels.',
    'A dwarf without a clan name is unusual and usually says something about their story, so that structure is deliberately rare here.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'clanhold',
      label: 'Clan and hold',
      weight: 10,
      note: 'Personal name followed by the clan name granted by the elders.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: DWARF_GIVEN, syllables: SHORT },
        clan: {
          kind: 'oneOf',
          options: [
            [{ kind: 'compound', set: DWARF_CLAN_TRANSPARENT }, 5],
            [{ kind: 'morph', set: DWARF_CLAN_OPAQUE }, 5],
          ],
        },
        hold: { kind: 'morph', set: DWARF_CLAN_OPAQUE },
        epithet: { kind: 'compound', set: DWARF_EPITHET },
        nickname: { kind: 'phonetic', phonology: DWARF_GIVEN, syllables: TERSE },
      },
      structures: [
        ST('given-clan', 11, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' })]),
        ST('given-clan-epithet', 3, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' }),
          S('epithet', 'epithet', { prefix: 'the ', label: 'Epithet' })], { minComplexity: 3 }),
        ST('given-nickname-clan', 2, [S('given', 'given'),
          S('nickname', 'nickname', { prefix: '“', suffix: '”', label: 'Called' }),
          S('clan', 'clan', { label: 'Clan' })], { minComplexity: 3 }),
        ST('given-of-hold', 2, [S('given', 'given'), S('clan', 'hold', { prefix: 'of ', label: 'Hold' })],
          { minComplexity: 2 }),
        ST('given-alone', 1.2, [S('given', 'given')],
          { note: 'A dwarf estranged from their clan, or keeping it to themselves.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a deep hold', 'a flooded lower delve', 'a clan vault', 'a sealed gallery', 'the long stair',
      'an abandoned seam', 'the forge-hall', 'a boundary cairn'],
    sp_thing: ['a clan ledger', 'an unsigned oath-stone', 'a hammer with the wrong maker’s mark',
      'a key to a door that no longer exists', 'a disputed boundary charter'],
    sp_trait: ['keeps a list of debts nobody else remembers', 'measures everything twice out of habit',
      'can tell which hold a stone was cut in'],
  },
};

// ===========================================================================
// ELF
// ===========================================================================

export const ELF_PHON: Phonology = {
  initialOnsets: [['l', 5], ['r', 4], ['n', 5], ['m', 4], ['th', 4], ['s', 4], ['v', 3], ['f', 3], ['d', 3],
    ['t', 3], ['c', 3], ['g', 2], ['h', 2], ['y', 2], ['ly', 2], ['ry', 2], ['thr', 1], ['br', 1], ['dr', 1],
    ['tr', 1], ['gl', 1], ['fl', 1], ['ph', 1], ['sh', 1], ['z', 1], ['qu', 1], ['lh', 1], ['rh', 1], ['k', 2],
    ['sy', 1], ['n', 2], ['el', 1]],
  onsets: [['l', 6], ['r', 5], ['n', 5], ['m', 4], ['th', 4], ['s', 4], ['v', 3], ['d', 3], ['t', 3], ['f', 2],
    ['ll', 2], ['nn', 2], ['rr', 2], ['ly', 2], ['ri', 1], ['si', 1], ['c', 2], ['g', 1], ['dr', 1], ['thr', 1],
    ['n', 2], ['w', 1], ['y', 1]],
  nuclei: [['a', 8], ['e', 7], ['i', 6], ['o', 4], ['u', 2], ['ae', 4], ['ia', 3], ['ea', 3], ['ie', 3],
    ['ai', 2], ['io', 2], ['ua', 1], ['eo', 1], ['y', 2], ['ui', 1]],
  codas: [['l', 6], ['n', 6], ['r', 5], ['th', 3], ['s', 3], ['ll', 2], ['nn', 2], ['rn', 1], ['m', 2], ['v', 1]],
  finalCodas: [['n', 7], ['l', 6], ['r', 4], ['th', 3], ['s', 3], ['m', 1], ['ll', 1]],
  patterns: [['CV', 9], ['CVK', 4], ['V', 1]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  endings: {
    masculine: [['an', 3], ['ar', 3], ['en', 2], ['ion', 2], ['il', 3], ['ith', 2], ['on', 2], ['as', 2],
      ['ael', 2], ['yr', 1], ['iel', 1], ['orn', 1]],
    feminine: [['a', 4], ['ia', 3], ['iel', 3], ['wen', 2], ['eth', 2], ['ara', 2], ['is', 2], ['ys', 1],
      ['ael', 1], ['ana', 2], ['lyn', 2], ['ara', 1]],
    neutral: [['ae', 2], ['i', 2], ['el', 3], ['yn', 2], ['ir', 2], ['ith', 2], ['is', 2], ['ael', 2], ['en', 2]],
  },
  forbidJunctures: ['jj', 'qq', 'xx', 'kk'],
  maxJunctureCluster: 2,
  // Elvish diphthongs stack fast; without a ceiling this inventory makes
  // technically-legal fourteen-letter names nobody would say aloud.
  maxLength: 12,
};

export const ELF_FAMILY_ELVISH: MorphSet = {
  initial: [
    m('Ama', 'gem'), m('Gala', 'moon'), m('Lia', 'silver'), m('Nai', 'night'), m('Sia', 'running water'),
    m('The', 'star'), m('Cor', 'song'), m('Ele', 'light'), m('Fae', 'first light'), m('Mor', 'dusk'),
    m('Nel', 'leaf'), m('Rava', 'wind'), m('Syl', 'woodland'), m('Tir', 'watch'), m('Vael', 'deep place'),
    m('Yll', 'spring'), m('Bel', 'fair'), m('Cael', 'open sky'), m('Dhae', 'mist'), m('Eran', 'wandering'),
    m('Fin', 'fine-drawn'), m('Gwyn', 'white'), m('Hal', 'tall'), m('Ith', 'moonglow'), m('Lor', 'gold'),
    m('Mel', 'sweetness'), m('Nim', 'pale'), m('Oll', 'great tree'), m('Pel', 'distance'), m('Quel', 'high'),
    m('Ser', 'brightness'), m('Tael', 'bough'), m('Ume', 'shade'), m('Vir', 'green'), m('Wyn', 'joy'),
    m('Aer', 'air'), m('Isil', 'cold moon'), m('Thal', 'blossom'),
  ],
  final: [
    m('andil', 'bloom'), m('reth', 'song'), m('valis', 'path'), m('mitha', 'veil'), m('thil', 'star'),
    m('anar', 'sun'), m('ylas', 'leaf'), m('ethil', 'river'), m('oril', 'crown'), m('wyn', 'joy'),
    m('alen', 'green place'), m('ira', 'wind'), m('onas', 'stone'), m('eluin', 'water'), m('thalas', 'wood'),
    m('ymar', 'sea'), m('adell', 'hollow'), m('orien', 'dawn'), m('ussar', 'frost'), m('enel', 'sky'),
    m('aviel', 'wing'), m('indor', 'country'), m('elath', 'company'), m('uviel', 'shadow'), m('arion', 'heir'),
    m('estel', 'hope'), m('ondril', 'bell'),
  ],
  linkers: [['', 10], ['n', 2], ['l', 1], ['ï', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [[2, 8], [3, 2]], 5: [[2, 6], [3, 4]] },
};

export const ELF_FAMILY_COMMON: CompoundSet = {
  first: blend(
    retag(LIGHT, 'sky'), retag(WEATHER, 'sky'),
    w('nature', 'river', 'leaf', 'briar', 'willow', 'aspen', 'fern', 'reed', 'meadow', 'grove', 'thorn', 'bramble'),
    retag(COLOURS, 'colour'),
    w('quality', 'quiet', 'swift', 'high', 'deep', 'far', 'fair', 'gentle', 'keen', 'long', 'ever', 'first', 'last'),
  ),
  second: lower(w('tail',
    'whisper', 'brook', 'frond', 'breeze', 'song', 'wander', 'bough', 'veil', 'light', 'bloom', 'stride',
    'water', 'crown', 'weaver', 'shadow', 'dancer', 'glimmer', 'meadow', 'fall', 'reach', 'bind', 'flower',
    'thread', 'call', 'step', 'gleam', 'hollow', 'spire', 'drift', 'ember', 'silence', 'mantle', 'echo', 'hush')),
  avoidSharedTags: ['sky', 'colour', 'nature'],
  casing: 'fused',
};

const ELF_EPITHET: CompoundSet = {
  first: blend(retag(BEARING, 'q'), w('q', 'twice', 'thrice', 'never', 'ever', 'half', 'long', 'late', 'early', 'unlooked')),
  second: lower(blend(retag(AGENTS, 'tail'), w('tail', 'returned', 'forgotten', 'awaited', 'promised', 'counted', 'named'))),
  avoidSharedTags: ['q'],
  casing: 'hyphenated',
};

export const ELF: SpeciesSpec = {
  id: 'elf',
  name: 'Elf',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'documented',
  loreNotes: [
    'An elf may carry up to three names: a child name, an adult name chosen after their hundredth year, and a family name.',
    'Family names are built from Elvish words and are usually given alongside a Common translation, so both forms are legitimate.',
    'Child names are short and easy to say; adult names are chosen deliberately and tend to be longer and more flowing.',
    'The 2024 rules replace subraces with lineages (High, Wood, Drow). Published naming guidance is shared across lineages rather than split by them, so this entry does not fabricate per-lineage phonologies.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'elvish',
      label: 'Elvish family name',
      weight: 9,
      note: 'The chosen adult name followed by the family name in Elvish.',
      genderPolicy: 'mixed',
      producers: {
        adult: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        child: { kind: 'phonetic', phonology: ELF_PHON, syllables: TERSE },
        family: { kind: 'morph', set: ELF_FAMILY_ELVISH },
        epithet: { kind: 'compound', set: ELF_EPITHET },
      },
      structures: [
        ST('adult-family', 10, [S('given', 'adult'), S('family', 'family', { label: 'House' })]),
        ST('adult-family-epithet', 2, [S('given', 'adult'), S('family', 'family', { label: 'House' }),
          S('epithet', 'epithet', { prefix: 'the ', label: 'Epithet' })], { minComplexity: 4 }),
        ST('adult-alone', 2.5, [S('given', 'adult')]),
        ST('child-family', 1.2, [S('given', 'child'), S('family', 'family', { label: 'House' })],
          { maxComplexity: 3, note: 'An elf who has not yet declared adulthood.' }),
      ],
    },
    {
      id: 'translated',
      label: 'Translated family name',
      weight: 7,
      note: 'The same family name rendered into Common, as elves commonly offer it to others.',
      genderPolicy: 'mixed',
      producers: {
        adult: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        family: { kind: 'compound', set: ELF_FAMILY_COMMON },
        epithet: { kind: 'compound', set: ELF_EPITHET },
      },
      structures: [
        ST('adult-translated', 10, [S('given', 'adult'), S('family', 'family', { label: 'House' })]),
        ST('adult-translated-epithet', 2, [S('given', 'adult'), S('family', 'family', { label: 'House' }),
          S('epithet', 'epithet', { prefix: 'the ', label: 'Epithet' })], { minComplexity: 4 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a grove that outlived its city', 'a road no one has walked in two centuries', 'an archive of unread letters',
      'a border post nobody relieves', 'a drowned garden'],
    sp_thing: ['a name they have not used in ninety years', 'a promise made before the present age',
      'a map of a forest that has since been felled', 'an unfinished song'],
    sp_trait: ['measures time in decades without noticing', 'remembers a dead language better than a living one',
      'writes letters to people who have long since died'],
  },
};

// ===========================================================================
// HALFLING
// ===========================================================================

export const HALFLING_PHON: Phonology = {
  initialOnsets: [['b', 4], ['c', 3], ['d', 4], ['f', 3], ['g', 3], ['h', 3], ['j', 2], ['l', 3], ['m', 4],
    ['n', 3], ['p', 3], ['r', 3], ['s', 3], ['t', 3], ['v', 2], ['w', 3], ['bl', 2], ['cl', 1], ['fr', 2],
    ['gr', 2], ['pr', 1], ['tr', 2], ['sh', 2], ['th', 2], ['wh', 2], ['qu', 1], ['dr', 1], ['sp', 1]],
  onsets: [['b', 3], ['d', 3], ['l', 4], ['m', 4], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['v', 2], ['p', 2],
    ['c', 2], ['g', 2], ['f', 2], ['dd', 1], ['ll', 2], ['nn', 1], ['rr', 1], ['w', 1], ['bb', 1]],
  nuclei: [['a', 7], ['e', 7], ['i', 7], ['o', 6], ['u', 4], ['y', 3], ['ie', 2], ['oo', 2], ['ea', 2], ['ai', 1]],
  initialNuclei: [['a', 8], ['e', 7], ['i', 6], ['o', 6], ['u', 4], ['ea', 2], ['oo', 1]],
  codas: [['n', 4], ['l', 4], ['t', 3], ['s', 3], ['r', 3], ['d', 3], ['m', 3], ['ck', 3], ['ll', 3], ['b', 2],
    ['p', 2], ['g', 2], ['nd', 2], ['st', 1], ['mb', 1], ['rt', 1]],
  finalCodas: [['n', 5], ['l', 4], ['s', 3], ['t', 3], ['r', 3], ['m', 3], ['ck', 2], ['d', 2], ['ll', 2], ['p', 1]],
  patterns: [['CV', 6], ['CVK', 6], ['VK', 1]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  maxLength: 11,
  endings: {
    masculine: [['o', 4], ['on', 3], ['in', 3], ['us', 2], ['am', 2], ['er', 2], ['ic', 2], ['yn', 1], ['ert', 1], ['ulus', 1]],
    feminine: [['a', 5], ['y', 3], ['ie', 3], ['ina', 2], ['ella', 2], ['wyn', 2], ['is', 2], ['lia', 2], ['etta', 1]],
    neutral: [['y', 4], ['el', 2], ['an', 2], ['is', 2], ['o', 3], ['en', 2], ['ow', 1]],
  },
};

const HALFLING_FAMILY: CompoundSet = {
  first: blend(
    w('home', 'good', 'green', 'high', 'under', 'over', 'tea', 'warm', 'deep', 'mellow', 'proper', 'little',
      'old', 'far', 'home', 'quiet', 'tidy', 'honest', 'merry', 'snug', 'round', 'low', 'wide'),
    retag(HARVEST, 'crop'), retag(UNDERGROWTH, 'plant'), retag(TREES, 'plant'),
  ),
  second: lower(w('tail',
    'barrel', 'bottle', 'gather', 'hill', 'topple', 'bough', 'leaf', 'cobble', 'gage', 'hallow', 'foot',
    'burrow', 'kettle', 'hearth', 'bell', 'lock', 'meadow', 'brook', 'field', 'patch', 'hedge', 'sack',
    'stride', 'basket', 'whistle', 'reed', 'nook', 'pantry', 'latch', 'gate', 'step', 'button', 'crumb',
    'pocket', 'mantle', 'kerchief', 'willow', 'bracket')),
  avoidSharedTags: ['crop', 'plant'],
  casing: 'fused',
};

const HALFLING_NICK: CompoundSet = {
  first: blend(retag(BEARING, 'q'),
    w('q', 'half', 'second', 'spare', 'extra', 'little', 'old', 'crooked', 'lucky', 'honest', 'early', 'late')),
  second: lower(w('tail', 'penny', 'kettle', 'pockets', 'boots', 'whistle', 'candle', 'supper', 'breakfast',
    'biscuit', 'apples', 'nettles', 'thimble', 'mittens', 'spoon', 'pipe', 'lantern', 'buttons', 'elbows')),
  avoidSharedTags: ['q'],
  casing: 'spaced',
};

export const HALFLING: SpeciesSpec = {
  id: 'halfling',
  name: 'Halfling',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'documented',
  loreNotes: [
    'Halflings use a given name and a family name; family names are typically transparent Common compounds drawn from home, craft and countryside.',
    'Nicknames are common and stick for life, often earned for something small and specific rather than heroic.',
    'The 2024 rules removed halfling subraces, so this entry keeps one shared naming culture.',
  ],
  citations: ['https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook'],
  traditions: [
    {
      id: 'family',
      label: 'Family name',
      weight: 10,
      note: 'A given name and an inherited family name, often with a nickname.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: HALFLING_PHON, syllables: SHORT },
        family: { kind: 'compound', set: HALFLING_FAMILY },
        nickname: { kind: 'compound', set: HALFLING_NICK },
      },
      structures: [
        ST('given-family', 10, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-family-nick', 3, [S('given', 'given'), S('family', 'family', { label: 'Family' }),
          S('nickname', 'nickname', { prefix: '— “', suffix: '”', separator: ' ', label: 'Called' })],
          { minComplexity: 3 }),
        ST('given-nick-family', 2.5, [S('given', 'given'),
          S('nickname', 'nickname', { prefix: '“', suffix: '”', label: 'Called' }),
          S('family', 'family', { label: 'Family' })], { minComplexity: 3 }),
        ST('given-alone', 1.2, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a crossroads inn', 'a shared pantry', 'a borrowed cart', 'a village green', 'a well-kept hedge',
      'the back room of a post house'],
    sp_thing: ['a recipe nobody else can read', 'a key to a door three counties away', 'a jar of something fermenting',
      'a letter of introduction to the wrong person'],
    sp_trait: ['never arrives anywhere without food', 'remembers everyone’s name and nobody’s face',
      'is sincerely unbothered by heights'],
  },
};

// ===========================================================================
// GNOME
// ===========================================================================

export const GNOME_PHON: Phonology = {
  initialOnsets: [['b', 3], ['bl', 2], ['br', 2], ['d', 3], ['f', 3], ['fl', 2], ['g', 3], ['gl', 2], ['gr', 2],
    ['j', 2], ['k', 3], ['kl', 2], ['kn', 2], ['l', 2], ['m', 3], ['n', 3], ['p', 3], ['pl', 2], ['r', 2],
    ['s', 3], ['sn', 3], ['sp', 2], ['t', 3], ['tw', 2], ['v', 2], ['w', 2], ['z', 2], ['zw', 1], ['dw', 1],
    ['th', 1], ['qu', 1], ['fr', 1], ['sk', 1]],
  onsets: [['b', 3], ['d', 3], ['g', 2], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['p', 3], ['r', 3], ['s', 2],
    ['t', 3], ['v', 2], ['z', 2], ['dd', 1], ['tt', 1], ['w', 1], ['f', 1]],
  nuclei: [['i', 9], ['e', 7], ['a', 7], ['o', 5], ['u', 4], ['ee', 2], ['oo', 2], ['y', 1], ['ia', 1]],
  initialNuclei: [['i', 7], ['e', 6], ['a', 7], ['o', 5], ['u', 4]],
  codas: [['ck', 4], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['ng', 3], ['p', 2], ['r', 3], ['s', 3], ['t', 3],
    ['x', 2], ['zz', 1], ['nk', 2], ['mp', 2], ['rk', 1], ['st', 1], ['ff', 1]],
  finalCodas: [['ck', 4], ['n', 4], ['l', 3], ['m', 3], ['s', 3], ['x', 3], ['t', 2], ['nk', 2], ['zz', 2], ['p', 2], ['rk', 1]],
  maxJunctureCluster: 2,
  patterns: [['CVK', 7], ['CV', 5], ['VK', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxLength: 11,
  endings: {
    masculine: [['ick', 3], ['o', 3], ['in', 3], ['us', 2], ['an', 2], ['ek', 2], ['wick', 1], ['il', 2], ['ert', 1]],
    feminine: [['a', 4], ['i', 3], ['ella', 2], ['y', 3], ['ina', 2], ['ix', 2], ['ette', 2], ['le', 2], ['issa', 1]],
    neutral: [['ix', 3], ['o', 3], ['el', 2], ['en', 2], ['y', 3], ['ump', 1], ['et', 2]],
  },
};

export const GNOME_CLAN: MorphSet = {
  initial: [
    m('Nack', 'cog'), m('Fizz', 'spark'), m('Bim', 'bright'), m('Tock', 'clockwork'), m('Wrenn', 'wrench'),
    m('Glim', 'glimmer'), m('Burr', 'burr'), m('Quil', 'quill'), m('Pell', 'bell'), m('Tamb', 'drum'),
    m('Zim', 'zinc'), m('Odd', 'oddment'), m('Krink', 'crank'), m('Span', 'span'), m('Nim', 'nimble'),
    m('Tidd', 'trifle'), m('Bobb', 'bob'), m('Dapp', 'dapple'), m('Mick', 'small'), m('Rook', 'rook'),
    m('Figg', 'fig'), m('Wobb', 'wobble'), m('Jang', 'jangle'), m('Clatt', 'clatter'), m('Pim', 'pin'),
    m('Snick', 'snick'), m('Thrum', 'thrum'), m('Vex', 'vexation'), m('Wint', 'winter'), m('Yarn', 'yarn'),
    m('Doff', 'doff'), m('Hask', 'husk'), m('Lott', 'lot'), m('Perr', 'perch'),
  ],
  final: [
    m('lebeck', 'workshop'), m('oddle', 'contraption'), m('ingle', 'chime'), m('ervin', 'tinker'),
    m('opple', 'puzzle'), m('anket', 'socket'), m('widdle', 'fiddle'), m('ustle', 'bustle'),
    m('ocket', 'pocket'), m('amber', 'chamber'), m('iggin', 'gadget'), m('undle', 'bundle'),
    m('ankle', 'crank'), m('issop', 'whistle'), m('ellows', 'bellows'), m('ottle', 'bottle'),
    m('igget', 'widget'), m('arrow', 'barrow'), m('umbert', 'thumb'), m('inker', 'tinker'),
    m('oggin', 'noggin'), m('astle', 'hasp'), m('orkin', 'cork'),
  ],
  linkers: [['', 12], ['e', 2], ['o', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [[2, 8], [3, 2]], 5: [[2, 6], [3, 4]] },
};

const GNOME_NICK: CompoundSet = {
  first: blend(retag(BEARING, 'q'), w('q', 'three', 'double', 'half', 'spare', 'extra', 'upside', 'inside', 'sideways', 'backwards')),
  second: lower(w('tail', 'spark', 'cog', 'latch', 'spring', 'lens', 'spool', 'gear', 'fuse', 'bolt', 'pin',
    'whistle', 'thumb', 'goggle', 'kettle', 'lantern', 'ratchet', 'tinder')),
  avoidSharedTags: ['q'],
  casing: 'fused',
};

export const GNOME: SpeciesSpec = {
  id: 'gnome',
  name: 'Gnome',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'documented',
  loreNotes: [
    'Gnomes accumulate names: a long true name, a short everyday name, nicknames from friends, and a clan name built from Gnomish words.',
    'Among other peoples a gnome usually goes by one short name or nickname rather than the full string.',
    'Clan names are compounds of ordinary Gnomish words, so they stay transparent to anyone who speaks the language.',
  ],
  citations: ['https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook'],
  traditions: [
    {
      id: 'clan',
      label: 'Short name and clan',
      weight: 10,
      note: 'The everyday short name with the Gnomish clan name.',
      genderPolicy: 'mixed',
      producers: {
        short: { kind: 'phonetic', phonology: GNOME_PHON, syllables: SHORT },
        full: { kind: 'phonetic', phonology: GNOME_PHON, syllables: EPIC },
        clan: { kind: 'morph', set: GNOME_CLAN },
        nickname: { kind: 'compound', set: GNOME_NICK },
      },
      structures: [
        ST('short-clan', 9, [S('given', 'short'), S('clan', 'clan', { label: 'Clan' })]),
        ST('short-nick-clan', 3, [S('given', 'short'),
          S('nickname', 'nickname', { prefix: '“', suffix: '”', label: 'Called' }),
          S('clan', 'clan', { label: 'Clan' })], { minComplexity: 3 }),
        ST('full-clan', 2.5, [S('birthname', 'full', { label: 'True name' }), S('clan', 'clan', { label: 'Clan' })],
          { minComplexity: 4, note: 'The long true name, used on documents and at family gatherings.' }),
        ST('full-short-clan', 1.5, [S('birthname', 'full', { label: 'True name' }),
          S('nickname', 'short', { prefix: '“', suffix: '”', label: 'Goes by' }),
          S('clan', 'clan', { label: 'Clan' })], { minComplexity: 5 }),
        ST('short-alone', 1.5, [S('given', 'short')], { note: 'How a gnome introduces themselves outside the clan.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a workshop with no door', 'a library catalogued by smell', 'a clockwork orrery that is slightly wrong',
      'a burrow under a university'],
    sp_thing: ['an invention that works only on alternate days', 'a notebook written in three hands',
      'a device nobody has asked them to explain'],
    sp_trait: ['answers questions nobody asked', 'has named every tool they own',
      'is physically incapable of leaving a mechanism alone'],
  },
};

// ===========================================================================
// HUMAN
// ===========================================================================

/**
 * Human naming is the most varied of the ten, and the 2024 rules lean into
 * that rather than tabulating ethnic groups. These six registers are original
 * fantasy regional dialects, deliberately not pastiches of real-world cultures
 * — see `_shared.ts` for the reasoning.
 */
export const HUMAN: SpeciesSpec = {
  id: 'human',
  name: 'Human',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'partial',
  loreNotes: [
    'Human naming is defined by region and family rather than by species; the 2024 rules describe humans as the most varied people on any world.',
    'Surnames may be occupational, toponymic, descriptive or patronymic, and plenty of humans use none at all.',
    'The six registers here are original regional dialects invented for this tool. They are not modelled on any real-world culture, and the published ethnic name tables are not reproduced.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'common',
      label: 'Common tongue',
      weight: 10,
      note: 'A personal name from one of the regional registers, with or without a family name.',
      genderPolicy: 'mixed',
      producers: {
        given: COMMON_GIVEN,
        surname: COMMON_SURNAME,
        epithet: { kind: 'compound', set: EARNED_EPITHET },
        patronymic: {
          kind: 'sequence',
          parts: [
            // A patronymic suffix is bolted on afterwards, so the stem has to
            // start short or the result is unreadable.
            { kind: 'phonetic', phonology: NORTHREACH, syllables: TERSE },
            { kind: 'closed', items: [['sson', 3], ['sdottir', 3], ['sen', 2], ['sdatter', 1], ['sbairn', 1]] },
          ],
        },
      },
      structures: [
        ST('given-surname', 10, [S('given', 'given'), S('family', 'surname', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
        ST('given-patronymic', 2.5, [S('given', 'given'), S('family', 'patronymic', { label: 'Patronymic' })],
          { minComplexity: 2 }),
        ST('given-surname-epithet', 2, [S('given', 'given'), S('family', 'surname', { label: 'Family' }),
          S('epithet', 'epithet', { prefix: 'the ', label: 'Epithet' })], { minComplexity: 4 }),
        ST('given-of-place', 2, [S('given', 'given'),
          S('descriptor', 'surname', { prefix: 'of ', label: 'From' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a market town two valleys over', 'a garrison that was disbanded', 'a river crossing', 'a failing estate',
      'a parish with no priest'],
    sp_thing: ['a deed to land underwater', 'a family debt', 'a letter that was never sent',
      'a signet ring from a house that no longer exists'],
    sp_trait: ['is on first-name terms with every innkeeper on one road', 'has four plans and no money',
      'learned the trade from someone they refuse to discuss'],
  },
};

// ===========================================================================
// DRAGONBORN
// ===========================================================================

export const DRAGONBORN_GIVEN: Phonology = {
  initialOnsets: [['b', 3], ['bh', 2], ['d', 3], ['dr', 3], ['g', 3], ['gh', 2], ['h', 3], ['k', 3], ['kh', 3],
    ['kr', 3], ['m', 3], ['n', 3], ['p', 2], ['r', 3], ['s', 3], ['sh', 3], ['t', 3], ['th', 3], ['thr', 2],
    ['v', 3], ['z', 2], ['zh', 2], ['j', 2], ['ch', 2], ['pr', 1], ['tr', 2], ['vr', 1], ['rh', 1], ['sk', 1], ['f', 2]],
  onsets: [['b', 2], ['d', 3], ['g', 2], ['h', 3], ['k', 3], ['kh', 2], ['l', 3], ['m', 3], ['n', 3], ['r', 4],
    ['s', 3], ['sh', 2], ['t', 3], ['th', 2], ['v', 2], ['z', 2], ['dr', 1], ['j', 1], ['rr', 1], ['nn', 1]],
  nuclei: [['a', 9], ['e', 6], ['i', 6], ['o', 5], ['u', 4], ['ia', 2], ['ua', 1]],
  codas: [['rh', 1], ['sh', 3], ['th', 3], ['kh', 2], ['r', 4], ['n', 4], ['s', 3], ['k', 3],
    ['t', 2], ['d', 2], ['l', 2], ['m', 2], ['nd', 2], ['rg', 2], ['sht', 1], ['rk', 2], ['zh', 1], ['ng', 2], ['rn', 2]],
  finalCodas: [['r', 4], ['n', 4], ['sh', 3], ['th', 3], ['s', 2], ['k', 2], ['rn', 2], ['l', 2], ['kh', 2], ['rg', 1]],
  patterns: [['CVK', 7], ['CV', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  endings: {
    masculine: [['an', 3], ['ar', 3], ['esh', 2], ['ir', 2], ['on', 2], ['ash', 2], ['un', 2], ['akh', 2], ['aar', 1]],
    feminine: [['a', 4], ['ra', 3], ['iri', 2], ['ann', 2], ['ith', 2], ['eh', 2], ['isa', 2], ['ya', 2], ['aan', 1]],
    neutral: [['ex', 2], ['in', 2], ['eth', 2], ['av', 2], ['ix', 2], ['is', 2], ['ur', 1]],
  },
  forbidJunctures: ['hh', 'qq'],
  maxLength: 12,
};

const DRAGONBORN_CLAN: Phonology = {
  initialOnsets: [['c', 3], ['d', 3], ['dr', 2], ['f', 2], ['g', 2], ['h', 2], ['j', 2], ['k', 3], ['kh', 2],
    ['l', 3], ['m', 3], ['n', 3], ['p', 2], ['pr', 2], ['r', 2], ['s', 3], ['sh', 3], ['t', 3], ['th', 3],
    ['v', 3], ['x', 2], ['y', 2], ['z', 2], ['kl', 1], ['nd', 1], ['st', 1], ['b', 2]],
  onsets: [['d', 3], ['k', 3], ['kh', 2], ['l', 4], ['m', 3], ['n', 4], ['r', 3], ['s', 4], ['sh', 3], ['t', 4],
    ['th', 3], ['v', 2], ['x', 2], ['z', 2], ['j', 2], ['nd', 2], ['ss', 2], ['ll', 2], ['nth', 1], ['rth', 1],
    ['st', 1], ['sk', 1], ['g', 2], ['b', 1], ['p', 1], ['f', 1]],
  nuclei: [['a', 10], ['i', 9], ['e', 6], ['o', 4], ['u', 3], ['ia', 1]],
  codas: [['n', 4], ['s', 3], ['r', 3], ['l', 3], ['th', 2], ['sh', 2], ['k', 2], ['m', 2]],
  finalCodas: [['r', 4], ['th', 4], ['n', 4], ['sh', 3], ['l', 3], ['s', 3], ['k', 2]],
  patterns: [['CV', 9], ['CVK', 3]],
  finalPatterns: [['CVK', 7], ['CV', 3]],
  forbidJunctures: ['qq', 'ww'],
  maxJunctureCluster: 2,
};

const DRAGONBORN_CHILDHOOD: CompoundSet = {
  first: blend(
    w('thing', 'shield', 'ear', 'tail', 'horn', 'wing', 'step', 'cloud', 'flame', 'rock', 'river', 'star',
      'dusk', 'scale', 'claw', 'song', 'book', 'road', 'gate', 'wind', 'sand', 'snow', 'salt', 'thorn', 'lamp'),
  ),
  second: lower(w('tail', 'bender', 'biter', 'climber', 'leaper', 'chaser', 'watcher', 'counter', 'breaker',
    'singer', 'keeper', 'finder', 'runner', 'carver', 'taster', 'dreamer', 'listener', 'talker', 'walker',
    'sitter', 'sleeper', 'hoarder', 'shaker')),
  casing: 'fused',
};

const DRAGONBORN_TRAIT: VirtueSet = {
  concepts: w('trait', 'Pious', 'Zealous', 'Patient', 'Fearless', 'Earnest', 'Tireless', 'Watchful', 'Solemn',
    'Steadfast', 'Curious', 'Unhurried', 'Exacting', 'Generous', 'Stubborn', 'Wakeful', 'Forthright'),
  qualifierChance: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export const DRAGONBORN: SpeciesSpec = {
  id: 'dragonborn',
  name: 'Dragonborn',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1', 'Fizban’s Treasury of Dragons'],
  confidence: 'documented',
  loreNotes: [
    'Dragonborn place the clan name FIRST, before the personal name, as a mark of honour. This ordering is the single most distinctive thing about their naming.',
    'Clan names are long — commonly five or more syllables — and are not translated into Common.',
    'Children earn a childhood name, usually a plain descriptive Common word for something they do, which many keep into adulthood as an affectionate nickname.',
    'A dragonborn who gives only their personal name is signalling something: either informality or separation from a clan.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'clan-first',
      label: 'Clan name first',
      weight: 10,
      note: 'The clan name precedes the personal name.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: DRAGONBORN_GIVEN, syllables: SHORT },
        clan: { kind: 'phonetic', phonology: DRAGONBORN_CLAN, syllables: EPIC },
        childhood: {
          kind: 'oneOf',
          options: [
            [{ kind: 'compound', set: DRAGONBORN_CHILDHOOD }, 7],
            [{ kind: 'virtue', set: DRAGONBORN_TRAIT }, 3],
          ],
        },
      },
      structures: [
        ST('clan-given', 10, [S('clan', 'clan', { label: 'Clan' }), S('given', 'given')],
          { note: 'Clan name first — the canonical dragonborn order.' }),
        ST('clan-given-childhood', 3.5, [S('clan', 'clan', { label: 'Clan' }), S('given', 'given'),
          S('nickname', 'childhood', { prefix: '“', suffix: '”', label: 'Childhood name' })], { minComplexity: 3 }),
        ST('given-alone', 2, [S('given', 'given')],
          { note: 'The personal name alone: informal, or clanless.' }),
        ST('given-childhood', 1.2, [S('given', 'given'),
          S('nickname', 'childhood', { prefix: '“', suffix: '”', label: 'Childhood name' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a clan hall they have not entered in years', 'a hatchery', 'a mountain shrine', 'a clan archive',
      'the site of an old oath'],
    sp_thing: ['a clan honour they did not earn', 'a debt owed to their clan by someone long dead',
      'a scale shed at the wrong time of year', 'an inherited grievance they privately find ridiculous'],
    sp_trait: ['introduces themselves with the full clan name every single time',
      'keeps a scrupulous tally of favours in both directions', 'never raises their voice'],
  },
};

// ===========================================================================
// ORC
// ===========================================================================

export const ORC_PHON: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['g', 4], ['gr', 3], ['h', 3], ['k', 4], ['kr', 3], ['m', 3], ['n', 3],
    ['r', 2], ['s', 3], ['sh', 3], ['t', 3], ['th', 3], ['v', 2], ['z', 2], ['zh', 2], ['br', 2], ['dr', 2],
    ['thr', 2], ['gh', 2], ['kh', 2], ['ng', 1], ['y', 2], ['w', 1], ['f', 2], ['skr', 1]],
  onsets: [['b', 2], ['d', 2], ['g', 3], ['k', 3], ['l', 2], ['m', 3], ['n', 3], ['r', 3], ['s', 2], ['sh', 2],
    ['t', 2], ['th', 2], ['v', 2], ['z', 2], ['gg', 1], ['kk', 1], ['nn', 1], ['rr', 1]],
  nuclei: [['a', 9], ['o', 7], ['u', 6], ['e', 5], ['i', 4], ['aa', 1], ['oo', 2], ['ua', 1]],
  codas: [['g', 4], ['k', 4], ['gh', 3], ['kh', 2], ['m', 3], ['n', 4], ['ng', 3], ['r', 3], ['rk', 3], ['rg', 2],
    ['sh', 3], ['th', 2], ['zh', 1], ['nk', 2], ['mp', 1], ['rt', 2], ['ld', 1], ['lk', 2], ['ss', 2], ['st', 1]],
  finalCodas: [['g', 4], ['k', 5], ['sh', 3], ['n', 4], ['m', 3], ['rk', 2], ['th', 2], ['gh', 2], ['ng', 2], ['r', 2], ['ss', 1]],
  patterns: [['CVK', 8], ['CV', 3], ['VK', 2]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  maxLength: 11,
  endings: {
    masculine: [['k', 2], ['g', 2], ['ash', 2], ['ok', 2], ['ur', 2], ['gar', 2], ['nak', 1], ['rukh', 1], ['um', 1]],
    feminine: [['a', 4], ['ka', 2], ['na', 2], ['sha', 2], ['ga', 2], ['vi', 2], ['tha', 2], ['ya', 1], ['ulla', 1]],
    neutral: [['ak', 2], ['en', 2], ['ur', 2], ['esh', 2], ['og', 2], ['im', 1]],
  },
};

export const ORC_EPITHET: CompoundSet = {
  first: blend(
    retag(SMALL_NUMBERS, 'count'),
    w('q', 'first', 'last', 'long', 'far', 'late', 'twice', 'thrice', 'half', 'open', 'north', 'south',
      'high', 'low', 'lone', 'steady', 'early', 'winter', 'summer'),
    retag(WEATHER, 'nature'), retag(STONE, 'nature'),
  ),
  second: lower(blend(
    retag(AGENTS, 'tail'),
    w('tail', 'winters', 'roads', 'rivers', 'promise', 'return', 'standing', 'crossing', 'bargain', 'word',
      'shoulder', 'stride', 'watch', 'harvest', 'ford', 'summit'),
  )),
  avoidSharedTags: ['q', 'nature'],
  casing: 'hyphenated',
};

export const ORC_TRIBE: MorphSet = {
  initial: [
    m('Karr', 'the ridge'), m('Grum', 'thunder'), m('Oth', 'the long walk'), m('Bazh', 'the ford'),
    m('Durr', 'the deep'), m('Haga', 'the elders'), m('Immo', 'the first fire'), m('Khel', 'the standing stone'),
    m('Mogh', 'the wide sky'), m('Naz', 'the salt'), m('Rukh', 'the crag'), m('Shev', 'the river bend'),
    m('Thokk', 'the old road'), m('Ugar', 'the watchers'), m('Vol', 'the gathering'), m('Zheg', 'the ember'),
    m('Brag', 'the horn'), m('Lurn', 'the low pass'), m('Yamm', 'the shore'), m('Gesh', 'the harvest'),
  ],
  final: [
    m('mak', 'kin'), m('dur', 'people'), m('ash', 'camp'), m('gol', 'company'), m('nak', 'hearth'),
    m('ruk', 'band'), m('thar', 'line'), m('zag', 'ring'), m('mor', 'march'), m('kesh', 'gathering'),
    m('hurn', 'horn'), m('vash', 'standing'),
  ],
  linkers: [['', 8], ['a', 3], ['u', 2], ['-', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [[2, 8], [3, 2]] },
};

export const ORC: SpeciesSpec = {
  id: 'orc',
  name: 'Orc',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1', 'Monsters of the Multiverse'],
  confidence: 'documented',
  loreNotes: [
    'Orc names are short and strongly consonantal; published examples run to one or two syllables and do not consistently mark gender.',
    'Epithets are earned and describe a deed, a journey, a count of winters or a role — not a disposition. Orcs in the 2024 rules are a people, not a moral alignment, and this generator never produces violence-coded or "evil-sounding" names by default.',
    'Tribe or band names are used alongside personal names in some communities and omitted entirely in others.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'given-earned',
      label: 'Personal name and earned epithet',
      weight: 10,
      note: 'A short personal name, often with an epithet earned for something specific.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: ORC_PHON, syllables: TERSE },
        epithet: { kind: 'compound', set: ORC_EPITHET },
        tribe: { kind: 'morph', set: ORC_TRIBE },
      },
      structures: [
        ST('given-epithet', 7, [S('given', 'given'), S('epithet', 'epithet', { label: 'Epithet' })]),
        ST('given-alone', 6, [S('given', 'given')]),
        ST('given-tribe', 3.5, [S('given', 'given'), S('clan', 'tribe', { prefix: 'of ', label: 'Band' })],
          { minComplexity: 2 }),
        ST('given-epithet-tribe', 1.5, [S('given', 'given'), S('epithet', 'epithet', { label: 'Epithet' }),
          S('clan', 'tribe', { prefix: 'of ', label: 'Band' })], { minComplexity: 4 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a winter camp', 'a pass that has to be kept open', 'a burial cairn', 'a trading post',
      'a seasonal gathering'],
    sp_thing: ['a tally of winters cut into a staff', 'a share of a harvest they never collected',
      'an epithet that no longer fits', 'a drum that belonged to someone else'],
    sp_trait: ['counts everything aloud', 'keeps a promise long after it stopped mattering',
      'is far more patient than anyone expects'],
  },
};

// ===========================================================================
// GOLIATH
// ===========================================================================

export const GOLIATH_PHON: Phonology = {
  initialOnsets: [['k', 4], ['g', 3], ['l', 3], ['m', 4], ['n', 4], ['p', 3], ['t', 4], ['th', 3], ['v', 3],
    ['h', 3], ['w', 2], ['y', 2], ['kh', 2], ['r', 2], ['s', 2], ['b', 2]],
  onsets: [['k', 4], ['l', 5], ['m', 4], ['n', 4], ['t', 4], ['th', 3], ['v', 3], ['h', 3], ['p', 2], ['g', 3],
    ['r', 3], ['w', 2], ['y', 2], ['ng', 2], ['s', 2], ['b', 1], ['kh', 1]],
  nuclei: [['a', 10], ['o', 7], ['e', 6], ['i', 6], ['u', 5], ['au', 2], ['ai', 2], ['ea', 2], ['ei', 1], ['oa', 1], ['ia', 1]],
  codas: [['n', 3], ['m', 2], ['k', 2], ['l', 2], ['th', 1], ['r', 1]],
  finalCodas: [['n', 3], ['k', 2], ['m', 2], ['l', 2], ['th', 1]],
  patterns: [['CV', 10], ['V', 1], ['CVK', 2]],
  finalPatterns: [['CV', 7], ['CVK', 3]],
  internalMark: { mark: '-', chance: 0.12 },
  endings: {
    masculine: [['k', 2], ['n', 2], ['th', 1], ['kan', 2], ['tho', 1], ['mak', 1]],
    feminine: [['a', 4], ['i', 2], ['ea', 2], ['nea', 1], ['lla', 1]],
    neutral: [['o', 3], ['i', 3], ['a', 3], ['u', 2], ['e', 2]],
  },
  forbidJunctures: ['qq', 'xx', 'zz'],
};

const GOLIATH_CLAN: Phonology = {
  ...GOLIATH_PHON,
  internalMark: { mark: '-', chance: 0.22 },
  endings: undefined,
  finalPatterns: [['CV', 8], ['V', 2]],
};

const GOLIATH_NICKNAME: CompoundSet = {
  first: blend(
    retag(BEASTS, 'nature'), retag(BIRDS, 'nature'), retag(STONE, 'nature'), retag(WEATHER, 'nature'),
    retag(HIGHLAND, 'nature'), retag(LIGHT, 'nature'),
    w('thing', 'rope', 'thread', 'word', 'horn', 'flint', 'bone', 'wind', 'track', 'snow', 'root', 'ledge', 'knot'),
    w('q', 'lone', 'twice', 'steady', 'keen', 'long', 'quiet', 'true', 'far', 'first', 'last'),
  ),
  second: lower(blend(
    retag(AGENTS, 'tail'),
    w('tail', 'killer', 'caller', 'carver', 'leaper', 'smasher', 'twister', 'painter', 'hand', 'eye', 'foot',
      'orphaned', 'limbed', 'born', 'marked', 'sworn'),
  )),
  avoidSharedTags: ['nature', 'q'],
  casing: 'fused',
};

export const GOLIATH: SpeciesSpec = {
  id: 'goliath',
  name: 'Goliath',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1', 'Monsters of the Multiverse', 'Elemental Evil Player’s Companion'],
  confidence: 'documented',
  loreNotes: [
    'Goliath names have three parts: a birth name given by the elders, a nickname awarded by the community for a deed or trait, and a clan name.',
    'Birth names can run to many syllables; in practice only the first part or two is used day to day.',
    'Clan names are long and vowel-rich, and frequently contain a hyphenated element.',
    'Nicknames can be revoked and reassigned, so a goliath may carry several across a lifetime.',
    'The 2024 rules attach goliaths to a giant ancestry (cloud, fire, frost, hill, stone, storm) but do not tie naming to it, so this entry does not invent per-ancestry phonologies.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'three-part',
      label: 'Birth name, nickname, clan',
      weight: 10,
      note: 'Birth name from the elders, nickname from the community, clan name from the lineage.',
      genderPolicy: 'mixed',
      producers: {
        birth: { kind: 'phonetic', phonology: GOLIATH_PHON, syllables: LONG },
        longBirth: { kind: 'phonetic', phonology: GOLIATH_PHON, syllables: EPIC },
        clan: { kind: 'phonetic', phonology: GOLIATH_CLAN, syllables: LONG },
        nickname: { kind: 'compound', set: GOLIATH_NICKNAME },
      },
      structures: [
        ST('birth-nick-clan', 7, [S('given', 'birth'), S('nickname', 'nickname', { label: 'Nickname' }),
          S('clan', 'clan', { label: 'Clan' })]),
        ST('birth-clan', 5, [S('given', 'birth'), S('clan', 'clan', { label: 'Clan' })]),
        ST('birth-nick', 3, [S('given', 'birth'), S('nickname', 'nickname', { label: 'Nickname' })]),
        ST('longbirth-nick-clan', 2, [S('birthname', 'longBirth', { label: 'Birth name' }),
          S('nickname', 'nickname', { label: 'Nickname' }), S('clan', 'clan', { label: 'Clan' })],
          { minComplexity: 4, note: 'The full birth name, as the elders would say it.' }),
        ST('birth-alone', 1.2, [S('given', 'birth')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a high camp', 'a scree slope', 'a cairn above the treeline', 'a winter crossing', 'a stone circle'],
    sp_thing: ['a nickname the community took back', 'a rope with too many splices',
      'a tally of everyone who owes them nothing', 'a stone carried down from somewhere specific'],
    sp_trait: ['keeps score fairly and out loud', 'will not accept help they have not earned',
      'treats every contest as worth doing properly'],
  },
};

// ===========================================================================
// TIEFLING
// ===========================================================================

export const TIEFLING_INFERNAL: Phonology = {
  initialOnsets: [['k', 3], ['m', 4], ['b', 3], ['d', 3], ['l', 3], ['n', 3], ['p', 3], ['r', 3], ['s', 3],
    ['t', 3], ['th', 3], ['ch', 2], ['ph', 2], ['z', 2], ['kr', 2], ['br', 2], ['tr', 2], ['dr', 2], ['sk', 2],
    ['st', 2], ['ps', 1], ['a', 2], ['e', 2], ['i', 2], ['o', 1], ['h', 2], ['v', 2], ['g', 2], ['x', 1]],
  onsets: [['k', 3], ['l', 4], ['m', 4], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['th', 2], ['d', 3], ['b', 2],
    ['ch', 2], ['ph', 2], ['z', 2], ['v', 2], ['g', 2], ['ss', 1], ['ll', 1], ['nn', 1], ['x', 1], ['p', 2]],
  nuclei: [['a', 8], ['e', 7], ['i', 6], ['o', 5], ['u', 3], ['ai', 2], ['ei', 2], ['ia', 3], ['au', 2], ['eo', 1], ['ae', 1]],
  codas: [['s', 4], ['n', 4], ['m', 3], ['r', 3], ['l', 3], ['th', 2], ['k', 2], ['ch', 2], ['ph', 1], ['x', 2],
    ['st', 2], ['rt', 2], ['kt', 1], ['nd', 1], ['sk', 1]],
  finalCodas: [['s', 5], ['n', 4], ['m', 3], ['r', 3], ['l', 3], ['th', 2], ['x', 2], ['k', 2]],
  patterns: [['CV', 6], ['CVK', 5], ['V', 2], ['VK', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxLength: 12,
  endings: {
    masculine: [['os', 3], ['on', 3], ['as', 3], ['is', 2], ['us', 2], ['ai', 1], ['ar', 2], ['eus', 1], ['imos', 1]],
    feminine: [['a', 4], ['ia', 3], ['is', 2], ['eia', 2], ['ara', 2], ['esta', 1], ['ais', 1], ['ina', 2], ['ione', 1]],
    neutral: [['ei', 2], ['ix', 2], ['eth', 2], ['ar', 2], ['os', 2], ['ai', 2]],
  },
};

const TIEFLING_VIRTUE: VirtueSet = {
  concepts: blend(VIRTUES, CONCEPTS, DARK_CONCEPTS, ADVERBIAL_CONCEPTS,
    w('bare', 'Random', 'Open', 'Weary', 'Uncommon'),
    w('concept', 'Chant', 'Creed', 'Ideal', 'Poetry', 'Quest', 'Temerity', 'Art',
      'Fathom', 'Latchkey', 'Measure', 'Omen', 'Recompense', 'Signal', 'Testament', 'Vantage',
      'Witness', 'Yield', 'Zenith', 'Aftermath', 'Benefit', 'Caution', 'Abeyance', 'Accord', 'Admonition',
      'Allowance', 'Amends', 'Answer', 'Argument', 'Augury', 'Balance', 'Bargain', 'Blessing', 'Burden',
      'Candle', 'Charter', 'Clamour', 'Clause', 'Comfort', 'Conduct', 'Counsel', 'Credit', 'Decorum',
      'Delay', 'Difference', 'Distinction', 'Doubt', 'Earnest', 'Emphasis', 'Exception', 'Excuse',
      'Exhibit', 'Expense', 'Favour', 'Forecast', 'Grievance', 'Guarantee', 'Hazard', 'Hearing',
      'Impulse', 'Incident', 'Instance', 'Intention', 'Judgement', 'Leniency', 'Liberty', 'Licence',
      'Mention', 'Method', 'Misgiving', 'Notion', 'Objection', 'Occasion', 'Offering', 'Opinion',
      'Pardon', 'Parcel', 'Pretext', 'Promise', 'Provision', 'Qualm', 'Quarrel', 'Query', 'Recital',
      'Refusal', 'Regret', 'Rejoinder', 'Relief', 'Remedy', 'Reminder', 'Reply', 'Request', 'Reserve',
      'Retort', 'Reversal', 'Riddle', 'Sanction', 'Scruple', 'Second Thought', 'Sentence', 'Severance',
      'Standing', 'Statement', 'Stipend', 'Subject', 'Summons', 'Supposition', 'Surety', 'Suspicion',
      'Term', 'Thanks', 'Tolerance', 'Trouble', 'Verdict', 'Version', 'Warning', 'Welcome', 'Whereabouts')),
  qualifiers: QUALIFIERS,
  qualifierChance: { 1: 0.12, 2: 0.26, 3: 0.42, 4: 0.58, 5: 0.7 },
  casing: 'spaced',
};

export const TIEFLING: SpeciesSpec = {
  id: 'tiefling',
  name: 'Tiefling',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'SRD 5.2.1'],
  confidence: 'documented',
  loreNotes: [
    'Tieflings use three distinct and equally legitimate naming traditions: inherited Infernal names, ordinary names from the region they grew up in, and chosen "virtue names" taken from a concept or quality.',
    'Virtue names are not required to be grim; the published examples range from Hope and Reverence to Nowhere and Random.',
    'The 2024 rules give tieflings a fiendish legacy (Abyssal, Chthonic or Infernal) rather than a bloodline, and attach no naming rules to the choice, so this entry does not invent per-legacy phonologies.',
    'A tiefling raised among humans is very likely to have a perfectly ordinary human name, and the generator reflects that.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/srd',
  ],
  traditions: [
    {
      id: 'infernal',
      label: 'Inherited Infernal name',
      weight: 7,
      note: 'A name handed down the family line from an older tongue.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: TIEFLING_INFERNAL, syllables: MEDIUM },
        line: { kind: 'phonetic', phonology: TIEFLING_INFERNAL, syllables: LONG },
        virtue: { kind: 'virtue', set: TIEFLING_VIRTUE },
      },
      structures: [
        ST('infernal-alone', 8, [S('given', 'given')]),
        ST('infernal-line', 4, [S('given', 'given'), S('family', 'line', { label: 'Line' })], { minComplexity: 2 }),
        ST('infernal-virtue', 2, [S('given', 'given'),
          S('epithet', 'virtue', { separator: ', ', prefix: 'called ', label: 'Chosen name' })],
          { minComplexity: 3 }),
      ],
    },
    {
      id: 'virtue',
      label: 'Virtue name',
      weight: 6,
      note: 'A name chosen from a concept, quality or idea — adopted, not inherited.',
      genderPolicy: 'neutral',
      producers: {
        virtue: { kind: 'virtue', set: TIEFLING_VIRTUE },
        given: { kind: 'phonetic', phonology: TIEFLING_INFERNAL, syllables: SHORT },
      },
      structures: [
        ST('virtue-alone', 9, [S('given', 'virtue', { label: 'Chosen name' })]),
        ST('given-virtue', 3, [S('given', 'given'), S('epithet', 'virtue', { label: 'Chosen name' })],
          { minComplexity: 2 }),
      ],
    },
    {
      id: 'common',
      label: 'Name of the region',
      weight: 5,
      note: 'An ordinary name from wherever this tiefling was raised.',
      genderPolicy: 'mixed',
      producers: {
        given: COMMON_GIVEN,
        surname: COMMON_SURNAME,
        virtue: { kind: 'virtue', set: TIEFLING_VIRTUE },
      },
      structures: [
        ST('common-given-surname', 9, [S('given', 'given'), S('family', 'surname', { label: 'Family' })]),
        ST('common-given', 3, [S('given', 'given')]),
        ST('common-virtue', 2, [S('given', 'given'), S('family', 'surname', { label: 'Family' }),
          S('epithet', 'virtue', { separator: ', ', prefix: 'called ', label: 'Chosen name' })],
          { minComplexity: 4 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a congregation that would not have them', 'a city where they were the only one',
      'a crossroads shrine', 'a boarding house that asked no questions'],
    sp_thing: ['a contract written in a hand they recognise', 'a name they chose and have outgrown',
      'an inheritance with conditions attached', 'a letter of recommendation that is slightly too warm'],
    sp_trait: ['reads every agreement twice', 'is tired of being asked where the horns came from',
      'has an unnervingly good memory for faces'],
  },
};

// ===========================================================================
// AASIMAR
// ===========================================================================

const AASIMAR_CELESTIAL: MorphSet = {
  initial: [
    m('Aur', 'dawn'), m('Cael', 'vault of heaven'), m('Ser', 'burning'), m('Thal', 'radiance'), m('Ura', 'brightness'),
    m('Emen', 'grace'), m('Ila', 'mercy'), m('Oran', 'choir'), m('Veth', 'vigil'), m('Zar', 'gleam'),
    m('Mir', 'wonder'), m('Sael', 'song'), m('Lum', 'lamplight'), m('Nev', 'snowlight'), m('Ith', 'star'),
    m('Qel', 'the high place'), m('Rael', 'herald'), m('Val', 'worth'), m('Ysa', 'morning'), m('Ohm', 'stillness'),
    m('Beth', 'threshold'), m('Dai', 'daybreak'), m('Fael', 'kindness'), m('Hesp', 'evening star'),
  ],
  final: [
    m('iel', 'of the host'), m('ael', 'bearer'), m('ion', 'voice'), m('ara', 'bright'), m('eth', 'witness'),
    m('is', 'light'), m('or', 'watcher'), m('ana', 'blessing'), m('ium', 'vault'), m('aeth', 'flame'),
    m('ya', 'dawn'), m('on', 'servant'), m('enna', 'wing'), m('ith', 'star'), m('us', 'herald'),
    m('arel', 'promise'), m('iah', 'answer'), m('ome', 'house'),
  ],
  linkers: [['', 10], ['a', 2], ['i', 1]],
  endings: {
    masculine: [['iel', 2], ['on', 2], ['us', 2], ['ar', 1]],
    feminine: [['a', 3], ['ia', 2], ['iel', 2], ['ara', 1]],
    neutral: [['iel', 2], ['eth', 2], ['is', 2], ['ael', 1]],
  },
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [[2, 8], [3, 2]], 5: [[2, 6], [3, 4]] },
};

const AASIMAR_EPITHET: VirtueSet = {
  concepts: blend(VIRTUES,
    w('concept', 'Dawn', 'Vigil', 'Answer', 'Errand', 'Summons', 'Beacon', 'Lantern', 'Warden', 'Witness',
      'Threshold', 'Reprieve', 'Second Chance', 'Late Mercy', 'Quiet Hour', 'Long Watch')),
  qualifiers: blend(QUALIFIERS, w('qualifier', 'Unlooked-for', 'Unasked', 'Belated', 'Borrowed', 'Reluctant', 'Quiet')),
  qualifierChance: { 1: 0.03, 2: 0.08, 3: 0.16, 4: 0.28, 5: 0.4 },
  casing: 'spaced',
};

export const AASIMAR: SpeciesSpec = {
  id: 'aasimar',
  name: 'Aasimar',
  tier: 'core',
  group: 'Core — 2024 Player’s Handbook',
  sources: ['Player’s Handbook (2024)', 'Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'Aasimar are born to the peoples around them and are raised inside those cultures, so most carry an entirely ordinary name from wherever they grew up. This generator uses the shared common-tongue registers for that case and says so in the result.',
    'Some aasimar take or are given a second, celestial-sounding name once their guide manifests; it sits alongside the fostered name rather than replacing it.',
    'There is no single published "aasimar language" name table, so the celestial morphology here is original, built from radiance, vigil and herald imagery.',
  ],
  citations: [
    'https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook',
    'https://www.dndbeyond.com/species',
  ],
  traditions: [
    {
      id: 'fostered',
      label: 'Fostered name',
      weight: 6,
      note: 'The naming tradition of the people who raised them.',
      genderPolicy: 'mixed',
      producers: {
        given: COMMON_GIVEN,
        surname: COMMON_SURNAME,
        epithet: { kind: 'virtue', set: AASIMAR_EPITHET },
      },
      structures: [
        ST('fostered-full', 8, [S('given', 'given'), S('family', 'surname', { label: 'Family' })]),
        ST('fostered-alone', 2.5, [S('given', 'given')]),
        ST('fostered-epithet', 2.5, [S('given', 'given'), S('family', 'surname', { label: 'Family' }),
          S('epithet', 'epithet', { separator: ', ', prefix: 'called ', label: 'Called' })], { minComplexity: 3 }),
      ],
    },
    {
      id: 'celestial',
      label: 'Celestial-touched name',
      weight: 4,
      note: 'A name taken after the guide first spoke.',
      genderPolicy: 'mixed',
      producers: {
        celestial: { kind: 'morph', set: AASIMAR_CELESTIAL },
        epithet: { kind: 'virtue', set: AASIMAR_EPITHET },
        surname: COMMON_SURNAME,
      },
      structures: [
        ST('celestial-alone', 5, [S('given', 'celestial')]),
        ST('celestial-epithet', 5, [S('given', 'celestial'),
          S('epithet', 'epithet', { separator: ', ', prefix: 'called ', label: 'Called' })], { minComplexity: 2 }),
        ST('celestial-fostered-surname', 3, [S('given', 'celestial'),
          S('family', 'surname', { label: 'Family' })],
          { note: 'A celestial given name kept alongside the family they were raised in.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a shrine with the wrong saint', 'an orphanage ledger', 'a hospital tent', 'a sealed reliquary'],
    sp_thing: ['instructions they did not ask for', 'a vision that has not come true yet',
      'a debt of gratitude they cannot discharge', 'a voice that goes quiet at inconvenient moments'],
    sp_trait: ['glows faintly when embarrassed', 'is deeply tired of being called a blessing',
      'argues with something nobody else can hear'],
  },
};

export const CORE_SPECIES: SpeciesSpec[] = [
  AASIMAR, DRAGONBORN, DWARF, ELF, GNOME, GOLIATH, HALFLING, HUMAN, ORC, TIEFLING,
];
