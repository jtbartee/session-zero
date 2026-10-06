/**
 * Beast-descended peoples.
 *
 * Several of these have the most distinctive naming traditions in the game:
 * Tabaxi descriptive phrases, Kenku names built from mimicked sounds, and
 * Lizardfolk names that are simply Draconic words chosen for their meaning.
 * None of them are served by a prefix-plus-suffix generator, which is why
 * each uses a different architecture.
 */

import type { CompoundSet, MorphSet, Phonology, PhraseSet, SpeciesSpec } from '../../types/index.ts';
import {
  AGENTS, BEARING, COLOURS, SEA_LIFE, STONE, WATER, WEATHER, blend, lower, m, retag, w,
} from '../vocabulary/palette.ts';
import { LONG, MEDIUM, S, ST, TERSE } from './_helpers.ts';

const BEAST_GROUP = 'Expanded — Beast-descended';

// ===========================================================================
// TABAXI — descriptive phrase naming
// ===========================================================================

const TABAXI_PHRASE: PhraseSet = {
  templates: [
    ['{noun} on the {feature}', 6],
    ['{noun} in the {feature}', 4],
    ['{number} {plural}', 5],
    ['{adj} {noun}', 6],
    ['{noun} of {time}', 5],
    ['{noun} Before {time}', 3],
    ['{adj} {noun} on the {feature}', 3],
    ['{colour} {noun}', 4],
    ['{noun} and {noun2}', 3],
    ['{noun} Without {plural}', 2],
    ['{number} {plural} at {time}', 2],
    ['{adj} {noun} of {time}', 2],
    ['{noun} Across the {feature}', 3],
    ['{colour} {noun} on the {feature}', 2],
  ],
  lexicon: {
    noun: ['Cloud', 'Rain', 'Smoke', 'Mirror', 'Jade', 'Feather', 'Obsidian', 'Thunder', 'Shadow', 'Lily',
      'Moth', 'Ash', 'Honey', 'Salt', 'Ember', 'Hummingbird', 'Jaguar', 'Heron', 'Serpent', 'Mountain',
      'River', 'Dusk', 'Rope', 'Drum', 'Lantern', 'Needle', 'Copper', 'Maize', 'Vine', 'Thorn', 'Flint',
      'Star', 'Moon', 'Tide', 'Reed', 'Clay', 'Mist', 'Coal', 'Wind', 'Bell', 'Kite', 'Quill', 'Lace',
      'Cinnabar', 'Turquoise', 'Marigold', 'Cochineal', 'Gourd', 'Hearthstone', 'Quetzal', 'Ocelot',
      'Macaw', 'Iguana', 'Tapir', 'Firefly', 'Cicada', 'Dragonfly', 'Woodsmoke', 'Rainwater', 'Spindle',
      'Comb', 'Basket', 'Pestle', 'Censer', 'Whetstone', 'Anvil', 'Bowstring', 'Fishhook', 'Shutter',
      'Awning', 'Gourdvine', 'Codex', 'Tally', 'Knotcord', 'Hailstone', 'Sleet', 'Frost', 'Pumice'],
    noun2: ['Cloud', 'Rain', 'Smoke', 'Mirror', 'Jade', 'Feather', 'Thunder', 'Shadow', 'Moth', 'Ash',
      'Honey', 'Salt', 'Ember', 'Heron', 'Serpent', 'River', 'Dusk', 'Drum', 'Needle', 'Vine', 'Flint',
      'Star', 'Moon', 'Reed', 'Clay', 'Mist', 'Wind', 'Bell'],
    feature: ['Mountaintop', 'Riverbank', 'Cliff', 'Terrace', 'Causeway', 'Stairway', 'Lakeshore', 'Canopy',
      'Ridge', 'Plaza', 'Threshold', 'Rooftop', 'Bridge', 'Hillside', 'Shoreline', 'Pass', 'Ford', 'Summit',
      'Aqueduct', 'Switchback', 'Tide Line', 'Long Field', 'Ballcourt', 'Rope Bridge', 'Cenote', 'Quarry',
      'Salt Flat', 'Mud Bank', 'Rain Shadow', 'Cloud Forest', 'Dry Wash', 'Lower Steps', 'Watch Tower',
      'Granary Roof', 'Old Road', 'Green Wall', 'Night Market'],
    time: ['Morning', 'Evening', 'Midday', 'Dawn', 'Dusk', 'Midnight', 'Harvest', 'the Flood', 'the Drought',
      'the Long Rain', 'the First Frost', 'Market Day', 'the Quiet Season', 'the Turning', 'the Last Bell',
      'the Short Days', 'the Second Planting', 'the Night Market', 'the Thaw', 'the Burning Season',
      'the Low Water', 'the Comet', 'the Eclipse', 'the Calm'],
    adj: ['Laughing', 'Quiet', 'Crooked', 'Burning', 'Falling', 'Sleeping', 'Singing', 'Walking', 'Climbing',
      'Watching', 'Counting', 'Drifting', 'Nine-Fingered', 'Left-Handed', 'Twice-Lost', 'Half-Awake',
      'Small', 'Tall', 'Bright', 'Slow', 'Borrowed', 'Unhurried', 'Patient', 'Early', 'Late', 'Waking',
      'Returning', 'Circling', 'Listening', 'Waiting', 'Hidden', 'Open', 'Folded', 'Unfinished', 'Spilled',
      'Gathered', 'Scattered', 'Doubled', 'Upturned', 'Weathered', 'Sunlit', 'Rainsoaked', 'Windblown'],
    plural: ['Timbers', 'Feathers', 'Stones', 'Serpents', 'Bells', 'Shoes', 'Knives', 'Winds', 'Thunderclouds',
      'Rivers', 'Candles', 'Doors', 'Mirrors', 'Seeds', 'Drums', 'Baskets', 'Lanterns', 'Ladders', 'Sparrows',
      'Bridges', 'Harvests', 'Shadows', 'Stairs', 'Masks', 'Gourds', 'Mountains', 'Rainfalls', 'Hummingbirds',
      'Fires', 'Threads', 'Pebbles', 'Whistles', 'Ropes'],
    number: ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'],
    colour: ['Red', 'Black', 'White', 'Green', 'Blue', 'Yellow', 'Grey', 'Gold', 'Rust', 'Pale'],
  },
  shortFrom: ['noun', 'plural', 'noun2', 'feature'],
};

