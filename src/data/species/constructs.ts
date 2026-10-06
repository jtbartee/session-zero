/**
 * Constructs, spacefarers and engineered peoples.
 *
 * These have the least conventional naming in the game. Warforged choose a
 * single word; autognomes start from a serial designation; giff never omit a
 * rank. None of them would be served by a "fantasy name" generator, so none
 * of them get one.
 */

import type { CompoundSet, MorphSet, Phonology, PhraseSet, SpeciesSpec, VirtueSet } from '../../types/index.ts';
import {
  BEARING, CONCEPTS, CRAFT_TOOLS, METALS, STONE, STRUCTURES, VIRTUES,
  blend, lower, m, retag, w,
} from '../vocabulary/palette.ts';
import { COMMON_GIVEN, COMMON_SURNAME } from './_shared.ts';
import { GNOME_CLAN, GNOME_PHON } from './core.ts';
import { LONG, MEDIUM, S, SHORT, ST, TERSE } from './_helpers.ts';

const CONSTRUCT_GROUP = 'Expanded — Constructs and spacefarers';
const SPACE_GROUP = 'Expanded — Wildspace';

// ===========================================================================
// WARFORGED
// ===========================================================================

const WARFORGED_WORD: VirtueSet = {
  concepts: blend(
    // Function: what they were built to do, or chose to do instead.
    w('function', 'Anchor', 'Bastion', 'Vigil', 'Ledger', 'Tally', 'Signal', 'Lantern', 'Hinge', 'Keel',
      'Pivot', 'Cipher', 'Tender', 'Warden', 'Relay', 'Beacon', 'Ballast', 'Gauge', 'Plumb', 'Shutter',
      'Lever', 'Latch', 'Sentry', 'Index', 'Register', 'Capstan', 'Awl', 'Bellwether', 'Bollard', 'Brace',
      'Bracket', 'Buttress', 'Caliper', 'Cantilever', 'Chock', 'Cleat', 'Compass', 'Counterweight',
      'Cradle', 'Crank', 'Datum', 'Dowel', 'Drawbar', 'Escort', 'Fathom', 'Ferry', 'Flange', 'Footing',
      'Gantry', 'Girder', 'Governor', 'Grapple', 'Hawser', 'Herald', 'Hoist', 'Jamb', 'Keystone', 'Linchpin',
      'Lintel', 'Mainstay', 'Marker', 'Mast', 'Mooring', 'Pallet', 'Pennant', 'Picket', 'Pillar', 'Pinion',
      'Piston', 'Plinth', 'Porter', 'Quarry', 'Rampart', 'Ratchet', 'Reckoner', 'Runner', 'Scaffold',
      'Screed', 'Shackle', 'Sledge', 'Spindle', 'Spline', 'Stanchion', 'Stay', 'Strut', 'Tackle', 'Tiller',
      'Toggle', 'Trestle', 'Truss', 'Vane', 'Wedge', 'Winch', 'Windlass', 'Yoke'),
    // Material: the simplest thing to name yourself after.
    retag(METALS, 'material'), retag(STONE, 'material'),
    w('material', 'Cordage', 'Resin', 'Lacquer', 'Oakwood', 'Sinew', 'Plate', 'Rivet', 'Cable', 'Canvas',
      'Charcoal', 'Darkwood', 'Felt', 'Glasswork', 'Gutta', 'Hempline', 'Ironwood', 'Leatherwork', 'Mortar',
      'Pitch', 'Sailcloth', 'Shellac', 'Solder', 'Tallow', 'Tar', 'Varnish', 'Wire', 'Clinker'),
    // Concept: what the first free decision was about.
    retag(VIRTUES, 'concept'), retag(CONCEPTS, 'concept'),
    w('concept', 'Afterward', 'Remainder', 'Enough', 'Nevertheless', 'Later', 'Still', 'Yet', 'Perhaps',
      'Instead', 'Nonetheless', 'Onward', 'Elsewhere', 'Henceforth', 'Likewise', 'Meanwhile', 'Regardless',
      'Thereafter', 'Accordingly', 'Presently', 'Someday', 'Hereafter', 'Anyway', 'Rather', 'Almost'),
  ),
  qualifiers: w('qualifier', 'Second', 'Third', 'Fourth', 'Fifth', 'New', 'Old', 'Lesser', 'Greater',
    'Quiet', 'Last', 'First', 'Spare', 'Standing', 'Working', 'Reserve', 'Field', 'Forward', 'Lower',
    'Upper', 'Outer', 'Inner', 'Long', 'Short', 'Heavy', 'Light', 'Plain', 'True', 'Steady', 'Even',
    'Open', 'Close', 'Deep', 'Broad', 'Narrow', 'Fast', 'Slow', 'High', 'Low', 'Near', 'Far', 'Dry',
    'Cold', 'Warm', 'Bright', 'Dim', 'Half', 'Whole', 'Double', 'Single', 'Common'),
  qualifierChance: { 1: 0.18, 2: 0.32, 3: 0.5, 4: 0.62, 5: 0.72 },
  casing: 'spaced',
};

