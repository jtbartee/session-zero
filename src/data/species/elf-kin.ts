/**
 * Elf lineages published as separate playable options, plus half-elves.
 *
 * These all legitimately share the elven naming culture — that is the lore,
 * not a shortcut — so each one builds on the elf phonology exported from
 * `core.ts` and then adds what is distinctive about it. Where a publication
 * says nothing at all about a lineage's names, the entry says so and the
 * extra material is marked as original.
 */

import type { CompoundSet, Phonology, SpeciesSpec, VirtueSet } from '../../types/index.ts';
import { AGENTS, COLOURS, LIGHT, SEA_LIFE, WATER, WEATHER, blend, lower, m, retag, w } from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { ELF_FAMILY_COMMON, ELF_FAMILY_ELVISH, ELF_PHON } from './core.ts';
import { LONG, MEDIUM, S, ST, TERSE } from './_helpers.ts';

const ELF_GROUP = 'Expanded — Elf lineages';

// ---------------------------------------------------------------------------
// ELADRIN
// ---------------------------------------------------------------------------

const SEASON_EPITHET: VirtueSet = {
  concepts: [
    m('Spring', 'spring', ['season']), m('Summer', 'summer', ['season']),
    m('Autumn', 'autumn', ['season']), m('Winter', 'winter', ['season']),
  ],
  qualifiers: w('qualifier', 'Early', 'Late', 'High', 'First', 'Last', 'Second', 'Long', 'Sudden', 'Turning'),
  qualifierChance: { 1: 0.2, 2: 0.3, 3: 0.4, 4: 0.5, 5: 0.6 },
  casing: 'spaced',
};

const ELADRIN_FAMILY: CompoundSet = {
  first: blend(
    w('season', 'spring', 'summer', 'autumn', 'winter', 'thaw', 'frost', 'bloom', 'harvest', 'equinox', 'solstice'),
    retag(LIGHT, 'sky'), retag(WEATHER, 'sky'),
  ),
  second: lower(w('tail', 'turning', 'wending', 'gathering', 'hallow', 'revel', 'crossing', 'threshold', 'keeping',
    'welcome', 'parting', 'laughter', 'quarrel', 'promise', 'bough', 'gate', 'song', 'hush')),
  avoidSharedTags: ['season', 'sky'],
  casing: 'fused',
};

export const ELADRIN: SpeciesSpec = {
  id: 'eladrin', name: 'Eladrin', tier: 'expanded', group: ELF_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'partial',
  loreNotes: [
    'Eladrin are fey elves whose temperament and appearance shift with a season, and published material ties that season to mood rather than to naming.',
    'No separate eladrin name list has been published, so they use elven naming: a chosen adult name plus a family name.',
    'The seasonal epithet here is an original extension that follows the documented season mechanic rather than contradicting it.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'seasonal', label: 'Elven name with a season', weight: 7,
      note: 'The elven naming tradition, with the season an eladrin is currently keeping.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        family: { kind: 'oneOf', options: [
          [{ kind: 'morph', set: ELF_FAMILY_ELVISH }, 4],
          [{ kind: 'compound', set: ELADRIN_FAMILY }, 5],
          [{ kind: 'compound', set: ELF_FAMILY_COMMON }, 3],
        ] },
        season: { kind: 'virtue', set: SEASON_EPITHET },
      },
      structures: [
        ST('given-family', 7, [S('given', 'given'), S('family', 'family', { label: 'House' })]),
        ST('given-family-season', 5, [S('given', 'given'), S('family', 'family', { label: 'House' }),
          S('epithet', 'season', { separator: ', ', prefix: 'of the ', label: 'Season' })], { minComplexity: 2 }),
        ST('given-season', 3, [S('given', 'given'),
          S('epithet', 'season', { separator: ', ', prefix: 'of the ', label: 'Season' })]),
        ST('given-alone', 2, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a court that keeps only one season', 'a crossing into the Feywild', 'an orchard out of step with the year'],
    sp_thing: ['a promise made in a different season', 'a gift that must be answered in kind'],
    sp_trait: ['changes with the weather in a very literal sense', 'takes offence and forgets it within the hour'],
  },
};

// ---------------------------------------------------------------------------
// ASTRAL ELF
// ---------------------------------------------------------------------------