const TABAXI_CLAN: PhraseSet = {
  templates: [
    ['{clan_adj} {clan_feature}', 7],
    ['{clan_adj2} {clan_adj} {clan_feature}', 5],
    ['{clan_adj2} {clan_feature}', 2],
  ],
  lexicon: {
    clan_adj: ['Distant', 'Rumbling', 'Snoring', 'Bright', 'Quiet', 'Hidden', 'Burning', 'Wandering',
      'Sleeping', 'Laughing', 'Crooked', 'Red', 'Black', 'White', 'Green', 'High', 'Low', 'Old', 'Broken',
      'Singing', 'Falling', 'Wide', 'Narrow', 'Cold', 'Patient', 'Drifting', 'Shaded', 'Golden', 'Hollow',
      'Restless', 'Sunken', 'Doubled', 'Whispering', 'Ancient', 'Shifting'],
    clan_feature: ['Cliffs', 'Rain', 'Mountain', 'River', 'Tree', 'Stones', 'Valley', 'Sands', 'Lake',
      'Shore', 'Hills', 'Winds', 'Reeds', 'Caves', 'Ridge', 'Falls', 'Marsh', 'Pines', 'Terraces', 'Steps',
      'Cenotes', 'Thorns', 'Ashfields', 'Canyons', 'Deltas', 'Hollows', 'Springs', 'Basins', 'Narrows',
      'Headlands', 'Groves', 'Flats'],
    clan_adj2: ['Upper', 'Lower', 'Outer', 'Inner', 'Near', 'Far', 'First', 'Second', 'Elder', 'Younger',
      'North', 'South', 'East', 'West', 'Great', 'Little'],
    clan_feature2: ['Cliffs', 'Rain', 'Mountain', 'River', 'Stones', 'Valley', 'Sands', 'Lake', 'Shore',
      'Hills', 'Winds', 'Reeds', 'Caves', 'Falls', 'Marsh', 'Terraces'],
  },
};