const WARFORGED_DESIGNATION: PhraseSet = {
  templates: [
    ['{series}-{number}', 7],
    ['{series} {number}', 5],
    ['{series}-{number}-{suffix}', 1],
  ],
  lexicon: {
    series: ['Envoy', 'Juggernaut', 'Skirmisher', 'Sapper', 'Courier', 'Bulwark', 'Scout', 'Lancer',
      'Pioneer', 'Signaller', 'Pontoon', 'Quartermaster', 'Sentinel', 'Outrider', 'Bridger', 'Carrier',
      'Digger', 'Flanker', 'Grenadier', 'Hauler', 'Linesman', 'Marshal', 'Pathfinder', 'Picket', 'Ranger',
      'Reclaimer', 'Rigger', 'Runner', 'Salvager', 'Sentry', 'Shieldbearer', 'Stevedore', 'Surveyor',
      'Trencher', 'Vanguard', 'Wrecker', 'Yardman'],
    number: ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Seventeen', 'Nineteen', 'Twenty', 'Twenty-One', 'Twenty-Three',
      'Twenty-Six', 'Twenty-Nine', 'Thirty', 'Thirty-Two', 'Thirty-Five', 'Thirty-Eight', 'Forty',
      'Forty-Four', 'Forty-Seven', 'Fifty', 'Fifty-Two', 'Fifty-Six', 'Sixty', 'Sixty-Three', 'Sixty-Eight',
      'Seventy', 'Seventy-Four', 'Eighty', 'Eighty-One', 'Eighty-Five', 'Ninety', 'Ninety-Three',
      'Ninety-Nine'],
    suffix: ['Mark Two', 'Mark Three', 'Revised', 'Reissued', 'Field Pattern', 'Last Batch', 'Reclaimed',
      'Rebuilt', 'Spare'],
  },
  shortFrom: ['series'],
};