const ASTRAL_PHON: Phonology = {
  ...ELF_PHON,
  nuclei: [['a', 7], ['e', 7], ['i', 7], ['o', 4], ['ae', 4], ['ia', 3], ['ea', 2], ['ei', 2], ['y', 2], ['u', 2]],
  endings: {
    masculine: [['iel', 2], ['ar', 3], ['ion', 2], ['as', 2], ['oth', 1], ['ius', 1]],
    feminine: [['ia', 3], ['ae', 2], ['ara', 2], ['essa', 1], ['eth', 2], ['ys', 2]],
    neutral: [['ae', 3], ['is', 2], ['eth', 2], ['il', 2], ['yn', 2]],
  },
};

const ASTRAL_EPOCH: VirtueSet = {
  concepts: [
    ...w('epoch', 'Silence', 'Waking', 'Transit', 'Conjunction', 'Drifting', 'Counting', 'Vigil',
      'Crossing', 'Turning', 'Reckoning', 'Quiet', 'Ascent', 'Dimming', 'Kindling', 'Parting'),
    // Already a phrase: an ordinal in front of these produces nonsense.
    ...w('bare', 'Long Light', 'Still Hour', 'Sleeping Age', 'Quiet War', 'Second Dawn',
      'Unmeasured Years', 'Last Watch', 'Silent Centuries', 'Waking Age'),
  ],
  qualifiers: w('ordinal', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Ninth', 'Eleventh', 'Last'),
  qualifierChance: { 1: 0.45, 2: 0.55, 3: 0.65, 4: 0.75, 5: 0.8 },
  casing: 'spaced',
};

export const ASTRAL_ELF: SpeciesSpec = {
  id: 'astral-elf', name: 'Astral Elf', tier: 'expanded', group: ELF_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'partial',
  loreNotes: [
    'Astral elves have lived for millennia in the Astral Sea, where time does not pass normally; the sourcebook describes that condition but publishes no separate name table.',
    'They use elven naming, which this entry inherits. The epoch reference — the age an astral elf counts themselves from — is an original extension built on the documented timelessness.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'astral', label: 'Elven name with an epoch', weight: 7,
      note: 'An elven name, often given with the age the astral elf counts from.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: ASTRAL_PHON, syllables: LONG },
        family: { kind: 'morph', set: ELF_FAMILY_ELVISH },
        epoch: { kind: 'virtue', set: ASTRAL_EPOCH },
      },
      structures: [
        ST('given-family', 6, [S('given', 'given'), S('family', 'family', { label: 'House' })]),
        ST('given-family-epoch', 5, [S('given', 'given'), S('family', 'family', { label: 'House' }),
          S('epithet', 'epoch', { separator: ', ', prefix: 'of the ', label: 'Epoch' })], { minComplexity: 2 }),
        ST('given-epoch', 3, [S('given', 'given'),
          S('epithet', 'epoch', { separator: ', ', prefix: 'of the ', label: 'Epoch' })]),
        ST('given-alone', 2, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a silver void', 'a god’s drifting corpse', 'an astral citadel', 'a dock with no water'],
    sp_thing: ['a memory older than the nation they are standing in', 'a calendar that stopped being useful'],
    sp_trait: ['does not notice that a conversation has lasted three days',
      'refers to centuries the way others refer to last week'],
  },
};

// ---------------------------------------------------------------------------
// SEA ELF
// ---------------------------------------------------------------------------

const SEA_ELF_PHON: Phonology = {
  ...ELF_PHON,
  onsets: [['l', 5], ['m', 4], ['n', 5], ['r', 4], ['s', 5], ['sh', 3], ['th', 4], ['v', 4], ['d', 3], ['t', 2],
    ['ll', 2], ['nn', 2], ['f', 2], ['w', 2], ['y', 1], ['z', 1]],
  nuclei: [['a', 7], ['e', 6], ['i', 6], ['o', 5], ['u', 3], ['ae', 3], ['oo', 2], ['ea', 3], ['ua', 2], ['y', 2]],
  codas: [['l', 6], ['n', 5], ['r', 4], ['s', 4], ['th', 3], ['sh', 2], ['m', 2], ['ll', 2]],
  finalCodas: [['l', 6], ['n', 5], ['s', 4], ['th', 3], ['sh', 2], ['r', 3], ['m', 2]],
};

const SEA_ELF_FAMILY: CompoundSet = {
  first: blend(retag(WATER, 'sea'), retag(SEA_LIFE, 'sea'),
    w('sea', 'tide', 'reef', 'trench', 'surf', 'brine', 'shoal', 'current', 'drift', 'fathom', 'wrack'),
    retag(COLOURS, 'colour')),
  second: lower(w('tail', 'singer', 'rider', 'keeper', 'glass', 'bell', 'lantern', 'garden', 'weaver', 'herder',
    'turning', 'whisper', 'green', 'light', 'reach', 'hollow', 'crown', 'thread', 'bloom')),
  avoidSharedTags: ['sea', 'colour'],
  casing: 'fused',
};

export const SEA_ELF: SpeciesSpec = {
  id: 'sea-elf', name: 'Sea Elf', tier: 'expanded', group: ELF_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'partial',
  loreNotes: [
    'Sea elves live in the oceans of the Material Plane and keep elven naming; no separate published name table exists for them.',
    'Their translated family names are built from the sea rather than the forest, which is an original extension consistent with where they live.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'tidal', label: 'Elven name of the deep', weight: 7,
      note: 'Elven naming with family names drawn from the sea.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: SEA_ELF_PHON, syllables: MEDIUM },
        family: { kind: 'oneOf', options: [
          [{ kind: 'compound', set: SEA_ELF_FAMILY }, 6],
          [{ kind: 'morph', set: ELF_FAMILY_ELVISH }, 4],
        ] },
      },
      structures: [
        ST('given-family', 9, [S('given', 'given'), S('family', 'family', { label: 'House' })]),
        ST('given-alone', 3, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a kelp city', 'a wreck field', 'a trench settlement', 'a surface port they distrust'],
    sp_thing: ['a shell that carries a voice', 'a chart of currents that have changed'],
    sp_trait: ['finds dry air genuinely unpleasant', 'measures distance in tides'],
  },
};

// ---------------------------------------------------------------------------
// SHADAR-KAI
// ---------------------------------------------------------------------------

const SHADAR_PHON: Phonology = {
  ...ELF_PHON,
  nuclei: [['a', 6], ['e', 6], ['i', 5], ['o', 6], ['u', 5], ['ae', 2], ['y', 3], ['ei', 2], ['ou', 1]],
  codas: [['l', 4], ['n', 5], ['r', 5], ['th', 4], ['s', 4], ['k', 3], ['sh', 2], ['m', 2], ['st', 1]],
  finalCodas: [['n', 5], ['r', 5], ['th', 4], ['s', 4], ['k', 3], ['l', 3], ['sh', 2]],
  endings: {
    masculine: [['os', 2], ['ar', 2], ['eth', 2], ['ir', 2], ['on', 2], ['ash', 1]],
    feminine: [['a', 3], ['eth', 2], ['is', 2], ['ara', 2], ['ys', 2], ['ine', 1]],
    neutral: [['eth', 3], ['is', 2], ['ar', 2], ['yn', 2], ['ok', 1]],
  },
};

const SHADAR_EPITHET: CompoundSet = {
  first: w('q', 'grey', 'ashen', 'quiet', 'thin', 'last', 'cold', 'still', 'hollow', 'unlit', 'half', 'late',
    'faded', 'narrow', 'dim', 'sparse'),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'hour', 'lamp', 'vigil', 'passage', 'ledger', 'crossing', 'errand', 'mercy', 'thread'))),
  avoidSharedTags: ['q'],
  casing: 'spaced',
};

