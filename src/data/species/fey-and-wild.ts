/**
 * Fey-touched and wilderness peoples.
 */

import type { CompoundSet, Phonology, PhraseSet, SpeciesSpec } from '../../types/index.ts';
import {
  AGENTS, BEARING, BIRDS, COLOURS, HARVEST, HIGHLAND, LIGHT, LOWLAND, TREES, UNDERGROWTH, WATER, WEATHER,
  blend, lower, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { ELF_PHON } from './core.ts';
import { LONG, MEDIUM, S, SHORT, ST, TERSE } from './_helpers.ts';

const FEY_GROUP = 'Expanded — Fey and wilderness';

// ===========================================================================
// FAIRY
// ===========================================================================

const FAIRY_PHON: Phonology = {
  initialOnsets: [['b', 3], ['bl', 2], ['br', 2], ['f', 3], ['fl', 3], ['g', 2], ['gl', 2], ['h', 3], ['l', 3],
    ['m', 3], ['n', 3], ['p', 3], ['pl', 2], ['r', 2], ['s', 3], ['sp', 2], ['t', 3], ['tr', 2], ['th', 2],
    ['tw', 2], ['v', 2], ['w', 3], ['wh', 2], ['y', 2], ['z', 1], ['sh', 2], ['kl', 1]],
  onsets: [['b', 2], ['l', 5], ['m', 4], ['n', 4], ['p', 3], ['r', 4], ['s', 3], ['t', 3], ['v', 2], ['w', 2],
    ['th', 2], ['f', 2], ['d', 2], ['ll', 2], ['tt', 1], ['nn', 1]],
  nuclei: [['i', 8], ['e', 7], ['a', 6], ['o', 4], ['y', 3], ['ee', 3], ['ia', 2], ['ie', 2], ['u', 2], ['ai', 1]],
  codas: [['l', 4], ['n', 4], ['p', 2], ['t', 3], ['sh', 2], ['ll', 3], ['r', 2], ['m', 2], ['ck', 2], ['ss', 1]],
  finalCodas: [['l', 4], ['n', 4], ['t', 2], ['ll', 3], ['sh', 2], ['p', 2], ['m', 1]],
  patterns: [['CV', 8], ['CVK', 4], ['V', 1]],
  finalPatterns: [['CV', 6], ['CVK', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['in', 3], ['el', 2], ['ip', 2], ['ow', 2], ['it', 2], ['an', 2]],
    feminine: [['a', 3], ['ie', 3], ['ella', 2], ['wyn', 2], ['il', 2], ['een', 1]],
    neutral: [['ip', 3], ['el', 3], ['y', 3], ['in', 2], ['ow', 2], ['et', 2]],
  },
  maxLength: 11,
};

const FAIRY_SEEMING: CompoundSet = {
  first: blend(retag(UNDERGROWTH, 'wild'), retag(WEATHER, 'sky'), retag(LIGHT, 'sky'), retag(HARVEST, 'crop'),
    w('wild', 'dew', 'spindle', 'cobweb', 'pollen', 'hazel', 'catkin', 'toadstool', 'puddle', 'kindling')),
  second: lower(w('tail', 'glimmer', 'whirl', 'tumble', 'flit', 'skip', 'hush', 'prank', 'whisper', 'tangle',
    'patter', 'bobble', 'twirl', 'drizzle', 'mischief', 'knot', 'wink', 'lilt', 'scurry', 'dapple')),
  avoidSharedTags: ['wild', 'sky', 'crop'],
  casing: 'fused',
};

export const FAIRY: SpeciesSpec = {
  id: 'fairy', name: 'Fairy', tier: 'expanded', group: FEY_GROUP,
  sources: ['Monsters of the Multiverse', 'The Wild Beyond the Witchlight'],
  confidence: 'original',
  loreNotes: [
    'No fairy name table has been published. Monsters of the Multiverse describes fairies as native to the Feywild and as varied as the fey themselves, and leaves naming open.',
    'This entry is therefore an original naming grammar: light, quick, open syllables, with a transparent "seeming" name of the kind fey are described as using with outsiders.',
    'Fairies in published material guard their true names, which is the basis for the structure that gives a seeming name only.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'seeming', label: 'True name and seeming', weight: 10,
      note: 'A light personal name, often paired with the name they let others use.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: FAIRY_PHON, syllables: SHORT },
        seeming: { kind: 'compound', set: FAIRY_SEEMING },
      },
      structures: [
        ST('given-seeming', 7, [S('given', 'given'), S('nickname', 'seeming', { label: 'Seeming' })]),
        ST('given-alone', 6, [S('given', 'given')]),
        ST('seeming-alone', 3, [S('given', 'seeming', { label: 'Seeming' })],
          { note: 'The name a fairy gives strangers, which is not their real one.' }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a hedge that is also a border', 'a mushroom ring', 'a carnival', 'a garden that is bigger inside'],
    sp_thing: ['a name they will not say aloud', 'a debt of hospitality', 'a gift that must be returned threefold'],
    sp_trait: ['is physically unable to break a promise and extremely careful about wording',
      'forgets how long mortals live'],
  },
};

// ===========================================================================
// HARENGON
// ===========================================================================

const HARENGON_PHRASE: PhraseSet = {
  templates: [
    ['{adj} {noun}', 2],
    ['{noun} of the {place}', 2],
    ['{adj} {noun} of the {place}', 9],
    ['{adj} {noun} in the {place}', 6],
    ['{number} {noun2} of the {place}', 3],
    ['{adj} {adj2} {noun}', 5],
    ['{adj} {noun} Past the {place}', 4],
  ],
  lexicon: {
    adj: ['Quick', 'Long', 'Early', 'Late', 'Lucky', 'Sudden', 'Sideways', 'Twice', 'Lightfoot', 'Soft',
      'Bright', 'Keen', 'Bramble', 'Restless', 'Dusty', 'Dawn', 'Gentle', 'Wary', 'Nimble', 'Sprightly',
      'Headlong', 'Downhill', 'Uphill', 'Crosswise', 'Backward', 'Forward', 'Half', 'Double', 'Spare',
      'Honest', 'Sly', 'Merry', 'Wayward', 'Homeward', 'Outward', 'Idle', 'Eager', 'Tireless', 'Patient',
      'Breathless', 'Windward', 'Morning', 'Midnight', 'Harvest', 'Frostbitten', 'Sunstruck', 'Wet'],
    adj2: ['Little', 'Great', 'Lesser', 'Second', 'Third', 'Odd', 'Spare', 'Young', 'Old', 'New', 'Good',
      'Far', 'Near', 'Plain', 'Fair'],
    noun: ['Hop', 'Dash', 'Bound', 'Leap', 'Whisker', 'Ear', 'Paw', 'Thump', 'Sprint', 'Flick', 'Scamper',
      'Lope', 'Vault', 'Dart', 'Skip', 'Nibble', 'Burrow', 'Clover', 'Thistle', 'Moonrise', 'Gallop',
      'Scurry', 'Twitch', 'Pounce', 'Spring', 'Caper', 'Bramble', 'Sorrel', 'Vetch', 'Chicory', 'Mallow',
      'Dandelion', 'Milestone', 'Signpost', 'Stile', 'Gatepost', 'Lantern', 'Kettle', 'Bundle', 'Ribbon',
      'Whistle', 'Puddle', 'Shadow', 'Breeze', 'Dewfall', 'Mist', 'Thunder', 'Starlight', 'Hollyhock'],
    noun2: ['Fields', 'Furrows', 'Hedges', 'Mornings', 'Carrots', 'Milestones', 'Whiskers', 'Brambles',
      'Puddles', 'Fences', 'Lanterns', 'Thistles', 'Gates', 'Stiles', 'Bridges', 'Crossings', 'Winters',
      'Summers', 'Harvests', 'Bells'],
    place: ['Hedgerow', 'Long Field', 'Barley', 'Clover', 'Dawn Meadow', 'Low Road', 'Thicket', 'Green Verge',
      'Furrow', 'Warren', 'Tall Grass', 'Orchard Wall', 'Beanrows', 'Coppice', 'Millrace', 'Water Meadow',
      'Drove Road', 'Stubble', 'Ditchback', 'Stone Wall', 'Turnip Field', 'Common', 'Lower Paddock',
      'Old Fence', 'Rye', 'Bracken', 'Gorse', 'Spinney', 'Sheepwalk', 'Byway'],
    number: ['Three', 'Four', 'Five', 'Seven', 'Nine', 'Two', 'Six', 'Eleven', 'Twelve'],
  },
  shortFrom: ['noun', 'adj'],
};

export const HARENGON: SpeciesSpec = {
  id: 'harengon', name: 'Harengon', tier: 'expanded', group: FEY_GROUP,
  sources: ['Monsters of the Multiverse', 'The Wild Beyond the Witchlight'],
  confidence: 'original',
  loreNotes: [
    'No harengon name table has been published; the sourcebooks establish them as fey rabbitfolk who travel constantly and value luck and freedom.',
    'This entry is an original descriptive-phrase grammar built on those described values. It is marked original rather than presented as lore.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'descriptive', label: 'Descriptive name', weight: 10,
      note: 'A short descriptive name of the road and the field.',
      genderPolicy: 'neutral',
      producers: { phrase: { kind: 'phrase', set: HARENGON_PHRASE } },
      structures: [
        ST('phrase', 9, [S('given', 'phrase', { label: 'Name' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a hedgerow road', 'a travelling fair', 'a warren under a hill', 'a crossroads with four inns'],
    sp_thing: ['a lucky token that has definitely worked at least once', 'a route map made of landmarks'],
    sp_trait: ['cannot sit still through a conversation', 'hears the thing nobody else heard'],
  },
};

// ===========================================================================
// SATYR
// ===========================================================================

const SATYR_PHON: Phonology = {
  initialOnsets: [['p', 4], ['t', 3], ['k', 3], ['th', 3], ['ph', 3], ['d', 3], ['g', 2], ['l', 3], ['m', 3],
    ['n', 3], ['r', 2], ['s', 3], ['z', 2], ['x', 2], ['ch', 2], ['b', 3], ['kl', 1], ['pr', 2], ['tr', 2],
    ['e', 1], ['a', 1], ['o', 1], ['h', 2]],
  onsets: [['l', 4], ['m', 3], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['k', 3], ['th', 2], ['d', 3], ['ph', 2],
    ['b', 2], ['x', 1], ['z', 1], ['nth', 1]],
  nuclei: [['a', 8], ['o', 7], ['e', 6], ['i', 5], ['u', 3], ['io', 2], ['ea', 1], ['au', 1]],
  codas: [['s', 4], ['n', 4], ['r', 3], ['l', 3], ['x', 2], ['th', 2], ['m', 2], ['ks', 1]],
  finalCodas: [['s', 5], ['n', 4], ['r', 3], ['x', 2], ['l', 2], ['th', 2]],
  patterns: [['CV', 7], ['CVK', 4], ['V', 1]],
  finalPatterns: [['CVK', 5], ['CV', 5]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['os', 3], ['on', 2], ['es', 2], ['as', 2], ['ios', 1], ['ax', 2]],
    feminine: [['a', 4], ['e', 3], ['ia', 2], ['ine', 2], ['oe', 1], ['is', 2]],
    neutral: [['is', 3], ['os', 2], ['ex', 2], ['an', 2], ['on', 2]],
  },
  maxLength: 12,
};

const SATYR_REPUTATION: CompoundSet = {
  first: blend(retag(BEARING, 'q'),
    w('q', 'thrice', 'twice', 'half', 'never', 'always', 'late', 'early', 'unpaid', 'unasked', 'uninvited',
      'last', 'loud', 'sweet', 'sour')),
  second: lower(w('tail', 'toasted', 'invited', 'forgiven', 'returned', 'remembered', 'thirsty', 'tuned',
    'danced', 'sung', 'wagered', 'promised', 'bargained', 'welcome', 'pardoned')),
  avoidSharedTags: ['q'],
  casing: 'hyphenated',
};

export const SATYR: SpeciesSpec = {
  id: 'satyr', name: 'Satyr', tier: 'expanded', group: FEY_GROUP,
  sources: ['Monsters of the Multiverse', 'Mythic Odysseys of Theros'],
  confidence: 'partial',
  loreNotes: [
    'Satyr names published for Theros sit against a Hellenic backdrop; satyrs are fey in Monsters of the Multiverse and keep that sound.',
    'Satyrs accumulate reputations rather than surnames, and the earned second name reflects something they are known for.',
    'The reputation vocabulary here is original. It avoids reducing satyrs to a single appetite — being thrice-forgiven is as satyr as being thirsty.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'reputation', label: 'Name and reputation', weight: 10,
      note: 'A personal name with whatever a satyr is currently known for.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: SATYR_PHON, syllables: MEDIUM },
        reputation: { kind: 'compound', set: SATYR_REPUTATION },
      },
      structures: [
        ST('given-reputation', 7, [S('given', 'given'),
          S('epithet', 'reputation', { prefix: 'the ', label: 'Known as' })]),
        ST('given-alone', 6, [S('given', 'given')]),
        ST('given-reputation-plain', 2.5, [S('given', 'given'),
          S('nickname', 'reputation', { label: 'Known as' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a revel that has lasted longer than planned', 'a vineyard', 'a theatre', 'a mountain road'],
    sp_thing: ['a tab nobody has settled', 'an instrument with a disputed owner', 'an invitation they regret accepting'],
    sp_trait: ['is a far better listener than anyone expects', 'turns every arrangement into a wager'],
  },
};

// ===========================================================================
// CENTAUR
// ===========================================================================

const CENTAUR_PHON: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['g', 2], ['h', 3], ['k', 3], ['kh', 2], ['l', 3], ['m', 3], ['n', 3],
    ['p', 3], ['r', 3], ['s', 3], ['t', 3], ['th', 3], ['v', 2], ['z', 2], ['ch', 2], ['pr', 2], ['tr', 2],
    ['kr', 2], ['br', 1], ['a', 1], ['e', 1]],
  onsets: [['d', 3], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['th', 3], ['v', 2],
    ['ph', 2], ['b', 2], ['g', 2], ['z', 1]],
  nuclei: [['a', 9], ['o', 6], ['e', 6], ['i', 5], ['u', 3], ['ai', 2], ['ea', 1], ['au', 1]],
  codas: [['n', 5], ['s', 4], ['r', 4], ['l', 3], ['th', 3], ['m', 2], ['ss', 1], ['nd', 1]],
  finalCodas: [['n', 5], ['s', 4], ['r', 4], ['th', 2], ['l', 2], ['m', 2]],
  patterns: [['CV', 7], ['CVK', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['os', 3], ['on', 3], ['ar', 2], ['es', 2], ['an', 2], ['ios', 1]],
    feminine: [['a', 4], ['ia', 3], ['e', 2], ['ara', 2], ['ine', 2], ['ora', 1]],
    neutral: [['is', 3], ['on', 2], ['ar', 2], ['en', 2], ['os', 2]],
  },
  maxLength: 12,
};

const CENTAUR_BAND: CompoundSet = {
  first: blend(retag(LOWLAND, 'land'), retag(HIGHLAND, 'land'), retag(WATER, 'land'), retag(WEATHER, 'sky'),
    w('land', 'long', 'far', 'open', 'wide', 'tall', 'dry', 'green', 'first', 'old')),
  second: lower(w('tail', 'band', 'run', 'grass', 'range', 'ford', 'crossing', 'herd', 'trail', 'circuit',
    'pasture', 'ride', 'watch', 'camp', 'gather')),
  avoidSharedTags: ['land', 'sky'],
  casing: 'spaced',
};

export const CENTAUR: SpeciesSpec = {
  id: 'centaur', name: 'Centaur', tier: 'expanded', group: FEY_GROUP,
  sources: ['Monsters of the Multiverse', 'Guildmasters’ Guide to Ravnica', 'Mythic Odysseys of Theros'],
  confidence: 'partial',
  loreNotes: [
    'Centaur names in published settings have a Hellenic colouring, and centaurs identify by band or herd rather than by inherited family.',
    'Monsters of the Multiverse makes centaurs fey; the band structure survives across both treatments.',
    'The band vocabulary here is original; the structure follows the published settings.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'band', label: 'Personal name and band', weight: 10,
      note: 'A personal name with the band a centaur rides with.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: CENTAUR_PHON, syllables: MEDIUM },
        band: { kind: 'compound', set: CENTAUR_BAND },
      },
      structures: [
        ST('given-band', 8, [S('given', 'given'), S('clan', 'band', { prefix: 'of the ', label: 'Band' })]),
        ST('given-alone', 4, [S('given', 'given')]),
        ST('given-band-plain', 2.5, [S('given', 'given'), S('clan', 'band', { label: 'Band' })],
          { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a grazing circuit', 'a seasonal gathering', 'a river ford', 'a town built across their range'],
    sp_thing: ['a route the band has used for generations', 'an agreement with a settlement that is being ignored'],
    sp_trait: ['finds indoor ceilings a daily insult', 'measures a journey by how the ground changes'],
  },
};

// ===========================================================================
// FIRBOLG
// ===========================================================================

const FIRBOLG_DESCRIPTIVE: PhraseSet = {
  templates: [
    ['{adj} {noun}', 2],
    ['{noun} of the {place}', 2],
    ['{adj} {noun} Who {verb}', 5],
    ['{adj} {noun} of the {place}', 8],
    ['{noun} of the {place} Who {verb}', 3],
  ],
  lexicon: {
    adj: ['Quiet', 'Slow', 'Kind', 'Tall', 'Grey', 'Mossy', 'Patient', 'Low', 'Still', 'Soft', 'Long',
      'Deep', 'Watchful', 'Unhurried', 'Mild', 'Broad', 'Weathered', 'Lichened', 'Shaded', 'Steady',
      'Gentle', 'Heavy', 'Older', 'Wintered', 'Rain-Worn', 'Half-Seen', 'Seldom-Seen', 'Dry', 'Green',
      'Clouded', 'Careful', 'Sparing', 'Thoughtful', 'Early', 'Late', 'Far'],
    noun: ['Alder', 'Rowan', 'Birch', 'Moss', 'Stone', 'Spring', 'Hollow', 'Thicket', 'Fern', 'Bramble',
      'Shepherd', 'Keeper', 'Warden', 'Walker', 'Brook', 'Cairn', 'Hearth', 'Lichen', 'Boulder', 'Heron',
      'Willow', 'Hazel', 'Yew', 'Elder', 'Sedge', 'Rushes', 'Hollybush', 'Beech', 'Larch', 'Juniper',
      'Mire', 'Tarn', 'Ford', 'Wellhead', 'Fencepost', 'Gatepost', 'Thorn', 'Bracken', 'Drystone',
      'Watcher', 'Mender', 'Counter', 'Gatherer', 'Listener', 'Tender'],
    place: ['Old Wood', 'High Fell', 'Spring Valley', 'Long Moor', 'Hidden Dell', 'Grey Marsh', 'Elder Grove',
      'Deep Hollow', 'Fogged Hill', 'Still Pool', 'Low Beck', 'Far Coppice', 'Rowan Stand', 'Birch Scrub',
      'Wet Meadow', 'Hanging Wood', 'Slow River', 'Thorn Brake', 'Alder Carr', 'Clouded Ridge', 'Lost Ford',
      'Moss Shelf', 'Quiet Vale', 'Old Boundary', 'Winter Pasture', 'Broken Wall', 'Hollow Way'],
    verb: ['Waits', 'Listens', 'Counts the Trees', 'Mends Fences', 'Keeps the Spring', 'Says Little',
      'Walks at Night', 'Tends the Gap', 'Remembers Winters', 'Moves the Stones', 'Feeds the Birds',
      'Shuts the Gate', 'Watches the Ford', 'Plants in Autumn', 'Clears the Path', 'Knows the Weather',
      'Keeps the Boundary', 'Counts the Lambs', 'Minds the Hedge', 'Waters the Orchard'],
  },
  shortFrom: ['noun', 'adj'],
};

export const FIRBOLG: SpeciesSpec = {
  id: 'firbolg', name: 'Firbolg', tier: 'expanded', group: FEY_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'Firbolgs traditionally do not name things, including themselves; a firbolg among their own people is simply referred to by what they are.',
    'When dealing with others, firbolgs adopt a descriptive name in Common, or borrow a name from a neighbouring people — most often an elven one.',
    'That is why this entry offers a descriptive phrase tradition and an adopted-name tradition rather than a firbolg "language" that does not exist.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'descriptive', label: 'Descriptive name in Common', weight: 7,
      note: 'A plain description used as a name when dealing with others.',
      genderPolicy: 'neutral',
      producers: { phrase: { kind: 'phrase', set: FIRBOLG_DESCRIPTIVE } },
      structures: [ST('phrase', 9, [S('given', 'phrase', { label: 'Name' })])],
    },
    {
      id: 'adopted', label: 'A borrowed name', weight: 4,
      note: 'A name taken from a neighbouring people, usually elven.',
      genderPolicy: 'mixed',
      producers: {
        elvish: { kind: 'phonetic', phonology: ELF_PHON, syllables: MEDIUM },
        common: COMMON_GIVEN,
        surname: COMMON_SURNAME,
      },
      structures: [
        ST('elvish-alone', 6, [S('given', 'elvish', { label: 'Borrowed name' })]),
        ST('common-surname', 3, [S('given', 'common'), S('family', 'surname', { label: 'Family' })],
          { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a wood nobody logs', 'a spring that has never failed', 'a village that does not know they watch it'],
    sp_thing: ['a boundary they maintain without being asked', 'a seed stock kept for a bad year'],
    sp_trait: ['disappears from a conversation mid-sentence and literally', 'apologises to objects'],
  },
};

// ===========================================================================
// OWLIN
// ===========================================================================

const OWLIN_PHON: Phonology = {
  initialOnsets: [['h', 4], ['hw', 2], ['w', 3], ['m', 3], ['n', 3], ['l', 3], ['r', 2], ['s', 3], ['sh', 2],
    ['t', 3], ['th', 3], ['v', 2], ['f', 2], ['b', 2], ['d', 2], ['k', 2], ['y', 2], ['o', 1], ['u', 1], ['e', 1]],
  onsets: [['h', 3], ['l', 4], ['m', 4], ['n', 4], ['r', 3], ['s', 3], ['th', 3], ['v', 2], ['w', 3], ['f', 2],
    ['d', 2], ['b', 2], ['ll', 1]],
  nuclei: [['oo', 7], ['u', 6], ['o', 6], ['i', 5], ['e', 4], ['a', 4], ['oe', 2], ['ou', 2]],
  codas: [['l', 4], ['n', 5], ['r', 3], ['th', 3], ['m', 3], ['sh', 2], ['ll', 2], ['w', 1]],
  finalCodas: [['n', 5], ['l', 4], ['r', 3], ['th', 3], ['m', 2], ['sh', 2]],
  patterns: [['CV', 7], ['CVK', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['oo', 2], ['un', 2], ['oth', 2], ['ir', 2], ['ol', 2]],
    feminine: [['a', 3], ['oo', 2], ['ina', 2], ['ell', 2], ['owen', 1]],
    neutral: [['oo', 3], ['en', 2], ['ith', 2], ['ul', 2], ['ow', 2]],
  },
  maxLength: 12,
};

const OWLIN_NIGHT: CompoundSet = {
  first: blend(retag(LIGHT, 'sky'), retag(TREES, 'wood'), retag(COLOURS, 'colour'),
    w('night', 'night', 'owl', 'hush', 'small-hours', 'lamplight', 'rafter', 'belfry', 'attic', 'gable', 'eaves')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'wing', 'glide', 'hush', 'call', 'vigil', 'roost', 'hour', 'study', 'lamp', 'page'))),
  avoidSharedTags: ['sky', 'wood', 'colour', 'night'],
  casing: 'fused',
};

export const OWLIN: SpeciesSpec = {
  id: 'owlin', name: 'Owlin', tier: 'expanded', group: FEY_GROUP,
  sources: ['Strixhaven: A Curriculum of Chaos'],
  confidence: 'original',
  loreNotes: [
    'Strixhaven publishes no owlin name table; owlin are presented as a scholarly, nocturnal people descended from owls.',
    'This is therefore an original naming grammar — soft, rounded, breathy sounds, with a transparent night-and-study compound used as a family name. It is marked original, not presented as lore.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'roost', label: 'Name and roost', weight: 10,
      note: 'A soft personal name with the roost or household a owlin belongs to.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: OWLIN_PHON, syllables: MEDIUM },
        roost: { kind: 'compound', set: OWLIN_NIGHT },
      },
      structures: [
        ST('given-roost', 8, [S('given', 'given'), S('family', 'roost', { label: 'Roost' })]),
        ST('given-alone', 4, [S('given', 'given')]),
        ST('given-of-roost', 2, [S('given', 'given'), S('family', 'roost', { prefix: 'of ', label: 'Roost' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a university library at three in the morning', 'a belfry', 'a lecture nobody attends',
      'a rooftop route across a campus'],
    sp_thing: ['a thesis in progress', 'a borrowed book twelve years overdue'],
    sp_trait: ['keeps hours that make collaboration difficult', 'can hear a whispered conversation across a hall'],
  },
};

// ===========================================================================
// KENDER
// ===========================================================================

const KENDER_PHON: Phonology = {
  initialOnsets: [['b', 3], ['br', 2], ['d', 3], ['f', 3], ['fl', 2], ['g', 2], ['gl', 2], ['h', 3], ['k', 3],
    ['kr', 2], ['l', 3], ['m', 3], ['n', 3], ['p', 3], ['r', 2], ['s', 3], ['sk', 2], ['t', 4], ['tr', 2],
    ['th', 2], ['w', 2], ['z', 1], ['j', 2], ['kl', 1]],
  onsets: [['b', 2], ['d', 3], ['l', 5], ['m', 4], ['n', 4], ['p', 3], ['r', 3], ['s', 4], ['t', 4], ['f', 2],
    ['k', 2], ['v', 2], ['ll', 2], ['ss', 1], ['nn', 1]],
  nuclei: [['a', 7], ['e', 7], ['i', 7], ['o', 6], ['u', 4], ['ee', 2], ['oo', 2], ['ia', 1]],
  initialNuclei: [['a', 7], ['e', 7], ['i', 6], ['o', 6], ['u', 4]],
  codas: [['l', 4], ['n', 4], ['s', 3], ['t', 3], ['m', 3], ['r', 3], ['ck', 2], ['ff', 1], ['ss', 2], ['p', 2]],
  finalCodas: [['l', 4], ['n', 4], ['s', 3], ['t', 3], ['m', 2], ['ff', 2], ['p', 1]],
  patterns: [['CV', 6], ['CVK', 5]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['off', 2], ['in', 3], ['us', 2], ['o', 3], ['ard', 1], ['em', 2]],
    feminine: [['a', 4], ['ia', 2], ['ie', 3], ['ina', 2], ['ella', 2]],
    neutral: [['o', 3], ['in', 3], ['el', 2], ['y', 3], ['is', 2]],
  },
  maxLength: 13,
};

const KENDER_FAMILY: CompoundSet = {
  first: blend(retag(UNDERGROWTH, 'wild'), retag(BIRDS, 'beast'), retag(HARVEST, 'crop'),
    w('q', 'burr', 'thistle', 'tangle', 'quick', 'merry', 'wander', 'lost', 'found', 'spare', 'borrow',
      'pocket', 'topple', 'rattle', 'whistle', 'hop')),
  second: lower(w('tail', 'foot', 'knott', 'bottom', 'tumble', 'kettle', 'pocket', 'latch', 'stride', 'hollow',
    'wander', 'bough', 'topple', 'basket', 'chatter', 'ribbon', 'stump', 'whistle', 'sack')),
  avoidSharedTags: ['wild', 'beast', 'crop', 'q'],
  casing: 'fused',
};

export const KENDER: SpeciesSpec = {
  id: 'kender', name: 'Kender', tier: 'expanded', group: FEY_GROUP,
  sources: ['Dragonlance: Shadow of the Dragon Queen'],
  confidence: 'documented',
  loreNotes: [
    'Kender personal names published for Krynn are long, playful and multi-syllabic, and they carry transparent compound family names.',
    'Kender collect nicknames with enthusiasm, and a kender will often give a different one depending on the day.',
    'The specific vocabulary here is original; the shape follows the published Dragonlance convention.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'kender', label: 'Personal and family name', weight: 10,
      note: 'A long playful personal name with a compound family name.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: KENDER_PHON, syllables: LONG },
        short: { kind: 'phonetic', phonology: KENDER_PHON, syllables: TERSE },
        family: { kind: 'compound', set: KENDER_FAMILY },
      },
      structures: [
        ST('given-family', 8, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-short-family', 3, [S('given', 'given'),
          S('nickname', 'short', { prefix: '“', suffix: '”', label: 'Goes by' }),
          S('family', 'family', { label: 'Family' })], { minComplexity: 3 }),
        ST('short-family', 2.5, [S('given', 'short'), S('family', 'family', { label: 'Family' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a road with more interesting side roads', 'a town they have been asked to leave politely',
      'a fair', 'somewhere they were not supposed to be'],
    sp_thing: ['a pouch of objects with no owner present', 'a map annotated with unrelated adventures',
      'a hoopak'],
    sp_trait: ['finds other people’s possessions and genuinely means to return them',
      'has no functioning sense of danger and excellent instincts'],
  },
};

export const FEY_WILD_SPECIES: SpeciesSpec[] = [FAIRY, HARENGON, SATYR, CENTAUR, FIRBOLG, OWLIN, KENDER];
