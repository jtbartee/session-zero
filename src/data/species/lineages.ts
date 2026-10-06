/**
 * Lineages and dwarven/gnomish offshoots.
 *
 * A *lineage* (dhampir, hexblood, reborn) is explicitly not a species: it is
 * something that happened to a person who already had a species and a name.
 * That is why these entries lean on the shared common-tongue registers and
 * say so, rather than inventing a "dhampir language".
 */

import type { CompoundSet, MorphSet, Phonology, SpeciesSpec, VirtueSet } from '../../types/index.ts';
import {
  COLOURS, DARK_CONCEPTS, DEEP_PLACES, METALS, QUALIFIERS, SMALL_NUMBERS, STONE,
  UNDERGROWTH, blend, lower, m, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { DWARF_CLAN_OPAQUE, DWARF_GIVEN, GNOME_CLAN, GNOME_PHON, ORC_EPITHET, ORC_PHON, ORC_TRIBE } from './core.ts';
import { S, SHORT, ST, TERSE } from './_helpers.ts';

const LINEAGE_GROUP = 'Expanded — Lineages';
const KIN_GROUP = 'Expanded — Dwarf and gnome kin';

// ---------------------------------------------------------------------------
// HALF-ORC
// ---------------------------------------------------------------------------

export const HALF_ORC: SpeciesSpec = {
  id: 'half-orc', name: 'Half-Orc', tier: 'expanded', group: 'Expanded — Mixed heritage',
  sources: ['Player’s Handbook (2014)', 'Basic Rules'],
  confidence: 'documented',
  loreNotes: [
    'Half-orcs use orc names, human names, or both, depending on who raised them.',
    'Epithets earned among orc communities are common and describe deeds or roles rather than temperament.',
    'The 2024 Player’s Handbook folds mixed heritage into the parent species; this remains a supported legacy option.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'orc-raised', label: 'Raised among orcs', weight: 5,
      note: 'A short orcish name, often with an earned epithet.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: ORC_PHON, syllables: TERSE },
        epithet: { kind: 'compound', set: ORC_EPITHET },
        tribe: { kind: 'morph', set: ORC_TRIBE },
      },
      structures: [
        ST('given-epithet', 6, [S('given', 'given'), S('epithet', 'epithet', { label: 'Epithet' })]),
        ST('given-alone', 5, [S('given', 'given')]),
        ST('given-tribe', 3, [S('given', 'given'), S('clan', 'tribe', { prefix: 'of ', label: 'Band' })],
          { minComplexity: 2 }),
      ],
    },
    {
      id: 'human-raised', label: 'Raised among humans', weight: 4,
      note: 'An ordinary name from the region they grew up in.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME },
      structures: [
        ST('given-family', 8, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
      ],
    },
    {
      id: 'blended', label: 'A name from each side', weight: 3,
      note: 'An orcish given name with a Common family name, or the reverse.',
      genderPolicy: 'mixed',
      producers: {
        orcGiven: { kind: 'phonetic', phonology: ORC_PHON, syllables: TERSE },
        humanGiven: COMMON_GIVEN,
        humanFamily: COMMON_SURNAME,
        epithet: { kind: 'compound', set: ORC_EPITHET },
      },
      structures: [
        ST('orc-given-human-family', 6, [S('given', 'orcGiven'), S('family', 'humanFamily', { label: 'Family' })]),
        ST('human-given-orc-epithet', 5, [S('given', 'humanGiven'), S('epithet', 'epithet', { label: 'Epithet' })]),
        ST('human-given-both', 2, [S('given', 'humanGiven'), S('family', 'humanFamily', { label: 'Family' }),
          S('epithet', 'epithet', { label: 'Epithet' })], { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a town that was careful around them', 'a camp that was not',
      'a hiring hall where they are the first choice and the last invited'],
    sp_thing: ['two names and a preference they rarely state', 'an epithet earned somewhere they no longer go'],
    sp_trait: ['is used to being the largest person in any room and quiet about it',
      'has learned to announce themselves before entering'],
  },
};

// ---------------------------------------------------------------------------
// DUERGAR
// ---------------------------------------------------------------------------

const DUERGAR_PHON: Phonology = {
  ...DWARF_GIVEN,
  nuclei: [['u', 9], ['o', 7], ['a', 6], ['e', 4], ['i', 4], ['y', 2]],
  initialNuclei: [['u', 8], ['o', 7], ['a', 6], ['e', 4], ['i', 4]],
  endings: {
    masculine: [['ur', 4], ['ak', 2], ['orn', 2], ['un', 3], ['gar', 2], ['dek', 1]],
    feminine: [['a', 4], ['ra', 2], ['unn', 3], ['dis', 2], ['kra', 1], ['grid', 1]],
    neutral: [['ek', 3], ['un', 3], ['ir', 2], ['oth', 2], ['ar', 2]],
  },
};

const DUERGAR_CLAN: CompoundSet = {
  first: blend(retag(METALS, 'material'), retag(STONE, 'material'), retag(DEEP_PLACES, 'place'),
    w('q', 'grey', 'black', 'iron', 'sunless', 'lower', 'under', 'cold', 'long', 'hard', 'bitter', 'narrow')),
  second: lower(w('tail', 'hold', 'shaft', 'chain', 'quota', 'ledger', 'watch', 'pick', 'hammer', 'yoke',
    'tally', 'forge', 'gate', 'drum', 'anvil', 'brand', 'furnace', 'warden', 'keeper', 'rivet')),
  avoidSharedTags: ['material', 'place', 'q'],
  casing: 'fused',
};

export const DUERGAR: SpeciesSpec = {
  id: 'duergar', name: 'Duergar', tier: 'expanded', group: KIN_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'partial',
  loreNotes: [
    'Duergar are dwarves of the Underdark; they keep dwarven naming — personal name plus clan — and no separate name table has been published.',
    'The darker vowel colouring and the industrial clan vocabulary here are original extensions consistent with the published setting, not invented lore.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'deep-clan', label: 'Deep clan', weight: 7,
      note: 'Dwarven naming, worn hard by the deep roads.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: DUERGAR_PHON, syllables: SHORT },
        clan: { kind: 'oneOf', options: [
          [{ kind: 'compound', set: DUERGAR_CLAN }, 5],
          [{ kind: 'morph', set: DWARF_CLAN_OPAQUE }, 5],
        ] },
      },
      structures: [
        ST('given-clan', 10, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' })]),
        ST('given-alone', 2, [S('given', 'given')]),
        ST('given-of-clan', 2, [S('given', 'given'), S('clan', 'clan', { prefix: 'of ', label: 'Hold' })],
          { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a work gang', 'a sunless hold', 'a quota office', 'a deep road'],
    sp_thing: ['a tally of days worked', 'a chain they kept after it was struck off'],
    sp_trait: ['is uncomfortable under an open sky', 'does not waste a word or an hour'],
  },
};

// ---------------------------------------------------------------------------
// DEEP GNOME
// ---------------------------------------------------------------------------

const DEEP_GNOME_PHON: Phonology = {
  ...GNOME_PHON,
  initialOnsets: [['b', 3], ['br', 2], ['d', 3], ['f', 2], ['g', 3], ['gr', 2], ['j', 2], ['k', 3], ['kr', 2],
    ['l', 2], ['m', 3], ['n', 3], ['p', 2], ['r', 2], ['s', 3], ['sv', 2], ['sn', 2], ['t', 3], ['v', 2],
    ['z', 2], ['th', 2], ['zh', 1]],
  nuclei: [['i', 7], ['u', 6], ['e', 5], ['a', 5], ['o', 4], ['y', 2]],
  initialNuclei: [['i', 6], ['u', 6], ['e', 5], ['a', 6], ['o', 4]],
  endings: {
    masculine: [['ik', 3], ['un', 2], ['ar', 2], ['ek', 2], ['or', 2]],
    feminine: [['a', 4], ['i', 3], ['una', 2], ['ril', 2], ['eth', 2]],
    neutral: [['ix', 3], ['ek', 2], ['un', 2], ['il', 2], ['oth', 1]],
  },
};

const DEEP_GNOME_CLAN: MorphSet = {
  initial: [
    m('Gri', 'grey'), m('Svar', 'deep stone'), m('Niz', 'narrow'), m('Blek', 'lightless'), m('Drum', 'drum'),
    m('Kov', 'vein'), m('Mur', 'wall'), m('Pell', 'glimmer'), m('Rask', 'quick'), m('Thum', 'thumb of rock'),
    m('Vog', 'listening'), m('Zel', 'quiet'), m('Hrum', 'low sound'), m('Skav', 'chip'), m('Yrn', 'ore-smell'),
  ],
  final: [
    m('nebbel', 'warren'), m('grik', 'crevice'), m('undr', 'beneath'), m('stok', 'prop'), m('veln', 'lode'),
    m('dummel', 'hush'), m('krin', 'fissure'), m('borr', 'bore'), m('shekk', 'shelf'), m('tulm', 'pocket'),
    m('ovv', 'cavern'), m('nark', 'marker'),
  ],
  linkers: [['', 10], ['e', 2], ['i', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [[2, 8], [3, 2]], 5: [[2, 7], [3, 3]] },
};

export const DEEP_GNOME: SpeciesSpec = {
  id: 'deep-gnome', name: 'Deep Gnome (Svirfneblin)', tier: 'expanded', group: KIN_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes', 'Elemental Evil Player’s Companion'],
  confidence: 'partial',
  loreNotes: [
    'Deep gnomes keep gnomish naming — a short everyday name and a clan name — but with far less of the accumulated nickname habit of surface gnomes, which published material describes as a cultural difference.',
    'The harsher consonant colouring is an original extension; no separate svirfneblin name table has been published.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'warren', label: 'Warren and clan', weight: 7,
      note: 'A short personal name and a clan name, given sparingly.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: DEEP_GNOME_PHON, syllables: SHORT },
        clan: { kind: 'oneOf', options: [
          [{ kind: 'morph', set: DEEP_GNOME_CLAN }, 7],
          [{ kind: 'morph', set: GNOME_CLAN }, 3],
        ] },
      },
      structures: [
        ST('given-clan', 9, [S('given', 'given'), S('clan', 'clan', { label: 'Clan' })]),
        ST('given-alone', 3.5, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a warren nobody has mapped', 'a listening post', 'a fungus garden', 'a sealed gallery'],
    sp_thing: ['a stone that hums near certain things', 'a route out that only they know'],
    sp_trait: ['goes silent before anyone else hears anything', 'distrusts a conversation held in the open'],
  },
};

// ---------------------------------------------------------------------------
// DHAMPIR
// ---------------------------------------------------------------------------

const AFTER_EPITHET: VirtueSet = {
  concepts: blend(DARK_CONCEPTS,
    w('concept', 'Afterward', 'Remainder', 'Interval', 'Vigil', 'Appetite', 'Abstinence', 'Thirst', 'Fast',
      'Reprieve', 'Stay', 'Deferral', 'Second Life', 'Long Night')),
  qualifiers: QUALIFIERS,
  qualifierChance: { 1: 0.05, 2: 0.12, 3: 0.2, 4: 0.32, 5: 0.45 },
  casing: 'spaced',
};

export const DHAMPIR: SpeciesSpec = {
  id: 'dhampir', name: 'Dhampir (lineage)', tier: 'expanded', group: LINEAGE_GROUP,
  sources: ['Van Richten’s Guide to Ravenloft', 'Ravenloft: The Horrors Within'],
  confidence: 'documented',
  loreNotes: [
    'Dhampir is a lineage, not a species: a person of any ancestry who was changed. Most keep the name they already had, which is why this entry uses the shared common-tongue registers and says so.',
    'Some adopt a second name marking the change — an original extension, kept optional and never the default.',
    'If you want a dhampir elf or a dhampir dwarf, generate the species name and treat this entry as the overlay.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'kept-name', label: 'The name they already had', weight: 7,
      note: 'The name from before the change, unaltered.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME, after: { kind: 'virtue', set: AFTER_EPITHET } },
      structures: [
        ST('given-family', 8, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
        ST('given-family-after', 3, [S('given', 'given'), S('family', 'family', { label: 'Family' }),
          S('epithet', 'after', { separator: ', ', prefix: 'called ', label: 'Since' })], { minComplexity: 3 }),
      ],
    },
    {
      id: 'taken-name', label: 'A name taken since', weight: 3,
      note: 'A name adopted after the change, often a single word.',
      genderPolicy: 'neutral',
      producers: { after: { kind: 'virtue', set: AFTER_EPITHET }, family: COMMON_SURNAME },
      structures: [
        ST('after-alone', 6, [S('given', 'after', { label: 'Taken name' })]),
        ST('after-family', 4, [S('given', 'after', { label: 'Taken name' }),
          S('family', 'family', { label: 'Family' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a house that has been sealed', 'a town that kept the secret', 'a sanatorium'],
    sp_thing: ['the name they used before', 'a schedule they keep absolutely rigidly'],
    sp_trait: ['is meticulous about not being hungry in company', 'avoids mirrors for reasons of taste, not magic'],
  },
};

// ---------------------------------------------------------------------------
// HEXBLOOD
// ---------------------------------------------------------------------------

const HAG_NAME: CompoundSet = {
  first: blend(retag(UNDERGROWTH, 'wild'), retag(COLOURS, 'colour'), retag(SMALL_NUMBERS, 'count'),
    w('wild', 'crow', 'ash', 'bog', 'crook', 'spindle', 'tooth', 'wither', 'rattle', 'nettle', 'pennyroyal',
      'hemlock', 'knuckle', 'kettle', 'tallow', 'cinder', 'adder', 'bellows', 'bramblewood', 'candlewick',
      'chalk', 'copperkettle', 'crookback', 'elderflower', 'fenwater', 'foxglove', 'gallowsroot', 'gorse',
      'hagstone', 'hearthash', 'henbane', 'ivywood', 'juniper', 'larkspur', 'mandrake', 'marrowbone',
      'mosswater', 'nightsoil', 'owlfeather', 'quickthorn', 'ragwort', 'rookwood', 'sallowbark', 'sloe',
      'spiderwort', 'tansy', 'thistledown', 'toadflax', 'wormwood', 'yarrowroot', 'bellwort', 'birdlime',
      'bittercress', 'blackthorn', 'bonemeal', 'briarpatch', 'cobweb', 'coltsfoot', 'crowstep', 'deadnettle',
      'dogrose', 'duckweed', 'eggshell', 'fingerbone', 'frostbite', 'glasswort', 'goosefoot', 'greenfinch',
      'hareshead', 'hawkbit', 'hedgerow', 'hornbeam', 'inkcap', 'kingcup', 'knotgrass', 'lichenstone',
      'loosestrife', 'milkthistle', 'moonwort', 'nettlebed', 'oxlip', 'pigweed', 'rushlight', 'saltpetre',
      'sedgewater', 'silverweed', 'sorrelroot', 'spurge', 'stonecrop', 'sundew', 'swallowwort', 'teasel',
      'thornapple', 'toadstone', 'vervain', 'waterpepper', 'willowherb', 'winterbloom', 'woodruff')),
  second: lower(w('tail', 'daughter', 'child', 'kept', 'given', 'traded', 'borrowed', 'promised', 'counted',
    'marked', 'bidden', 'spoken', 'found', 'wanted', 'owed', 'lent', 'named', 'unnamed', 'sworn', 'bought',
    'pledged', 'wagered', 'fostered', 'returned', 'remembered', 'forgotten', 'swapped', 'held', 'loosed',
    'bound', 'tallied', 'witnessed', 'chosen', 'refused', 'spared', 'sent', 'sought', 'minded')),
  avoidSharedTags: ['wild', 'colour'],
  casing: 'hyphenated',
};

export const HEXBLOOD: SpeciesSpec = {
  id: 'hexblood', name: 'Hexblood (lineage)', tier: 'expanded', group: LINEAGE_GROUP,
  sources: ['Van Richten’s Guide to Ravenloft', 'Ravenloft: The Horrors Within'],
  confidence: 'partial',
  loreNotes: [
    'Hexblood is a lineage: someone a hag took and changed. The original name usually survives, so the common-tongue registers apply.',
    'Hags deal in names, and a hexblood frequently carries one the hag gave them. The hag-given compound here is an original construction built on the documented bargain-and-naming theme.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'kept', label: 'The name from before', weight: 5,
      note: 'The name they had before the hag took them.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME, hag: { kind: 'compound', set: HAG_NAME } },
      structures: [
        ST('given-family', 7, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-hag', 4, [S('given', 'given'), S('epithet', 'hag', { separator: ', ', prefix: 'called ', label: 'Hag-name' })],
          { minComplexity: 2 }),
        ST('given-alone', 2, [S('given', 'given')]),
      ],
    },
    {
      id: 'hag-given', label: 'The name the hag gave', weight: 4,
      note: 'The name used in the bargain, which has a way of sticking.',
      genderPolicy: 'neutral',
      producers: { hag: { kind: 'compound', set: HAG_NAME }, given: COMMON_GIVEN },
      structures: [
        ST('hag-alone', 6, [S('given', 'hag', { label: 'Hag-name' })]),
        ST('hag-given', 3, [S('given', 'hag', { label: 'Hag-name' }),
          S('nickname', 'given', { prefix: '“', suffix: '”', label: 'Was' })], { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a cottage at the edge of a wood', 'a coven’s hearth', 'a village that gave someone up'],
    sp_thing: ['a bargain with one clause outstanding', 'a lock of hair that is not theirs'],
    sp_trait: ['keeps every promise exactly and no further', 'refuses to tell anyone their birth name'],
  },
};

// ---------------------------------------------------------------------------
// REBORN
// ---------------------------------------------------------------------------

const REBORN_FRAGMENT: VirtueSet = {
  concepts: w('fragment', 'Remnant', 'Interval', 'Fragment', 'Residue', 'Echo', 'Afterward', 'Return', 'Second',
    'Latter', 'Revenant', 'Record', 'Index', 'Trace', 'Vestige', 'Continuance'),
  qualifiers: w('ordinal', 'Second', 'Third', 'Later', 'Other', 'Returned', 'Recovered', 'Partial', 'Unfinished'),
  qualifierChance: { 1: 0.15, 2: 0.25, 3: 0.35, 4: 0.45, 5: 0.55 },
  casing: 'spaced',
};

export const REBORN: SpeciesSpec = {
  id: 'reborn', name: 'Reborn (lineage)', tier: 'expanded', group: LINEAGE_GROUP,
  sources: ['Van Richten’s Guide to Ravenloft', 'Ravenloft: The Horrors Within'],
  confidence: 'partial',
  loreNotes: [
    'Reborn is a lineage: someone who died and came back, carrying fragments of a former life. The published material makes memory loss central.',
    'This entry supports three cases that follow from that: a recovered full name, a partial name with the rest missing, and a name found on an object. The partial-name structures are an original construction.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'recovered', label: 'A name they recovered', weight: 5,
      note: 'The name from the first life, remembered or reconstructed.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: false },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME },
      structures: [
        ST('given-family', 7, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 4, [S('given', 'given')], { note: 'Only the first name came back.' }),
      ],
    },
    {
      id: 'partial', label: 'Only part of a name', weight: 4,
      note: 'A fragment of the old name, with the rest missing.',
      genderPolicy: 'neutral',
      producers: {
        given: COMMON_GIVEN,
        family: COMMON_SURNAME,
        fragment: { kind: 'virtue', set: REBORN_FRAGMENT },
      },
      structures: [
        ST('family-only', 4, [S('given', 'family', { label: 'Surname only' })],
          { note: 'The family name survived; the personal name did not.' }),
        ST('given-fragment', 4, [S('given', 'given'),
          S('epithet', 'fragment', { separator: ', ', prefix: 'the ', label: 'Called' })], { minComplexity: 2 }),
        ST('fragment-alone', 3, [S('given', 'fragment', { label: 'Called' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a grave with their name on it', 'a house that has been relet', 'a parish register'],
    sp_thing: ['a signature they can reproduce and do not recognise',
      'a locket with a face in it', 'an engraved tool with half a name'],
    sp_trait: ['remembers a skill but not learning it', 'is calm about things that frighten everyone else'],
  },
};

export const LINEAGES_SPECIES: SpeciesSpec[] = [HALF_ORC, DUERGAR, DEEP_GNOME, DHAMPIR, HEXBLOOD, REBORN];