export const SHADAR_KAI: SpeciesSpec = {
  id: 'shadar-kai', name: 'Shadar-kai', tier: 'expanded', group: ELF_GROUP,
  sources: ['Monsters of the Multiverse', 'Mordenkainen’s Tome of Foes'],
  confidence: 'partial',
  loreNotes: [
    'Shadar-kai are elves shaped by long service in the Shadowfell; published material describes that service but gives no separate name list.',
    'They use elven naming with a drier, greyer sound, and epithets attached to a term of service. Both the phonetic shading and the epithets are original extensions.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'shadowfell', label: 'Elven name of the Shadowfell', weight: 7,
      note: 'Elven naming worn down by the Shadowfell, often with a service epithet.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: SHADAR_PHON, syllables: MEDIUM },
        family: { kind: 'morph', set: ELF_FAMILY_ELVISH },
        epithet: { kind: 'compound', set: SHADAR_EPITHET },
      },
      structures: [
        ST('given-family', 6, [S('given', 'given'), S('family', 'family', { label: 'House' })]),
        ST('given-epithet', 5, [S('given', 'given'),
          S('epithet', 'epithet', { separator: ', ', prefix: 'of the ', label: 'Service' })]),
        ST('given-alone', 4, [S('given', 'given')]),
        ST('given-family-epithet', 2, [S('given', 'given'), S('family', 'family', { label: 'House' }),
          S('epithet', 'epithet', { separator: ', ', prefix: 'of the ', label: 'Service' })], { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a shadow-crossing', 'a fortress at the end of a grey plain', 'a town that forgets visitors'],
    sp_thing: ['a term of service with no stated end', 'a token that keeps them from fading'],
    sp_trait: ['is startlingly alive about small pleasures', 'goes very still when thinking'],
  },
};

// ---------------------------------------------------------------------------
// HALF-ELF
// ---------------------------------------------------------------------------

export const HALF_ELF: SpeciesSpec = {
  id: 'half-elf', name: 'Half-Elf', tier: 'expanded', group: ELF_GROUP,
  sources: ['Player’s Handbook (2014)', 'Basic Rules'],
  confidence: 'documented',
  loreNotes: [
    'Half-elves use either human or elven naming conventions, and a great many use a blend — one name from each side.',
    'The 2024 Player’s Handbook folds mixed heritage into the two parent species rather than printing a separate half-elf entry; this remains a supported legacy option.',
    'Because both parent traditions are documented, this entry draws on both openly rather than inventing a third.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'elven-raised', label: 'Raised among elves', weight: 4,
      note: 'Elven naming: a chosen adult name and an elven family name.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        family: { kind: 'oneOf', options: [
          [{ kind: 'morph', set: ELF_FAMILY_ELVISH }, 6],
          [{ kind: 'compound', set: ELF_FAMILY_COMMON }, 4],
        ] },
      },
      structures: [
        ST('given-family', 9, [S('given', 'given'), S('family', 'family', { label: 'House' })]),
        ST('given-alone', 2.5, [S('given', 'given')]),
      ],
    },
    {
      id: 'human-raised', label: 'Raised among humans', weight: 4,
      note: 'An ordinary name from whichever region they grew up in.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: { given: COMMON_GIVEN, family: COMMON_SURNAME },
      structures: [
        ST('given-family', 9, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 2.5, [S('given', 'given')]),
      ],
    },
    {
      id: 'blended', label: 'A name from each side', weight: 4,
      note: 'One parent’s given name with the other parent’s family name.',
      genderPolicy: 'mixed',
      producers: {
        elvenGiven: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        humanGiven: COMMON_GIVEN,
        elvenFamily: { kind: 'morph', set: ELF_FAMILY_ELVISH },
        humanFamily: COMMON_SURNAME,
        childName: { kind: 'phonetic', phonology: ELF_PHON, syllables: TERSE },
      },
      structures: [
        ST('elven-given-human-family', 5,
          [S('given', 'elvenGiven'), S('family', 'humanFamily', { label: 'Family' })]),
        ST('human-given-elven-family', 5,
          [S('given', 'humanGiven'), S('family', 'elvenFamily', { label: 'House' })]),
        ST('human-given-both', 2,
          [S('given', 'humanGiven'), S('nickname', 'childName', { prefix: '“', suffix: '”', label: 'Elven name' }),
            S('family', 'humanFamily', { label: 'Family' })], { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a town where they were the only one', 'an elven settlement that was polite about it',
      'a border between two peoples who do not mix'],
    sp_thing: ['two sets of family expectations', 'a name they only use with one half of the family'],
    sp_trait: ['is fluent in both and at home in neither', 'notices exactly when a room decides what they are'],
  },
};

export const ELF_KIN_SPECIES: SpeciesSpec[] = [ELADRIN, ASTRAL_ELF, SEA_ELF, SHADAR_KAI, HALF_ELF];