export const WARFORGED: SpeciesSpec = {
  id: 'warforged', name: 'Warforged', tier: 'expanded', group: CONSTRUCT_GROUP,
  sources: ['Eberron: Rising from the Last War', 'Monsters of the Multiverse', 'Eberron: Forge of the Artificer'],
  confidence: 'documented',
  loreNotes: [
    'Warforged choose their own single-word names: a function, a material, or a concept. There are no family names and no birth names.',
    'The chosen name is often the first real decision a warforged made as a free person, which is why a word as plain as "Anchor" carries weight.',
    'Warforged who have not chosen, or who prefer not to, keep the series designation from the creation forge — which is why that is a separate tradition here rather than a fallback.',
  ],
  citations: [
    'https://www.dndbeyond.com/species',
    'https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf',
  ],
  traditions: [
    {
      id: 'chosen-word', label: 'A chosen word', weight: 8,
      note: 'One word, chosen by the warforged.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: { word: { kind: 'virtue', set: WARFORGED_WORD } },
      structures: [ST('word', 10, [S('given', 'word', { label: 'Chosen name' })])],
    },
    {
      id: 'designation', label: 'Forge designation', weight: 4,
      note: 'The designation from the creation forge, kept or not yet replaced.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        designation: { kind: 'phrase', set: WARFORGED_DESIGNATION },
        word: { kind: 'virtue', set: WARFORGED_WORD },
      },
      structures: [
        ST('designation-chosen', 8, [S('designation', 'designation', { label: 'Designation' }),
          S('nickname', 'word', { prefix: '“', suffix: '”', label: 'Goes by' })]),
        ST('designation', 4, [S('designation', 'designation', { label: 'Designation' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a creation forge that has gone cold', 'a demobilisation camp', 'a worksite that will not hire them',
      'a house with a door they have never been invited through'],
    sp_thing: ['a discharge certificate', 'a component from another warforged',
      'the name they were using before they chose one'],
    sp_trait: ['has no idea what to do with a day off and is working on it',
      'states their reasoning whether or not anyone asked'],
  },
};

// ===========================================================================
// AUTOGNOME
// ===========================================================================

const AUTOGNOME_UNIT: PhraseSet = {
  templates: [
    ['Unit {number}', 5],
    ['{prefix}-{number}', 5],
    ['{prefix} {number}', 3],
    ['{prefix}-{number}{letter}', 2],
  ],
  lexicon: {
    number: ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Eighteen', 'Nineteen', 'Twenty', 'Twenty-Two',
      'Twenty-Five', 'Twenty-Seven', 'Thirty-One', 'Thirty-Four', 'Thirty-Eight', 'Forty', 'Forty-Three',
      'Forty-Six', 'Fifty', 'Fifty-Five', 'Fifty-Nine', 'Sixty-Three', 'Sixty-Seven', 'Seventy-Two',
      'Seventy-Eight', 'Eighty-Four', 'Eighty-Nine', 'Ninety', 'Ninety-Six'],
    prefix: ['Cog', 'Spindle', 'Bellows', 'Gyro', 'Flux', 'Clasp', 'Ratchet', 'Burnish', 'Tock', 'Dial',
      'Pinion', 'Escapement', 'Wick', 'Coil', 'Fathom', 'Vane', 'Arbor', 'Balance', 'Barrel', 'Bezel',
      'Bushing', 'Cam', 'Chime', 'Detent', 'Fusee', 'Gasket', 'Governor', 'Hairspring', 'Jewel', 'Mainspring',
      'Pallet', 'Pawl', 'Regulator', 'Rotor', 'Shim', 'Sprocket', 'Tang', 'Torsion', 'Trundle', 'Verge'],
    letter: ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'K', 'M', 'R'],
  },
  shortFrom: ['prefix'],
};

export const AUTOGNOME: SpeciesSpec = {
  id: 'autognome', name: 'Autognome', tier: 'expanded', group: SPACE_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'partial',
  loreNotes: [
    'Autognomes are built by rock gnomes, and published material presents them as receiving a serial designation from their maker.',
    'An autognome who has outlived or outgrown its maker often picks up a gnome-style nickname, and some adopt a gnomish clan name from the family that built them.',
    'The specific designations here are original; the designation-plus-nickname shape follows the published description.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'designation', label: 'Maker’s designation', weight: 7,
      note: 'The serial designation, often with the nickname that stuck.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        unit: { kind: 'phrase', set: AUTOGNOME_UNIT },
        nickname: { kind: 'phonetic', phonology: GNOME_PHON, syllables: TERSE },
        clan: { kind: 'morph', set: GNOME_CLAN },
      },
      structures: [
        ST('unit', 6, [S('designation', 'unit', { label: 'Designation' })]),
        ST('unit-nickname', 6, [S('designation', 'unit', { label: 'Designation' }),
          S('nickname', 'nickname', { prefix: '“', suffix: '”', label: 'Called' })]),
        ST('unit-maker-clan', 3, [S('designation', 'unit', { label: 'Designation' }),
          S('clan', 'clan', { prefix: 'of ', label: 'Maker’s clan' })], { minComplexity: 3 }),
        ST('nickname-clan', 2, [S('given', 'nickname', { label: 'Name' }),
          S('clan', 'clan', { label: 'Maker’s clan' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a workshop whose owner died', 'a ship’s engine room', 'a gnomish settlement in wildspace'],
    sp_thing: ['a maintenance schedule nobody is keeping', 'a set of instructions from a maker who is gone',
      'a replacement part that does not match'],
    sp_trait: ['refers to itself by its designation and does not mind the nickname',
      'carries out a last instruction long after it stopped making sense'],
  },
};

// ===========================================================================
// PLASMOID
// ===========================================================================

const PLASMOID_SOUND: Phonology = {
  initialOnsets: [['b', 3], ['bl', 3], ['d', 2], ['f', 2], ['g', 3], ['gl', 3], ['m', 4], ['n', 3], ['p', 3],
    ['pl', 3], ['s', 2], ['sl', 3], ['sh', 2], ['v', 2], ['w', 3], ['y', 2], ['th', 2], ['wh', 2], ['br', 2],
    ['dr', 2], ['fl', 2], ['gr', 2], ['k', 2], ['kl', 2], ['t', 2], ['thr', 1], ['z', 2], ['sw', 2], ['h', 2]],
  onsets: [['b', 3], ['l', 4], ['m', 4], ['n', 3], ['p', 3], ['r', 2], ['v', 2], ['w', 2], ['g', 2], ['bb', 2],
    ['ll', 2], ['d', 2], ['z', 2], ['k', 2], ['t', 2], ['mm', 2], ['pp', 1], ['sh', 2]],
  nuclei: [['o', 8], ['u', 7], ['oo', 6], ['a', 5], ['e', 3], ['ou', 3], ['ua', 2], ['i', 3], ['ua', 2], ['uu', 2]],
  codas: [['p', 4], ['b', 3], ['m', 4], ['l', 4], ['sh', 3], ['rp', 2], ['lp', 2], ['g', 2], ['n', 2], ['k', 2],
    ['t', 2], ['mp', 2], ['lk', 1], ['z', 2], ['sk', 1]],
  finalCodas: [['p', 5], ['b', 3], ['m', 4], ['l', 3], ['sh', 3], ['g', 2], ['k', 2], ['z', 2], ['mp', 2], ['n', 2]],
  patterns: [['CVK', 6], ['CV', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
};

const PLASMOID_BORROWED: VirtueSet = {
  concepts: blend(
    w('borrowed', 'Pail', 'Spoon', 'Lantern', 'Sailcloth', 'Doorway', 'Barrel', 'Puddle', 'Sponge', 'Mortar',
      'Cistern', 'Bellows', 'Gasket', 'Tureen', 'Flask', 'Awning', 'Kettle', 'Ladle', 'Bladder', 'Bolster',
      'Basin', 'Bucket', 'Canister', 'Carafe', 'Cauldron', 'Crucible', 'Cushion', 'Decanter', 'Drum',
      'Ewer', 'Funnel', 'Gourd', 'Hamper', 'Hogshead', 'Jar', 'Jug', 'Keg', 'Mitten', 'Pannier', 'Pitcher',
      'Pouch', 'Reservoir', 'Sack', 'Satchel', 'Scuttle', 'Skin', 'Trough', 'Tub', 'Vat', 'Vessel',
      'Amphora', 'Beaker', 'Billow', 'Bladderwrack', 'Blanket', 'Bottle', 'Brine', 'Butter', 'Candlewax',
      'Churn', 'Clabber', 'Cordial', 'Cream', 'Curd', 'Dewdrop', 'Dollop', 'Drizzle', 'Froth', 'Glaze',
      'Gravy', 'Grease', 'Honeycomb', 'Inkwell', 'Jelly', 'Lather', 'Marrow', 'Molasses', 'Mudflat',
      'Oilskin', 'Ooze', 'Paste', 'Porridge', 'Pudding', 'Quicksand', 'Resin', 'Rivulet', 'Seepage',
      'Sluice', 'Slurry', 'Soap', 'Spillway', 'Suet', 'Syrup', 'Tallowdrop', 'Tapioca', 'Tidepool',
      'Treacle', 'Washbasin', 'Wax', 'Whey', 'Yeast'),
    retag(CONCEPTS, 'borrowed'),
  ),
  qualifierChance: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export const PLASMOID: SpeciesSpec = {
  id: 'plasmoid', name: 'Plasmoid', tier: 'expanded', group: SPACE_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'partial',
  loreNotes: [
    'Plasmoids communicate in vibrations and take names that are either the closest sound they can produce or a word borrowed from whoever they are living among.',
    'There is no inherited name and no family name; a plasmoid’s name is entirely self-chosen.',
    'Both traditions below follow that published description. The specific sounds and borrowed words are original.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'own-sound', label: 'A sound they can make', weight: 6,
      note: 'The nearest thing to a name a plasmoid can produce unaided.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: { sound: { kind: 'phonetic', phonology: PLASMOID_SOUND, syllables: SHORT } },
      structures: [ST('sound', 10, [S('given', 'sound', { label: 'Name' })])],
    },
    {
      id: 'borrowed', label: 'A borrowed word', weight: 5,
      note: 'A word a plasmoid heard, liked, and kept.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        borrowed: { kind: 'virtue', set: PLASMOID_BORROWED },
        sound: { kind: 'phonetic', phonology: PLASMOID_SOUND, syllables: SHORT },
      },
      structures: [
        ST('borrowed', 1.5, [S('given', 'borrowed', { label: 'Borrowed name' })]),
        ST('borrowed-sound', 8, [S('given', 'borrowed', { label: 'Borrowed name' }),
          S('nickname', 'sound', { prefix: '(', suffix: ')', label: 'To other plasmoids' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a ship’s hold', 'a vacuum-exposed deck', 'a port that has no rules about their shape'],
    sp_thing: ['a container they consider a change of clothes', 'a word they chose because they liked the shape'],
    sp_trait: ['pours through gaps without thinking about it', 'is relaxed about being looked at'],
  },
};

// ===========================================================================
// GIFF
// ===========================================================================

const GIFF_PHON: Phonology = {
  initialOnsets: [['b', 4], ['br', 3], ['d', 3], ['g', 4], ['gr', 3], ['h', 3], ['k', 3], ['m', 3], ['n', 2],
    ['p', 3], ['r', 2], ['s', 3], ['st', 3], ['t', 3], ['th', 2], ['v', 2], ['w', 2], ['f', 3], ['bl', 2], ['tr', 2]],
  onsets: [['b', 3], ['d', 3], ['f', 3], ['g', 3], ['l', 3], ['m', 3], ['n', 3], ['r', 3], ['s', 3], ['t', 3],
    ['v', 2], ['k', 2], ['ff', 2], ['dd', 1], ['mm', 1]],
  nuclei: [['a', 7], ['o', 7], ['u', 6], ['e', 5], ['i', 5]],
  codas: [['ff', 4], ['m', 4], ['n', 4], ['r', 3], ['t', 3], ['k', 3], ['b', 2], ['ld', 2], ['rt', 2], ['mp', 2],
    ['rk', 2], ['st', 2]],
  finalCodas: [['ff', 4], ['m', 4], ['n', 4], ['r', 3], ['t', 3], ['k', 2], ['rt', 2], ['ld', 2]],
  patterns: [['CVK', 7], ['CV', 4]],
  finalPatterns: [['CVK', 8], ['CV', 2]],
  maxJunctureCluster: 3,
  endings: {
    masculine: [['um', 2], ['ard', 2], ['on', 2], ['us', 2], ['ric', 1]],
    feminine: [['a', 3], ['ina', 2], ['etta', 2], ['ora', 2], ['ilda', 1]],
    neutral: [['en', 2], ['or', 2], ['am', 2], ['ut', 2], ['ell', 2]],
  },
  maxLength: 11,
};

const GIFF_SURNAME: CompoundSet = {
  first: blend(retag(STRUCTURES, 'thing'), retag(CRAFT_TOOLS, 'thing'), retag(METALS, 'material'),
    w('mil', 'powder', 'ramrod', 'volley', 'bulwark', 'standard', 'colour', 'parade', 'muster', 'drill',
      'barrack', 'bastion', 'rampart', 'quarter', 'hullplate')),
  second: lower(w('tail', 'worthy', 'bold', 'stead', 'ton', 'ford', 'borough', 'hall', 'gate', 'mark',
    'well', 'field', 'hurst', 'thwaite', 'combe')),
  avoidSharedTags: ['thing', 'material', 'mil'],
  casing: 'fused',
};

export const GIFF: SpeciesSpec = {
  id: 'giff', name: 'Giff', tier: 'expanded', group: SPACE_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'documented',
  loreNotes: [
    'A giff does not omit their rank. Published material is consistent on this: the rank is part of the name, and even a retired giff keeps the last one they held.',
    'The surname is a sturdy compound in the Common tongue; the personal name is short and plosive.',
    'Rank is a closed set, which is why it is the one place in this generator where a fixed list is the correct model.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'rank', label: 'Rank and name', weight: 10,
      note: 'Rank first, always — then the personal name and the family name.',
      genderPolicy: 'mixed',
      backgroundInfluence: { epithet: true, title: false, byname: false },
      producers: {
        rank: { kind: 'closed', items: [
          ['Private', 2], ['Corporal', 3], ['Sergeant', 4], ['Colour Sergeant', 2], ['Sergeant Major', 2],
          ['Ensign', 2], ['Lieutenant', 4], ['Captain', 4], ['Major', 3], ['Commodore', 2], ['Quartermaster', 2],
          ['Bombardier', 3], ['Gunner', 3], ['Master Gunner', 2], ['Sapper', 2], ['Pilot Officer', 2],
          ['Chief Petty Officer', 1], ['Brevet Major', 1], ['Honorary Colonel', 1],
        ] },
        given: { kind: 'phonetic', phonology: GIFF_PHON, syllables: SHORT },
        family: { kind: 'compound', set: GIFF_SURNAME },
      },
      structures: [
        ST('rank-given-family', 9, [S('title', 'rank', { label: 'Rank' }), S('given', 'given'),
          S('family', 'family', { label: 'Family' })]),
        ST('rank-family', 4, [S('title', 'rank', { label: 'Rank' }), S('family', 'family', { label: 'Family' })]),
        ST('rank-given', 3, [S('title', 'rank', { label: 'Rank' }), S('given', 'given')]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a company that no longer exists', 'a gunnery deck', 'a parade ground on an asteroid'],
    sp_thing: ['a commission signed by someone long dead', 'a firearm maintained beyond all reason',
      'a rank they were brevetted to and never confirmed in'],
    sp_trait: ['addresses everyone by their correct title and expects the same',
      'finds the absence of a chain of command genuinely distressing'],
  },
};

// ===========================================================================
// HADOZEE
// ===========================================================================

const HADOZEE_PHON: Phonology = {
  initialOnsets: [['b', 3], ['ch', 3], ['d', 3], ['f', 2], ['g', 3], ['h', 3], ['j', 3], ['k', 3], ['l', 2],
    ['m', 3], ['n', 2], ['p', 3], ['r', 2], ['s', 3], ['sh', 3], ['t', 3], ['v', 2], ['w', 2], ['y', 2],
    ['z', 3], ['tch', 1]],
  onsets: [['b', 2], ['ch', 2], ['d', 3], ['k', 3], ['l', 3], ['m', 3], ['n', 3], ['p', 3], ['r', 3], ['s', 3],
    ['t', 3], ['z', 3], ['sh', 2], ['zz', 2], ['ee', 1]],
  nuclei: [['ee', 6], ['a', 7], ['i', 6], ['o', 5], ['u', 4], ['oo', 3], ['e', 4]],
  codas: [['z', 4], ['k', 3], ['sh', 3], ['t', 3], ['p', 2], ['m', 2], ['n', 3], ['ch', 2]],
  finalCodas: [['z', 5], ['k', 3], ['sh', 3], ['t', 2], ['p', 2], ['n', 2]],
  patterns: [['CV', 6], ['CVK', 5]],
  finalPatterns: [['CV', 5], ['CVK', 5]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['ee', 3], ['oz', 2], ['ak', 2], ['im', 2], ['us', 1]],
    feminine: [['a', 3], ['ee', 3], ['ika', 2], ['ozza', 1], ['ina', 2]],
    neutral: [['ee', 4], ['oz', 2], ['ik', 2], ['ash', 2], ['um', 2]],
  },
  maxLength: 11,
};

const HADOZEE_SHIP: CompoundSet = {
  first: blend(retag(BEARING, 'q'),
    w('q', 'top', 'fore', 'aft', 'high', 'free', 'long', 'quick', 'glide', 'wind', 'lee', 'open', 'spar')),
  second: lower(w('tail', 'spar', 'rigging', 'brace', 'yard', 'sheet', 'shroud', 'mast', 'line', 'deck',
    'ratline', 'topsail', 'crosstree', 'halyard', 'boom')),
  avoidSharedTags: ['q'],
  casing: 'fused',
};

export const HADOZEE: SpeciesSpec = {
  id: 'hadozee', name: 'Hadozee', tier: 'expanded', group: SPACE_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'original',
  loreNotes: [
    'No hadozee name table has been published. The sourcebook establishes them as a spacefaring people with a deep shipboard culture and a strong sense of crew.',
    'This is therefore an original naming grammar: short bright names with a crew or rigging name attached, built on the documented shipboard culture. It is marked original.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'crew', label: 'Name and berth', weight: 10,
      note: 'A short name with the part of the rigging a hadozee works.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: HADOZEE_PHON, syllables: SHORT },
        berth: { kind: 'compound', set: HADOZEE_SHIP },
      },
      structures: [
        ST('given-berth', 7, [S('given', 'given'), S('family', 'berth', { label: 'Berth' })]),
        ST('given-alone', 5, [S('given', 'given')]),
        ST('given-of-berth', 2, [S('given', 'given'), S('family', 'berth', { prefix: 'of the ', label: 'Berth' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a ship that was sold out from under the crew', 'a rigging loft', 'a port with no gravity'],
    sp_thing: ['a share certificate in a vessel nobody can find', 'a glide membrane with an old tear'],
    sp_trait: ['walks on rigging as readily as on a floor', 'thinks of a crew as a legal family'],
  },
};

// ===========================================================================
// THRI-KREEN
// ===========================================================================

const THRIKREEN_PHON: Phonology = {
  initialOnsets: [['k', 5], ['kr', 4], ['ch', 3], ['t', 4], ['tk', 3], ['th', 2], ['s', 3], ['sk', 3], ['sh', 2],
    ['tr', 3], ['p', 2], ['kl', 2], ['x', 2], ['z', 2], ['r', 2], ['n', 2], ['m', 2]],
  onsets: [['k', 5], ['kk', 3], ['t', 4], ['tt', 2], ['r', 3], ['ch', 3], ['s', 3], ['ss', 2], ['kr', 2],
    ['l', 2], ['n', 2], ['z', 2], ['x', 1]],
  nuclei: [['i', 8], ['ee', 7], ['a', 6], ['e', 4], ['ii', 3], ['o', 2], ['u', 2]],
  initialNuclei: [['i', 7], ['ee', 6], ['a', 7], ['e', 4], ['o', 2]],
  codas: [['k', 6], ['kk', 4], ['t', 4], ['ch', 3], ['k', 3], ['ss', 3], ['x', 2], ['sk', 2], ['tk', 1], ['n', 2]],
  finalCodas: [['k', 6], ['kk', 4], ['t', 3], ['ch', 3], ['ss', 2], ['x', 2]],
  patterns: [['CVK', 9], ['CV', 2]],
  finalPatterns: [['CVK', 10]],
  internalMark: { mark: "'", chance: 0.22 },
  maxJunctureCluster: 3,
  maxRepeatLetter: 2,
};

export const THRI_KREEN: SpeciesSpec = {
  id: 'thri-kreen', name: 'Thri-kreen', tier: 'expanded', group: SPACE_GROUP,
  sources: ['Spelljammer: Astral Adventurer’s Guide'],
  confidence: 'partial',
  loreNotes: [
    'Thri-kreen names published across editions are built from clicking, chirping consonants and are commonly written with apostrophes and doubled letters.',
    'Thri-kreen identify by clutch rather than by family, and many thri-kreen communicate partly through pheromone and posture that written Common cannot represent — so a written name is only part of it.',
    'The clutch names here are original; the sound profile follows published examples.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'clutch', label: 'Click-name and clutch', weight: 10,
      note: 'A clicking name, with the clutch a thri-kreen hatched into.',
      genderPolicy: 'neutral',
      producers: {
        given: { kind: 'phonetic', phonology: THRIKREEN_PHON, syllables: SHORT },
        clutch: { kind: 'phonetic', phonology: THRIKREEN_PHON, syllables: MEDIUM },
      },
      structures: [
        ST('given-alone', 7, [S('given', 'given')]),
        ST('given-clutch', 6, [S('given', 'given'), S('clan', 'clutch', { prefix: 'of ', label: 'Clutch' })]),
        ST('given-clutch-plain', 2, [S('given', 'given'), S('clan', 'clutch', { label: 'Clutch' })],
          { minComplexity: 3 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a desert that is now a shipping lane', 'a clutch-nest', 'a hold they can hang from'],
    sp_thing: ['a weapon made from something that used to be part of them',
      'a smell-memory nobody else can access'],
    sp_trait: ['does not sleep and finds the concept faintly alarming',
      'produces a clicking sound when thinking hard'],
  },
};

// ===========================================================================
// SIMIC HYBRID
// ===========================================================================

const SIMIC_DESIGNATION: PhraseSet = {
  templates: [
    ['{line}-{number}', 5],
    ['{line} {number}', 3],
    ['{line}-{number}{letter}', 3],
  ],
  lexicon: {
    line: ['Krasis', 'Zameck', 'Vedalis', 'Tidewater', 'Deepfin', 'Carapace', 'Chromid', 'Riverine',
      'Sporeline', 'Gyre', 'Mantle', 'Nacre', 'Baleen', 'Cilia', 'Frond', 'Medusa', 'Nautilus', 'Polyp',
      'Spiracle', 'Tendril', 'Vellum', 'Zoea'],
    number: ['Two', 'Three', 'Four', 'Six', 'Seven', 'Nine', 'Eleven', 'Twelve', 'Fourteen', 'Seventeen',
      'Twenty', 'Twenty-Four', 'Twenty-Eight', 'Thirty-Three', 'Thirty-Six', 'Forty-One', 'Forty-Five',
      'Fifty-Two', 'Sixty', 'Sixty-Six', 'Seventy-One', 'Eighty-Eight'],
    letter: ['A', 'B', 'C', 'D', 'G', 'K', 'M', 'R', 'V'],
  },
  shortFrom: ['line'],
};

export const SIMIC_HYBRID: SpeciesSpec = {
  id: 'simic-hybrid', name: 'Simic Hybrid', tier: 'expanded', group: CONSTRUCT_GROUP,
  sources: ['Guildmasters’ Guide to Ravnica'],
  confidence: 'documented',
  loreNotes: [
    'A simic hybrid began as a member of another Ravnican people and was altered by the Simic Combine, so they keep the name they already had.',
    'Alongside that name a hybrid carries a specimen designation from the laboratory that performed the work; some use it, most do not.',
    'This entry uses the common-tongue registers for the personal name and says so, rather than inventing a "hybrid language".',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'original-name', label: 'The name they already had', weight: 7,
      note: 'The name from before the alteration.',
      genderPolicy: 'mixed',
      backgroundInfluence: { byname: true, epithet: true, title: true },
      producers: {
        given: COMMON_GIVEN,
        family: COMMON_SURNAME,
        designation: { kind: 'phrase', set: SIMIC_DESIGNATION },
      },
      structures: [
        ST('given-family', 7, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-alone', 3, [S('given', 'given')]),
        ST('given-family-designation', 3, [S('given', 'given'), S('family', 'family', { label: 'Family' }),
          S('designation', 'designation', { separator: ' · ', label: 'Specimen' })], { minComplexity: 3 }),
      ],
    },
    {
      id: 'specimen', label: 'Specimen designation', weight: 3,
      note: 'The laboratory designation, used by hybrids who prefer it.',
      genderPolicy: 'neutral',
      backgroundInfluence: { epithet: false },
      producers: {
        designation: { kind: 'phrase', set: SIMIC_DESIGNATION },
        given: COMMON_GIVEN,
      },
      structures: [
        ST('designation', 6, [S('designation', 'designation', { label: 'Specimen' })]),
        ST('designation-given', 4, [S('designation', 'designation', { label: 'Specimen' }),
          S('nickname', 'given', { prefix: '“', suffix: '”', label: 'Goes by' })], { minComplexity: 2 }),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a Simic laboratory', 'a flooded district', 'a guild hall that counts them as equipment'],
    sp_thing: ['a consent form with ambiguous wording', 'an adaptation that was not requested',
      'a specimen file they have read'],
    sp_trait: ['describes their own body in the third person out of habit',
      'is matter-of-fact about things other people find horrifying'],
  },
};

// ===========================================================================
// VEDALKEN
// ===========================================================================

const VEDALKEN_PHON: Phonology = {
  initialOnsets: [['b', 3], ['br', 2], ['d', 3], ['dr', 2], ['f', 2], ['g', 2], ['h', 2], ['j', 2], ['k', 3],
    ['kl', 2], ['l', 3], ['m', 3], ['n', 3], ['p', 3], ['pr', 2], ['r', 2], ['s', 3], ['sk', 2], ['sl', 2],
    ['t', 3], ['tr', 2], ['v', 3], ['z', 2], ['vr', 2], ['thr', 1]],
  onsets: [['d', 3], ['k', 3], ['l', 4], ['m', 3], ['n', 4], ['r', 3], ['s', 3], ['t', 3], ['v', 3], ['z', 2],
    ['b', 2], ['g', 2], ['dr', 1], ['st', 1]],
  nuclei: [['a', 6], ['e', 7], ['i', 7], ['o', 5], ['u', 4], ['ae', 2], ['ei', 2]],
  codas: [['n', 5], ['l', 4], ['r', 4], ['s', 3], ['k', 3], ['t', 3], ['m', 2], ['st', 2], ['sk', 1], ['ld', 1]],
  finalCodas: [['n', 5], ['l', 4], ['r', 3], ['s', 3], ['k', 3], ['t', 2], ['m', 2]],
  patterns: [['CVK', 6], ['CV', 5]],
  finalPatterns: [['CVK', 6], ['CV', 4]],
  maxJunctureCluster: 2,
  endings: {
    masculine: [['en', 3], ['os', 2], ['ir', 2], ['av', 2], ['ek', 2], ['ium', 1]],
    feminine: [['a', 3], ['is', 2], ['ava', 2], ['ine', 2], ['eska', 2]],
    neutral: [['en', 3], ['is', 3], ['ek', 2], ['ar', 2], ['ul', 2]],
  },
  maxLength: 13,
};

const VEDALKEN_DISCIPLINE: MorphSet = {
  initial: [
    m('Hydro', 'water'), m('Crypt', 'hidden'), m('Chrono', 'time'), m('Litho', 'stone'), m('Pneu', 'air'),
    m('Thermo', 'heat'), m('Nocti', 'night'), m('Aqui', 'depth'), m('Meta', 'beyond'), m('Proto', 'first'),
    m('Xeno', 'other'), m('Syn', 'together'), m('Dia', 'across'), m('Micro', 'small'), m('Macro', 'large'),
  ],
  final: [
    m('mancer', 'practitioner'), m('grapher', 'recorder'), m('metrist', 'measurer'), m('logist', 'student'),
    m('wright', 'maker'), m('scopist', 'observer'), m('taxist', 'orderer'), m('synth', 'combiner'),
    m('nomist', 'lawgiver'), m('tector', 'detector'),
  ],
  linkers: [['', 10]],
  partsByComplexity: { 1: [2], 2: [2], 3: [2], 4: [2], 5: [2] },
};

export const VEDALKEN: SpeciesSpec = {
  id: 'vedalken', name: 'Vedalken', tier: 'expanded', group: CONSTRUCT_GROUP,
  sources: ['Guildmasters’ Guide to Ravnica'],
  confidence: 'partial',
  loreNotes: [
    'Vedalken published for Ravnica are defined by precision and the pursuit of perfection, and their names read as formal and measured.',
    'A vedalken is commonly identified by their field of study as much as by a family name, which is the basis for the discipline-name tradition here.',
    'The specific vocabulary is original; the formal register follows the published characterisation.',
  ],
  citations: ['https://www.dndbeyond.com/species'],
  traditions: [
    {
      id: 'formal', label: 'Formal name and discipline', weight: 10,
      note: 'A precise personal name, given with the field a vedalken works in.',
      genderPolicy: 'mixed',
      producers: {
        given: { kind: 'phonetic', phonology: VEDALKEN_PHON, syllables: MEDIUM },
        family: { kind: 'phonetic', phonology: VEDALKEN_PHON, syllables: LONG },
        discipline: { kind: 'morph', set: VEDALKEN_DISCIPLINE },
      },
      structures: [
        ST('given-family', 7, [S('given', 'given'), S('family', 'family', { label: 'Family' })]),
        ST('given-family-discipline', 5, [S('given', 'given'), S('family', 'family', { label: 'Family' }),
          S('title', 'discipline', { separator: ', ', label: 'Discipline' })], { minComplexity: 2 }),
        ST('given-discipline', 3, [S('given', 'given'),
          S('title', 'discipline', { separator: ', ', label: 'Discipline' })]),
      ],
    },
  ],
  hookVocabulary: {
    sp_place: ['a research institute', 'a guild laboratory', 'a measurement standards office'],
    sp_thing: ['a paper nine years from completion', 'an instrument calibrated to an absurd tolerance',
      'a correction nobody has accepted'],
    sp_trait: ['restates your question more precisely before answering it',
      'is genuinely upset by approximation'],
  },
};

export const CONSTRUCTS_SPECIES: SpeciesSpec[] = [
  WARFORGED, AUTOGNOME, PLASMOID, GIFF, HADOZEE, THRI_KREEN, SIMIC_HYBRID, VEDALKEN,
];