export const TABAXI: SpeciesSpec = {
  id: 'tabaxi', name: 'Tabaxi', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'A tabaxi name is a short descriptive phrase — a sensory image or a moment — rather than a personal name in the usual sense, and it is gender-neutral.',
    'One word of the phrase becomes the everyday short name: "Cloud" from a longer phrase about a cloud.',
    'Clan names are drawn from a geographic feature of the clan’s territory, and are two words.',
    'This entry never falls back on pseudo-fantasy syllables for tabaxi; the phrase architecture is the whole point.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'descriptive', label: 'Descriptive name', weight: 10,
      note: 'A descriptive phrase, a short everyday name taken from it, and a clan named for a place.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        phrase: { kind: 'phrase', set: TABAXI_PHRASE },
        clan: { kind: 'phrase', set: TABAXI_CLAN },
      },
      structures: [
        ST('phrase-clan', 8, [S('given', 'phrase', { label: 'Name' }),
          S('clan', 'clan', { prefix: 'of ', label: 'Clan' })]),
        ST('phrase-alone', 7, [S('given', 'phrase', { label: 'Name' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a clan territory three borders away', 'a terraced city', 'a jungle causeway', 'a rain season'],
    sp_thing: ['a story their name refers to', 'a collection with no obvious purpose',
      'an object taken from somewhere very far away'],
    sp_trait: ['loses interest the moment a mystery is solved', 'cannot stay in one town past the second week'],
  },
};

// ===========================================================================
// KENKU — names from mimicked sound
// ===========================================================================

const KENKU_SOUND: CompoundSet = {
  first: w('source', 'bell', 'rain', 'hinge', 'glass', 'coin', 'wheel', 'sail', 'rope', 'chain', 'kettle',
    'wind', 'shutter', 'gravel', 'iron', 'paper', 'drum', 'cup', 'knife', 'latch', 'floor', 'mast', 'thunder',
    'water', 'ash', 'crow', 'forge', 'market', 'hearth', 'gate', 'anvil', 'awning', 'barrel', 'bucket',
    'candle', 'cartwheel', 'cellar', 'cobble', 'cradle', 'curtain', 'dockside', 'fountain', 'gallows',
    'grindstone', 'gutter', 'hailstone', 'harness', 'ladder', 'lantern', 'lockpin', 'millstone', 'mortar',
    'oar', 'pulley', 'rafter', 'rigging', 'sawdust', 'scaffold', 'sleet', 'slate', 'spindle', 'stirrup',
    'tankard', 'tiller', 'tinder', 'treadle', 'wagon', 'whetstone', 'window', 'woodsmoke',
    'apron', 'ballast', 'bedframe', 'birdcage', 'boathook', 'bootheel', 'bowstring', 'brazier',
    'briarpatch', 'broomstraw', 'cartshaft', 'chimney', 'cistern', 'clapboard', 'cleaver', 'copperpot',
    'cornhusk', 'crowbar', 'dovecote', 'drainpipe', 'fencewire', 'ferrule', 'firegrate', 'flagstone',
    'floorboard', 'gatepost', 'glasshouse', 'grainsack', 'handcart', 'hayrake', 'hearthstone', 'hingepin',
    'horseshoe', 'icehouse', 'inkpot', 'kiln', 'lamppost', 'leadpipe', 'lintel', 'mailbag', 'milkpail',
    'nailhead', 'netting', 'orchard', 'ovendoor', 'paddle', 'pewter', 'plough', 'quarry', 'quayside',
    'rainbarrel', 'rooftile', 'ropewalk', 'rushlight', 'saddlebag', 'sandglass', 'sawmill', 'seacoal',
    'shingle', 'shovel', 'signboard', 'sluicegate', 'smithy', 'spitroast', 'stable', 'stairwell',
    'stockpot', 'sweepnet', 'thatch', 'thimble', 'tollgate', 'toolrack', 'trapdoor', 'trellis',
    'wagonbed', 'washtub', 'waterwheel', 'weathervane', 'wellrope', 'wheelrim', 'wicker', 'woodpile'),
  second: lower(w('sound', 'clatter', 'rattle', 'whine', 'song', 'hiss', 'knock', 'chime', 'creak', 'crack',
    'sigh', 'drip', 'snap', 'groan', 'hum', 'tap', 'thud', 'scrape', 'ring', 'clap', 'rush', 'whistle',
    'patter', 'toll', 'click', 'murmur', 'clink', 'clang', 'rasp', 'squeak', 'shuffle', 'crunch', 'splash',
    'hush', 'wheeze', 'warble', 'jangle', 'slam', 'tick', 'thump', 'swish', 'crackle', 'gurgle', 'drone',
    'peal', 'skitter', 'plink', 'whirr', 'scuff', 'clatterfall', 'bang', 'blare', 'boom', 'chatter',
    'chirr', 'chuff', 'clack', 'clamour', 'clunk', 'crash', 'creakfall', 'ding', 'fizz', 'flutter',
    'grate', 'grind', 'growl', 'judder', 'knell', 'lap', 'patterfall', 'ping', 'pop', 'rumble', 'rustle',
    'scratch', 'screech', 'shudder', 'sizzle', 'slap', 'slosh', 'smack', 'sputter', 'squelch', 'tatter',
    'thrum', 'tinkle', 'trill', 'wail', 'whack', 'whisper', 'yawn')),
  casing: 'fused',
};

const KENKU_SINGLE: MorphSet = {
  initial: [
    m('Clapper', 'the sound of a bell striking'), m('Creak', 'a door no one oils'),
    m('Whistle', 'a signal from a quay'), m('Rattle', 'a cart on cobbles'),
    m('Tally', 'a clerk counting aloud'), m('Hush', 'a room going quiet'),
    m('Drip', 'a cistern'), m('Echo', 'a hall'), m('Snap', 'kindling'), m('Toll', 'a funeral bell'),
    m('Scrape', 'a chair'), m('Grind', 'a mill'), m('Clink', 'coins counted'), m('Thud', 'a crate landing'),
    m('Chatter', 'a market at dawn'), m('Flap', 'a sail'), m('Chime', 'an hour struck'),
    m('Clatter', 'a dropped tray'), m('Murmur', 'a congregation'), m('Hiss', 'a lamp going out'),
    m('Patter', 'rain on a roof'), m('Groan', 'a ship’s timber'), m('Keening', 'wind in a gap'),
    m('Slam', 'a shutter in a gale'), m('Ticking', 'a clock in an empty room'), m('Sputter', 'a wet fire'),
    m('Jangle', 'keys on a belt'), m('Whirr', 'a spindle'), m('Peal', 'a wedding'), m('Rasp', 'a file'),
    m('Clang', 'a smithy'), m('Gurgle', 'a drain'), m('Shuffle', 'a card game'), m('Wheeze', 'a bellows'),
    m('Crunch', 'frost underfoot'), m('Splash', 'an oar'), m('Squeak', 'a cart axle'),
    m('Rustle', 'a ledger’s pages'), m('Clink', 'a toast'), m('Knell', 'a watch bell'),
  ],
  partsByComplexity: { 1: [1], 2: [1], 3: [1], 4: [1], 5: [1] },
};

export const KENKU: SpeciesSpec = {
  id: 'kenku', name: 'Kenku', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'Kenku names come from sounds a kenku mimics, so they are onomatopoeic words or compounds of a source and a sound — never pseudo-fantasy syllables.',
    'Names are gender-neutral and there are no family names.',
    'Monsters of the Multiverse removed the hard restriction on kenku speech, but the naming habit is cultural and persists.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'mimicry', label: 'Name from a sound', weight: 10,
      note: 'A sound a kenku can make perfectly, used as a name.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        compound: { kind: 'compound', set: KENKU_SOUND },
        single: { kind: 'morph', set: KENKU_SINGLE },
      },
      structures: [
        ST('compound', 4, [S('given', 'compound', { label: 'Name' })]),
        ST('single-compound', 6, [S('given', 'single', { label: 'Name' }),
          S('nickname', 'compound', { prefix: '“', suffix: '”', label: 'Also' })]),
        ST('compound-single', 5, [S('given', 'compound', { label: 'Name' }),
          S('nickname', 'single', { prefix: '“', suffix: '”', label: 'Also' })], { minComplexity: 2 }),
        ST('compound-compound', 3, [S('given', 'compound', { label: 'Name' }),
          S('nickname', 'compound', { prefix: '“', suffix: '”', label: 'Also' })], { minComplexity: 3 }),
        ST('single', 1.5, [S('given', 'single', { label: 'Name' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a dockside where every sound is worth learning', 'a bell tower', 'a courtroom', 'a theatre'],
    sp_thing: ['a voice they borrowed from someone who died', 'a sound they can no longer reproduce'],
    sp_trait: ['answers in someone else’s voice when tired', 'collects useful sounds the way others collect coins'],
  },
};

// ===========================================================================
// AARAKOCRA
// ===========================================================================

const AARAKOCRA_PHON: Phonology = {
  initialOnsets: [['k', 5], ['kr', 3], ['ch', 3], ['s', 3], ['sh', 2], ['t', 3], ['th', 2], ['r', 2], ['d', 2],
    ['z', 2], ['q', 3], ['w', 2], ['y', 2], ['h', 2], ['tr', 2], ['skr', 2], ['p', 2]],
  onsets: [['k', 4], ['kk', 3], ['r', 4], ['rr', 3], ['s', 3], ['ss', 2], ['t', 3], ['ch', 2], ['l', 2], ['z', 2],
    ['d', 2], ['w', 1], ['y', 1]],
  nuclei: [['ee', 6], ['i', 6], ['a', 6], ['oo', 4], ['u', 3], ['e', 4], ['aa', 3], ['ia', 1]],
  initialNuclei: [['ee', 5], ['a', 6], ['i', 6], ['oo', 3], ['u', 3], ['e', 4]],
  codas: [['k', 6], ['kk', 4], ['rr', 4], ['ck', 3], ['sh', 2], ['t', 3], ['ch', 2], ['r', 3], ['p', 1]],
  finalCodas: [['k', 6], ['kk', 4], ['rr', 4], ['ck', 3], ['sh', 2], ['t', 2], ['ch', 2]],
  patterns: [['CVK', 7], ['CV', 3], ['VK', 2]],
  finalPatterns: [['CVK', 9], ['CV', 1]],
  internalMark: { mark: "'", chance: 0.2 },
  maxJunctureCluster: 3,
  maxRepeatLetter: 2,
};

const AARAKOCRA_FLOCK: CompoundSet = {
  first: blend(retag(WEATHER, 'sky'), retag(STONE, 'rock'),
    w('sky', 'high', 'thin', 'far', 'wind', 'updraught', 'thermal', 'cloud', 'crag', 'ledge', 'spire', 'open')),
  second: lower(w('tail', 'wing', 'eyrie', 'circle', 'gyre', 'perch', 'ledge', 'call', 'watch', 'wheel',
    'nest', 'crossing', 'current', 'climb')),
  avoidSharedTags: ['sky', 'rock'],
  casing: 'fused',
};

export const AARAKOCRA: SpeciesSpec = {
  id: 'aarakocra', name: 'Aarakocra', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Elemental Evil Player’s Companion'],
  confidence: 'documented',
  loreNotes: [
    'Aarakocra names are combinations of clicks, whistles and trills, written in Common with doubled consonants and apostrophes.',
    'Names are short and gender-neutral; aarakocra identify by flock rather than by family.',
    'The flock names here are an original extension — published material names flocks but does not tabulate them.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'call', label: 'Call-name and flock', weight: 10,
      note: 'A short call-name, sometimes with the flock an aarakocra flies with.',
      genderPolicy: 'neutral',
      producers: {
        given: { kind: 'phonetic', phonology: AARAKOCRA_PHON, syllables: TERSE },
        flock: { kind: 'compound', set: AARAKOCRA_FLOCK },
      },
      structures: [
        ST('given-alone', 6, [S('given', 'given')]),
        ST('given-flock', 6, [S('given', 'given'), S('clan', 'flock', { prefix: 'of ', label: 'Flock' })]),
        ST('given-flock-plain', 2.5, [S('given', 'given'), S('clan', 'flock', { label: 'Flock' })],
          { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['an eyrie above a pass', 'a thermal over a desert', 'a spire city', 'a ground-level town they dislike'],
    sp_thing: ['a feather from a bird nobody can identify', 'a view they cannot describe to anyone'],
    sp_trait: ['is visibly unhappy indoors', 'gives directions as though everyone can fly'],
  },
};

// ===========================================================================
// LIZARDFOLK
// ===========================================================================

/**
 * Lizardfolk take an existing Draconic word as a name, chosen for its meaning.
 * The vocabulary below is original to Session Zero — the published table is
 * not reproduced — but the *mechanism* (a word, used as a name) is canonical.
 */
const DRACONIC_WORDS: MorphSet = {
  initial: [
    m('Zhakt', 'scale'), m('Orrith', 'hunt'), m('Semu', 'reed'), m('Takval', 'marsh'), m('Brilix', 'flash'),
    m('Nurok', 'stillness'), m('Khessa', 'breath'), m('Pelth', 'root'), m('Yavic', 'green water'),
    m('Draz', 'tooth'), m('Molu', 'mud'), m('Rhakis', 'current'), m('Issvar', 'coil'), m('Tenak', 'patience'),
    m('Vorg', 'flood'), m('Shuul', 'egg'), m('Kaleth', 'nest'), m('Ozzik', 'bone'), m('Thamu', 'sun-warm'),
    m('Glith', 'cold'), m('Narro', 'count'), m('Vekra', 'stone'), m('Ulsh', 'shadow'), m('Mekka', 'wind'),
    m('Zoran', 'far'), m('Haleth', 'clutch'), m('Pirrik', 'quick'), m('Dhova', 'deep'), m('Sakh', 'dry'),
    m('Thenn', 'bank'), m('Grusk', 'thicket'), m('Ammu', 'water-skin'), m('Velth', 'weight'),
    m('Korrash', 'drought'), m('Nevik', 'small'), m('Zhurr', 'heat'), m('Irruk', 'edge'), m('Baleth', 'tide'),
    m('Semmik', 'knot'), m('Ovash', 'open sky'),
    m('Khoth', 'claw'), m('Zelvu', 'the turning year'), m('Prassk', 'husk'), m('Irriv', 'the long wait'),
    m('Nommath', 'provision'), m('Takkur', 'sibling'), m('Vesht', 'skin'), m('Orrzu', 'morning fog'),
    m('Delka', 'hollow log'), m('Sshan', 'warning'), m('Grevik', 'ridge'), m('Thulo', 'slow water'),
    m('Makath', 'gathering'), m('Ozuun', 'the moon on water'), m('Reska', 'crack in stone'),
    m('Vammu', 'salt'), m('Nekil', 'fledgling'), m('Phorr', 'rot'), m('Jaleth', 'spear'),
    m('Zarruk', 'the cold months'), m('Immeth', 'balance'), m('Khav', 'hunger'), m('Luzzak', 'surplus'),
    m('Threnn', 'kin-debt'), m('Osku', 'low tide'), m('Vrakka', 'storm front'), m('Nazzeth', 'silence'),
    m('Pellik', 'sprout'), m('Khorro', 'the deep channel'), m('Ulvem', 'driftwood'), m('Tazzu', 'barter'),
    m('Semmesh', 'thatch'), m('Yavrik', 'green light'), m('Drenn', 'the first kill'), m('Kolath', 'raft'),
    m('Mevva', 'sap'), m('Issmu', 'shed'), m('Hathu', 'count of days'), m('Zellan', 'basking rock'),
    m('Narruk', 'thorn'), m('Vethil', 'cord'), m('Pirru', 'hatchling noise'), m('Ozzeth', 'omen'),
    m('Gazzu', 'the shallows'), m('Thekk', 'notch'), m('Velmu', 'softness'), m('Orrva', 'the first rain'),
    m('Nizzak', 'spine'), m('Khamu', 'the shared meal'), m('Druth', 'weight'), m('Sellik', 'reed-cutter'),
    m('Vosha', 'the far bank'), m('Immek', 'pause'), m('Tharro', 'carrying'), m('Zemmu', 'warm mud'),
    m('Pollik', 'small stone'), m('Yarruk', 'the elder'), m('Nethka', 'the narrow place'),
    m('Oskuth', 'the drying'), m('Vrenn', 'split'), m('Lazzeth', 'the accounting'), m('Hemmu', 'wet grass'),
    m('Kirrak', 'the signal'), m('Thovva', 'the slow season'), m('Ummek', 'the given thing'),
    m('Zheppa', 'flat water'), m('Nurruth', 'the resting place'), m('Pazzik', 'splinter'),
    m('Vellath', 'the long bank'), m('Essku', 'the taken breath'), m('Morrik', 'the crooked branch'),
    m('Jazzu', 'the brightening'), m('Khennu', 'the held thing'), m('Teshva', 'the counted days'),
    m('Ulrikk', 'the outer reach'), m('Grozza', 'the heavy rain'),
  ],
  linkers: [['-', 7], ['', 4]],
  partsByComplexity: {
    1: [[1, 7], [2, 3]],
    2: [[1, 5], [2, 5]],
    3: [[1, 3], [2, 7]],
    4: [[1, 1], [2, 8], [3, 1]],
    5: [[2, 7], [3, 3]],
  },
};

export const LIZARDFOLK: SpeciesSpec = {
  id: 'lizardfolk', name: 'Lizardfolk', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'documented',
  loreNotes: [
    'A lizardfolk name is a Draconic word, chosen for what it means — a physical feature, a deed, or a thing in the world. Names are gender-neutral.',
    'Lizardfolk may take a new name after a significant event, so a person can accumulate several across a lifetime.',
    'The Draconic vocabulary here is original to this tool; the published word list is not reproduced. The mechanism — word-as-name — is canonical.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'word-name', label: 'A Draconic word', weight: 10,
      note: 'A word chosen for its meaning, sometimes joined to a second.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        word: { kind: 'morph', set: DRACONIC_WORDS },
        second: { kind: 'morph', set: { ...DRACONIC_WORDS, partsByComplexity: { 1: [1], 2: [1], 3: [1], 4: [1], 5: [1] } } },
      },
      structures: [
        ST('word', 6, [S('given', 'word', { label: 'Name' })]),
        ST('word-former', 4, [S('given', 'word', { label: 'Name' }),
          S('nickname', 'second', { separator: ', ', prefix: 'once ', label: 'Formerly' })], { minComplexity: 2 }),
        ST('word-taken', 3, [S('given', 'word', { label: 'Name' }),
          S('epithet', 'second', { separator: ', ', prefix: 'now ', label: 'Taken name' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a marsh village built on piles', 'a tidal flat', 'a nesting ground', 'a dry season camp'],
    sp_thing: ['a name they discarded', 'a tally of what the group can afford to lose'],
    sp_trait: ['is baffled by sentimentality and polite about it', 'states the useful thing rather than the kind thing'],
  },
};

// ===========================================================================
// LEONIN
// ===========================================================================

const LEONIN_PHON: Phonology = {
  initialOnsets: [['p', 3], ['t', 3], ['k', 3], ['th', 3], ['ph', 3], ['kh', 2], ['d', 3], ['g', 2], ['l', 3],
    ['m', 3], ['n', 3], ['r', 2], ['s', 3], ['z', 2], ['x', 2], ['ch', 2], ['pr', 2], ['tr', 2], ['kr', 2],
    ['dr', 2], ['h', 2], ['e', 1], ['a', 1], ['o', 1]],
  onsets: [['t', 3], ['k', 3], ['th', 3], ['l', 4], ['m', 3], ['n', 3], ['r', 4], ['s', 3], ['x', 2], ['z', 2],
    ['ph', 2], ['d', 3], ['ch', 1], ['nth', 1], ['st', 1]],
  nuclei: [['a', 8], ['o', 7], ['e', 6], ['i', 5], ['u', 3], ['eo', 2], ['io', 2], ['ai', 2], ['au', 1]],
  codas: [['s', 4], ['n', 4], ['r', 3], ['x', 3], ['th', 3], ['l', 3], ['ks', 2], ['ph', 1], ['m', 2]],
  finalCodas: [['s', 5], ['n', 4], ['r', 3], ['x', 3], ['th', 2], ['l', 2]],
  patterns: [['CV', 6], ['CVK', 5], ['V', 1]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['os', 4], ['or', 2], ['ax', 3], ['eus', 1], ['on', 2], ['ys', 2], ['athor', 1]],
    feminine: [['a', 4], ['ia', 3], ['e', 2], ['ne', 2], ['tha', 2], ['is', 2], ['ione', 1]],
    neutral: [['ex', 3], ['is', 2], ['on', 2], ['ar', 2], ['ox', 2]],
  },
  maxLength: 12,
};

const LEONIN_PRIDE: CompoundSet = {
  first: blend(
    w('elem', 'ember', 'iron', 'sun', 'dust', 'dawn', 'stone', 'gold', 'amber', 'bronze', 'storm', 'thorn',
      'sand', 'ash', 'salt', 'high', 'far', 'red', 'bright', 'long'),
  ),
  second: lower(w('tail', 'eye', 'mane', 'guide', 'stride', 'claw', 'pride', 'watch', 'roar', 'tread', 'heart',
    'horn', 'crest', 'shade', 'ridge', 'hunt', 'track', 'stand', 'reach', 'mark')),
  avoidSharedTags: ['elem'],
  casing: 'fused',
};

export const LEONIN: SpeciesSpec = {
  id: 'leonin', name: 'Leonin', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Mythic Odysseys of Theros'],
  confidence: 'partial',
  loreNotes: [
    'Leonin names published for Theros mix melodic and harsh sounds against a broadly Hellenic backdrop.',
    'A leonin carries a pride name as well as a personal name; pride names are transparent Common compounds.',
    'The specific pride vocabulary here is original; the structure (personal name plus pride) follows the published setting.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'pride', label: 'Personal name and pride', weight: 10,
      note: 'A personal name followed by the pride a leonin belongs to.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: LEONIN_PHON, syllables: MEDIUM },
        pride: { kind: 'compound', set: LEONIN_PRIDE },
      },
      structures: [
        ST('given-pride', 9, [S('given', 'given'), S('clan', 'pride', { label: 'Pride' })]),
        ST('given-of-pride', 3, [S('given', 'given'), S('clan', 'pride', { prefix: 'of the ', label: 'Pride' })],
          { minComplexity: 2 }),
        ST('given-alone', 2.5, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a savannah settlement', 'a pride-hall', 'a city that treats them as an exhibit'],
    sp_thing: ['a pride obligation they have not discharged', 'a hunting territory nobody recognises any more'],
    sp_trait: ['is uneasy accepting charity', 'treats a shared meal as a formal commitment'],
  },
};

// ===========================================================================
// LOXODON
// ===========================================================================

const LOXODON_PHON: Phonology = {
  initialOnsets: [['b', 3], ['br', 3], ['d', 3], ['dr', 2], ['f', 3], ['g', 3], ['h', 3], ['j', 2], ['k', 3],
    ['kr', 2], ['l', 3], ['m', 4], ['n', 3], ['p', 2], ['r', 2], ['s', 3], ['t', 3], ['th', 3], ['v', 3],
    ['z', 2], ['tr', 2], ['gr', 2]],
  onsets: [['b', 2], ['d', 3], ['l', 4], ['m', 5], ['n', 4], ['r', 4], ['s', 3], ['t', 3], ['v', 3], ['th', 2],
    ['j', 2], ['k', 2], ['g', 2], ['z', 1], ['mm', 1], ['nn', 1]],
  nuclei: [['oo', 5], ['o', 9], ['u', 7], ['a', 7], ['aa', 1], ['ou', 2], ['e', 4], ['i', 4]],
  initialNuclei: [['o', 7], ['oo', 5], ['u', 5], ['a', 7], ['e', 3], ['i', 3]],
  codas: [['m', 5], ['n', 5], ['r', 4], ['l', 3], ['th', 3], ['j', 2], ['v', 2], ['ng', 3], ['mb', 1]],
  finalCodas: [['m', 6], ['n', 5], ['r', 4], ['j', 3], ['th', 2], ['ng', 2], ['l', 2]],
  patterns: [['CV', 6], ['CVK', 6]],
  finalPatterns: [['CVK', 7], ['CV', 3]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['oom', 2], ['un', 2], ['ov', 2], ['om', 2], ['ar', 2]],
    feminine: [['a', 4], ['ova', 2], ['una', 2], ['ani', 2], ['ora', 2]],
    neutral: [['on', 3], ['um', 2], ['ur', 2], ['aj', 2], ['en', 2]],
  },
  maxLength: 12,
};

export const LOXODON: SpeciesSpec = {
  id: 'loxodon', name: 'Loxodon', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Guildmasters’ Guide to Ravnica'],
  confidence: 'partial',
  loreNotes: [
    'Loxodon names published for Ravnica use low, resonant, open sounds — long vowels and nasals — matching how loxodons speak.',
    'Loxodons value family and community deeply and carry a family name, often with a long and deliberate full form.',
    'The specific vocabulary here is original; the sound profile follows the published examples.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'family', label: 'Personal and family name', weight: 10,
      note: 'A resonant personal name with the family name, spoken in full.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: LOXODON_PHON, syllables: MEDIUM },
        family: { kind: 'phonetic', phonology: LOXODON_PHON, syllables: LONG },
      },
      structures: [
        ST('given-family', 9, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
        ST('given-of-family', 2, [S('given', 'given'), S('family', 'family', { prefix: 'of ', label: 'Family' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a guild hall', 'a communal house', 'a long-standing family concern', 'a meditation garden'],
    sp_thing: ['a family obligation measured in generations', 'a record of everyone the family has helped'],
    sp_trait: ['takes a very long time to reach a decision and never revisits it',
      'remembers slights with perfect clarity and acts on none of them'],
  },
};

// ===========================================================================
// MINOTAUR
// ===========================================================================

const MINOTAUR_PHON: Phonology = {
  initialOnsets: [['b', 3], ['br', 2], ['d', 3], ['g', 3], ['gr', 3], ['k', 4], ['kr', 3], ['m', 3], ['n', 3],
    ['p', 2], ['r', 2], ['s', 3], ['t', 3], ['th', 3], ['v', 2], ['z', 2], ['ch', 2], ['kh', 2], ['dr', 2],
    ['tr', 2], ['h', 2]],
  onsets: [['b', 2], ['d', 3], ['g', 3], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['r', 4], ['s', 3], ['t', 3],
    ['th', 2], ['v', 2], ['z', 2], ['kh', 1], ['nn', 1]],
  nuclei: [['a', 8], ['o', 7], ['u', 5], ['e', 5], ['i', 4], ['au', 2], ['ou', 1]],
  codas: [['s', 4], ['n', 4], ['r', 4], ['k', 3], ['th', 3], ['ks', 2], ['rn', 2], ['rk', 2], ['m', 3], ['ng', 1]],
  finalCodas: [['s', 5], ['n', 4], ['r', 4], ['k', 3], ['th', 3], ['m', 2], ['ks', 2]],
  patterns: [['CVK', 7], ['CV', 4]],
  finalPatterns: [['CVK', 7], ['CV', 3]],
  maxJunctureCluster: 3,
  endings: {
    masculine: [['os', 3], ['us', 2], ['on', 2], ['ax', 2], ['ar', 2], ['oth', 2]],
    feminine: [['a', 4], ['ia', 2], ['e', 2], ['issa', 2], ['ara', 2], ['one', 1]],
    neutral: [['os', 3], ['ex', 2], ['on', 2], ['ur', 2], ['eth', 2]],
  },
  maxLength: 12,
};

const MINOTAUR_DEED: CompoundSet = {
  first: blend(retag(STONE, 'material'), retag(WEATHER, 'nature'), retag(COLOURS, 'colour'),
    w('q', 'iron', 'oath', 'bronze', 'horn', 'salt', 'sun', 'deep', 'long', 'first', 'last', 'true', 'twice', 'far')),
  second: lower(w('tail', 'hide', 'horn', 'tread', 'bellow', 'brand', 'bearer', 'warden', 'mason', 'keeper',
    'carver', 'ranger', 'binder', 'breaker', 'finder', 'walker', 'builder', 'holder', 'speaker', 'counter')),
  avoidSharedTags: ['material', 'nature', 'colour', 'q'],
  casing: 'fused',
};

export const MINOTAUR: SpeciesSpec = {
  id: 'minotaur', name: 'Minotaur', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Guildmasters’ Guide to Ravnica', 'Mythic Odysseys of Theros'],
  confidence: 'partial',
  loreNotes: [
    'Published minotaur names are guttural with a Hellenic colouring, and minotaurs carry a surname earned for a deed or a merit.',
    'Earned surnames in this generator describe work, craft and endurance as readily as combat — minotaurs in current material are labyrinth-builders and navigators, not a warrior monoculture.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'earned-surname', label: 'Personal name and earned surname', weight: 10,
      note: 'A personal name with a surname taken for something done.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: MINOTAUR_PHON, syllables: MEDIUM },
        deed: { kind: 'compound', set: MINOTAUR_DEED },
      },
      structures: [
        ST('given-deed', 9, [S('given', 'given'), S('family', 'deed', { label: 'Earned name' })]),
        ST('given-alone', 3, [S('given', 'given')]),
        ST('given-the-deed', 2, [S('given', 'given'), S('epithet', 'deed', { prefix: 'the ', label: 'Earned name' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a labyrinth that is also a library', 'a stone quarry', 'a navigator’s guild', 'a maze-shrine'],
    sp_thing: ['a surname they earned for something they regret', 'a plan of a structure that should not work'],
    sp_trait: ['never gets lost and cannot explain why', 'is exhausted by being treated as a threat'],
  },
};

// ===========================================================================
// TORTLE
// ===========================================================================

const TORTLE_PHON: Phonology = {
  initialOnsets: [['b', 3], ['d', 3], ['g', 2], ['h', 3], ['k', 3], ['l', 3], ['m', 4], ['n', 3], ['p', 3],
    ['r', 2], ['s', 3], ['t', 4], ['w', 3], ['y', 2], ['br', 1], ['kr', 1], ['tr', 1], ['sh', 2], ['ch', 1]],
  onsets: [['b', 2], ['d', 3], ['k', 3], ['l', 4], ['m', 4], ['n', 4], ['p', 2], ['r', 3], ['s', 2], ['t', 4],
    ['w', 2], ['g', 2], ['h', 1]],
  nuclei: [['a', 8], ['o', 7], ['u', 5], ['e', 5], ['i', 5], ['oo', 2]],
  codas: [['k', 3], ['m', 3], ['n', 4], ['t', 3], ['l', 3], ['p', 2], ['r', 2], ['sh', 1]],
  finalCodas: [['k', 3], ['m', 3], ['n', 4], ['t', 3], ['l', 2], ['p', 2]],
  patterns: [['CV', 7], ['CVK', 5]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['o', 3], ['uk', 2], ['am', 2], ['on', 2], ['ok', 2]],
    feminine: [['a', 4], ['i', 2], ['una', 2], ['ola', 2], ['ema', 1]],
    neutral: [['o', 3], ['u', 3], ['en', 2], ['at', 2], ['im', 2]],
  },
};

const TORTLE_PLACE: CompoundSet = {
  first: blend(retag(WATER, 'place'), retag(SEA_LIFE, 'sea'),
    w('place', 'salt', 'sand', 'reef', 'mangrove', 'estuary', 'driftwood', 'low', 'warm', 'green', 'quiet', 'long')),
  second: lower(w('tail', 'shallows', 'flats', 'bend', 'beach', 'spit', 'crossing', 'pool', 'hatchery',
    'landing', 'shore', 'bank', 'reach')),
  avoidSharedTags: ['place', 'sea'],
  casing: 'spaced',
};

export const TORTLE: SpeciesSpec = {
  id: 'tortle', name: 'Tortle', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'The Tortle Package'],
  confidence: 'partial',
  loreNotes: [
    'Published tortle names are short — one or two syllables — given by a parent at hatching and kept for life.',
    'Tortles have no inherited family names; where a second element appears it is the place a tortle hatched.',
    'The hatching-place vocabulary here is an original extension consistent with tortle coastal life.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'hatch-name', label: 'Hatch name', weight: 10,
      note: 'A short name given at hatching, sometimes with the place it happened.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: TORTLE_PHON, syllables: TERSE },
        place: { kind: 'compound', set: TORTLE_PLACE },
      },
      structures: [
        ST('given-alone', 8, [S('given', 'given')]),
        ST('given-of-place', 5, [S('given', 'given'), S('descriptor', 'place', { prefix: 'of ', label: 'Hatched at' })],
          { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a stretch of coast', 'a hatching beach', 'a fishing village', 'a reef they know by touch'],
    sp_thing: ['a shell carving done over decades', 'a walking stick older than most people they meet'],
    sp_trait: ['is unhurried in a way that unnerves people', 'treats a century as a reasonable planning horizon'],
  },
};

// ===========================================================================
// SHIFTER
// ===========================================================================

const SHIFTER_SIMPLE: MorphSet = {
  initial: [
    m('Bend', 'bend'), m('Brook', 'brook'), m('Chase', 'chase'), m('Clay', 'clay'), m('Cut', 'cut'),
    m('Dusk', 'dusk'), m('Ember', 'ember'), m('Fang', 'fang'), m('Flint', 'flint'), m('Gale', 'gale'),
    m('Hollow', 'hollow'), m('Jay', 'jay'), m('Kit', 'kit'), m('Larch', 'larch'), m('Mire', 'mire'),
    m('Nettle', 'nettle'), m('Otter', 'otter'), m('Pike', 'pike'), m('Quill', 'quill'), m('Rust', 'rust'),
    m('Sedge', 'sedge'), m('Shale', 'shale'), m('Swift', 'swift'), m('Tally', 'tally'), m('Thorn', 'thorn'),
    m('Vole', 'vole'), m('Weft', 'weft'), m('Wick', 'wick'), m('Yarrow', 'yarrow'), m('Birch', 'birch'),
    m('Crag', 'crag'), m('Drift', 'drift'), m('Hare', 'hare'), m('Lark', 'lark'), m('Moss', 'moss'),
    m('Rill', 'rill'), m('Scar', 'scar'), m('Tide', 'tide'), m('Vesper', 'evening'), m('Wren', 'wren'),
    m('Bracken', 'bracken'), m('Burr', 'burr'), m('Cinder', 'cinder'), m('Coppice', 'coppice'),
    m('Culvert', 'culvert'), m('Dapple', 'dapple'), m('Ditch', 'ditch'), m('Fallow', 'fallow'),
    m('Fennel', 'fennel'), m('Gorse', 'gorse'), m('Grist', 'grist'), m('Hackle', 'hackle'),
    m('Harrow', 'harrow'), m('Heath', 'heath'), m('Hoar', 'hoarfrost'), m('Kestrel', 'kestrel'),
    m('Loam', 'loam'), m('Marrow', 'marrow'), m('Nock', 'nock'), m('Osier', 'osier'), m('Pelt', 'pelt'),
    m('Rook', 'rook'), m('Sable', 'sable'), m('Scrub', 'scrub'), m('Shrike', 'shrike'), m('Sloe', 'sloe'),
    m('Spar', 'spar'), m('Stook', 'stook'), m('Tansy', 'tansy'), m('Teasel', 'teasel'), m('Tinder', 'tinder'),
    m('Vetch', 'vetch'), m('Warren', 'warren'), m('Whin', 'whin'), m('Withy', 'withy'), m('Yew', 'yew'),
    m('Brindle', 'brindle'), m('Chaff', 'chaff'), m('Flax', 'flax'), m('Hoarfrost', 'hoarfrost'),
    m('Kindling', 'kindling'), m('Quarry', 'quarry'), m('Russet', 'russet'), m('Sorrel', 'sorrel'),
    m('Alder', 'alder'), m('Bay', 'bay'), m('Bramble', 'bramble'), m('Briar', 'briar'), m('Catkin', 'catkin'),
    m('Cob', 'cob'), m('Comfrey', 'comfrey'), m('Dusk', 'dusk'), m('Elm', 'elm'), m('Ferret', 'ferret'),
    m('Finch', 'finch'), m('Furrow', 'furrow'), m('Gallows', 'gallows'), m('Gleam', 'gleam'),
    m('Hawthorn', 'hawthorn'), m('Heron', 'heron'), m('Holly', 'holly'), m('Ivy', 'ivy'), m('Juniper', 'juniper'),
    m('Kernel', 'kernel'), m('Linnet', 'linnet'), m('Marten', 'marten'), m('Nightjar', 'nightjar'),
    m('Oakum', 'oakum'), m('Plover', 'plover'), m('Reed', 'reed'), m('Ripple', 'ripple'), m('Sallow', 'sallow'),
    m('Shale', 'shale'), m('Sparrow', 'sparrow'), m('Stoat', 'stoat'), m('Tamarisk', 'tamarisk'),
    m('Thrush', 'thrush'), m('Vixen', 'vixen'), m('Willow', 'willow'), m('Winter', 'winter'),
  ],
  partsByComplexity: { 1: [1], 2: [1], 3: [1], 4: [1], 5: [1] },
};

const SHIFTER_DESCRIPTIVE: CompoundSet = {
  first: blend(retag(BEARING, 'q'), retag(COLOURS, 'colour'),
    w('q', 'half', 'low', 'long', 'quick', 'night', 'dawn', 'winter', 'summer', 'first', 'last', 'lone',
      'twice', 'thin', 'broad', 'rough', 'sharp', 'short', 'wide', 'close', 'far', 'deep', 'high', 'cold',
      'warm', 'dusk', 'storm', 'frost', 'rain', 'wind', 'ash', 'moss', 'river', 'hill', 'hollow')),
  second: lower(blend(retag(AGENTS, 'tail'),
    w('tail', 'step', 'scent', 'ear', 'eye', 'tooth', 'coat', 'track', 'run', 'watch', 'turn', 'paw',
      'tail', 'nose', 'gait', 'mark', 'spring', 'bound', 'stride', 'listen', 'pace', 'shoulder', 'back',
      'heel', 'ridge', 'breath', 'pelt', 'claw', 'whisker', 'flank'))),
  avoidSharedTags: ['q', 'colour'],
  casing: 'fused',
};

export const SHIFTER: SpeciesSpec = {
  id: 'shifter', name: 'Shifter', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Eberron: Rising from the Last War', 'Monsters of the Multiverse', 'Eberron: Forge of the Artificer'],
  confidence: 'partial',
  loreNotes: [
    'Published shifter names are short, plain and often taken from the natural world; shifters generally do not carry inherited family names.',
    'A descriptive second name earned within a community is common, and functions as a nickname rather than a surname.',
    'No shifter name table has been published, so the specific vocabulary here is original while the shape follows the described convention.',
  ],
  citations: ['https://www.dndbeyond.com/species', 'https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf'],
  traditions: [
    {
      id: 'plain', label: 'Plain name', weight: 10,
      note: 'A short, concrete name, sometimes with a descriptive earned alongside it.',
      genderPolicy: 'neutral',
      producers: {
        given: { kind: 'morph', set: SHIFTER_SIMPLE },
        descriptive: { kind: 'compound', set: SHIFTER_DESCRIPTIVE },
      },
      structures: [
        ST('given-descriptive', 11, [S('given', 'given', { label: 'Name' }),
          S('nickname', 'descriptive', { label: 'Called' })]),
        ST('given-alone', 1, [S('given', 'given', { label: 'Name' })]),
        ST('descriptive-alone', 1.5, [S('given', 'descriptive', { label: 'Name' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a village that kept to itself', 'a hunting camp', 'a city ward with a bad reputation it did not earn'],
    sp_thing: ['a reputation inherited from other people entirely', 'a scent memory of somewhere they cannot find'],
    sp_trait: ['knows who has entered a room before turning round', 'is careful not to be startled in company'],
  },
};

// ===========================================================================
// YUAN-TI
// ===========================================================================

const YUANTI_PHON: Phonology = {
  initialOnsets: [['s', 5], ['ss', 3], ['sh', 4], ['z', 3], ['h', 3], ['m', 3], ['n', 3], ['t', 3], ['th', 3],
    ['k', 2], ['j', 2], ['v', 2], ['r', 2], ['l', 2], ['d', 2], ['p', 2], ['ps', 1], ['sk', 1], ['sl', 2], ['y', 2]],
  onsets: [['s', 4], ['ss', 4], ['sh', 3], ['z', 3], ['n', 4], ['m', 3], ['l', 3], ['r', 3], ['t', 3], ['th', 3],
    ['h', 2], ['v', 2], ['k', 2], ['j', 2], ['d', 2], ['ll', 1], ['nn', 1]],
  nuclei: [['a', 8], ['i', 8], ['e', 5], ['u', 4], ['aa', 2], ['ii', 2], ['o', 3], ['ia', 2]],
  initialNuclei: [['a', 8], ['i', 7], ['e', 5], ['u', 4], ['o', 3]],
  codas: [['s', 5], ['ss', 4], ['sh', 3], ['n', 4], ['th', 3], ['k', 2], ['l', 2], ['r', 2], ['m', 2]],
  finalCodas: [['s', 5], ['ss', 3], ['sh', 3], ['n', 4], ['th', 3], ['k', 2], ['l', 2]],
  patterns: [['CV', 6], ['CVK', 6]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 3,
  endings: {
    masculine: [['as', 3], ['is', 2], ['ik', 2], ['an', 2], ['ass', 2], ['ar', 2]],
    feminine: [['a', 4], ['ia', 3], ['isa', 2], ['essa', 2], ['ana', 2], ['ith', 1]],
    neutral: [['as', 3], ['iss', 2], ['eth', 2], ['in', 2], ['al', 2]],
  },
  maxLength: 12,
};

const YUANTI_HOUSE: MorphSet = {
  initial: [
    m('Ses', 'the coiled'), m('Nhal', 'the still water'), m('Vass', 'the long shade'), m('Issa', 'the first egg'),
    m('Thal', 'the warm stone'), m('Mith', 'the pale'), m('Zar', 'the counting'), m('Sek', 'the patient'),
    m('Hass', 'the sealed door'), m('Lir', 'the river house'), m('Dhas', 'the measured'), m('Yass', 'the watcher'),
    m('Rin', 'the narrow way'), m('Phas', 'the sunlit'),
  ],
  final: [
    m('ithra', 'house'), m('assa', 'line'), m('eneth', 'descent'), m('ushal', 'coil'), m('iris', 'keeping'),
    m('alash', 'blood'), m('oneth', 'order'), m('issil', 'temple'), m('arath', 'chamber'), m('eshim', 'shed skin'),
  ],
  linkers: [['', 10], ['a', 2], ['i', 1]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [[2, 8], [3, 2]] },
};

export const YUAN_TI: SpeciesSpec = {
  id: 'yuan-ti', name: 'Yuan-ti', tier: 'expanded', group: BEAST_GROUP,
  sources: ['Monsters of the Multiverse', 'Volo’s Guide to Monsters'],
  confidence: 'partial',
  loreNotes: [
    'Published yuan-ti names are strongly sibilant, with doubled s and sh sounds, and are not especially long.',
    'Yuan-ti society is organised by lineage, so a house or line name alongside the personal name is the formal full form.',
    'Monsters of the Multiverse detaches yuan-ti from an assumed alignment; nothing in this generator is coded as villainous.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'house', label: 'Personal name and house', weight: 10,
      note: 'A sibilant personal name, formally given with the lineage house.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: YUANTI_PHON, syllables: MEDIUM },
        house: { kind: 'morph', set: YUANTI_HOUSE },
      },
      structures: [
        ST('given-house', 8, [S('given', 'given'), S('clan', 'house', { label: 'House' })]),
        ST('given-of-house', 3.5, [S('given', 'given'), S('clan', 'house', { prefix: 'of ', label: 'House' })],
          { minComplexity: 2 }),
        ST('given-alone', 3.5, [S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a jungle temple being reclaimed', 'a house that keeps very long records', 'a city enclave'],
    sp_thing: ['a lineage obligation', 'a shed skin kept for a reason they do not share'],
    sp_trait: ['is unnervingly comfortable with silence', 'is tired of people checking their eyes'],
  },
};

export const BEASTFOLK_SPECIES: SpeciesSpec[] = [
  TABAXI, KENKU, AARAKOCRA, LIZARDFOLK, LEONIN, LOXODON, MINOTAUR, TORTLE, SHIFTER, YUAN_TI,
];
