/**
 * Shared word palette.
 *
 * These are English-language building blocks for *transparent* name elements —
 * compound family names, earned epithets, descriptive phrases. Species files
 * pick the subsets their culture would plausibly draw on and add their own.
 *
 * Nothing here is copied from a published name table; these are ordinary
 * English words assembled into original combinations at run time.
 */

import type { Morpheme } from '../../types/index.ts';

/** Morpheme whose gloss is just the word itself. */
export function w(tag: string, ...forms: string[]): Morpheme[] {
  return forms.map((form) => ({ form, meaning: form, tags: [tag] }));
}

/** Morpheme with an explicit gloss, for invented-language stems. */
export function m(form: string, meaning: string, tags: string[] = [], weight = 1): Morpheme {
  return { form, meaning, tags, weight };
}

// ---------------------------------------------------------------------------
// Material world
// ---------------------------------------------------------------------------

export const METALS = w('metal',
  'iron', 'steel', 'bronze', 'silver', 'gold', 'copper', 'brass', 'tin', 'pewter', 'quicksilver', 'ore', 'slag');

export const STONE = w('stone',
  'stone', 'granite', 'slate', 'flint', 'marble', 'quartz', 'obsidian', 'basalt', 'boulder', 'shale', 'agate', 'chalk');

export const GEMS = w('gem',
  'amber', 'garnet', 'opal', 'jade', 'onyx', 'pearl', 'topaz', 'beryl', 'jasper', 'emerald', 'sapphire', 'crystal');

export const WEATHER = w('weather',
  'storm', 'frost', 'thunder', 'rain', 'snow', 'mist', 'gale', 'hail', 'fog', 'wind', 'cloud', 'squall', 'drizzle', 'sleet');

export const FIRE = w('fire',
  'ember', 'flame', 'cinder', 'ash', 'smoke', 'coal', 'spark', 'blaze', 'soot', 'kindle');

export const LIGHT = w('light',
  'sun', 'moon', 'star', 'dusk', 'dawn', 'twilight', 'gloam', 'noon', 'shade', 'shadow', 'glimmer', 'glow', 'dark', 'bright');

export const COLOURS = w('colour',
  'white', 'black', 'red', 'green', 'blue', 'grey', 'golden', 'silver', 'copper', 'amber', 'russet', 'pale', 'dun', 'hoar');

// ---------------------------------------------------------------------------
// Landscape
// ---------------------------------------------------------------------------

export const HIGHLAND = w('land',
  'hill', 'ridge', 'crag', 'peak', 'cliff', 'scarp', 'tor', 'bluff', 'summit', 'slope', 'spur', 'pass');

export const LOWLAND = w('land',
  'dale', 'dell', 'glen', 'vale', 'hollow', 'meadow', 'heath', 'moor', 'fen', 'marsh', 'bottom', 'downs', 'common', 'greens');

export const WATER = w('water',
  'river', 'brook', 'tide', 'wave', 'spring', 'falls', 'pool', 'creek', 'shoal', 'current', 'foam', 'eddy', 'mere', 'ford', 'rill');

export const DEEP_PLACES = w('deep',
  'delve', 'vault', 'deep', 'hollow', 'burrow', 'tunnel', 'cavern', 'shaft', 'undergloom', 'warren');

// ---------------------------------------------------------------------------
// Growing things
// ---------------------------------------------------------------------------

export const TREES = w('tree',
  'oak', 'ash', 'elm', 'birch', 'willow', 'pine', 'cedar', 'rowan', 'alder', 'hazel', 'yew', 'holly', 'aspen', 'maple', 'linden');

export const UNDERGROWTH = w('plant',
  'briar', 'thorn', 'moss', 'fern', 'reed', 'vine', 'root', 'leaf', 'bloom', 'seed', 'bark', 'bramble', 'clover', 'nettle',
  'thistle', 'heather', 'sedge', 'ivy');

export const HARVEST = w('harvest',
  'barley', 'wheat', 'apple', 'honey', 'hop', 'cider', 'bramble', 'mellow', 'orchard', 'pumpkin', 'plum', 'turnip', 'hearth');

// ---------------------------------------------------------------------------
// Creatures
// ---------------------------------------------------------------------------

export const BIRDS = w('bird',
  'hawk', 'raven', 'wren', 'crow', 'owl', 'lark', 'swift', 'heron', 'kite', 'finch', 'rook', 'gull', 'falcon', 'starling');

export const BEASTS = w('beast',
  'hart', 'fox', 'boar', 'bear', 'otter', 'badger', 'hound', 'stoat', 'mole', 'hare', 'elk', 'lynx', 'marten', 'ram', 'ox', 'doe');

export const SEA_LIFE = w('sea',
  'shark', 'ray', 'eel', 'urchin', 'coral', 'kelp', 'nautilus', 'barnacle', 'lamprey', 'conch', 'anemone', 'crab');

// ---------------------------------------------------------------------------
// Body and bearing — the raw material of earned nicknames
// ---------------------------------------------------------------------------

export const BODY = w('body',
  'beard', 'brow', 'fist', 'hand', 'heart', 'eye', 'tooth', 'shoulder', 'back', 'foot', 'spine', 'bone', 'blood', 'voice',
  'step', 'grip', 'jaw', 'thumb', 'knuckle', 'shin', 'palm', 'tongue');

export const BEARING = w('bearing',
  'steady', 'quiet', 'quick', 'slow', 'sure', 'bold', 'wary', 'patient', 'restless', 'stubborn', 'gentle', 'keen', 'dour',
  'merry', 'grim', 'spry', 'canny', 'soft', 'hard', 'true');

// ---------------------------------------------------------------------------
// Craft and work
// ---------------------------------------------------------------------------

export const CRAFT_TOOLS = w('craft',
  'forge', 'anvil', 'hammer', 'chisel', 'loom', 'kiln', 'mill', 'bellows', 'tongs', 'awl', 'plane', 'lathe', 'quill', 'ladle');

export const AGENTS = w('agent',
  'finder', 'walker', 'singer', 'breaker', 'binder', 'mender', 'keeper', 'warden', 'carver', 'weaver', 'teller', 'seeker',
  'watcher', 'shaper', 'forger', 'caller', 'bearer', 'wright', 'smith', 'tender', 'reader', 'counter', 'sorter', 'gatherer',
  'stacker', 'splitter', 'hauler', 'trimmer', 'piler', 'minder');

export const STRUCTURES = w('built',
  'gate', 'bridge', 'tower', 'wall', 'hearth', 'door', 'arch', 'stair', 'bench', 'well', 'barrow', 'cairn', 'keep', 'bell');

// ---------------------------------------------------------------------------
// Abstractions — virtue names, chosen names, construct names
// ---------------------------------------------------------------------------

export const VIRTUES = w('virtue',
  'Hope', 'Mercy', 'Patience', 'Candour', 'Reverence', 'Sorrow', 'Quiet', 'Ardour', 'Temperance', 'Vigil',
  'Grace', 'Resolve', 'Clemency', 'Constancy', 'Forbearance', 'Wonder', 'Devotion', 'Solace', 'Prudence',
  'Valour', 'Charity', 'Fortitude', 'Diligence', 'Humility', 'Honesty', 'Courtesy', 'Justice', 'Gratitude',
  'Restraint', 'Loyalty', 'Kindness', 'Wisdom', 'Courage', 'Fidelity', 'Modesty', 'Sincerity', 'Generosity',
  'Discretion', 'Industry', 'Steadiness', 'Compassion', 'Conscience', 'Duty', 'Faith', 'Honour', 'Vigilance');

export const CONCEPTS = w('concept',
  'Echo', 'Threshold', 'Lantern', 'Compass', 'Ledger', 'Harbour', 'Verdict', 'Remnant', 'Interval', 'Prospect',
  'Margin', 'Circumstance', 'Consequence', 'Errand', 'Prologue', 'Appetite', 'Rumour', 'Precedent', 'Inventory',
  'Aperture', 'Ballast', 'Cadence', 'Caesura', 'Codicil', 'Contour', 'Corollary', 'Covenant', 'Crossing',
  'Daybook', 'Detour', 'Distance', 'Drift', 'Emblem', 'Ending', 'Epilogue', 'Equinox', 'Estuary', 'Fathom',
  'Fulcrum', 'Gradient', 'Horizon', 'Increment', 'Indenture', 'Junction', 'Keystone', 'Latitude', 'Lattice',
  'Manifest', 'Meridian', 'Narrative', 'Obverse', 'Omen', 'Outset', 'Overture', 'Parallax', 'Passage',
  'Pendulum', 'Perigee', 'Pilgrim', 'Plumbline', 'Quorum', 'Reckoning', 'Register', 'Remittance', 'Respite',
  'Sequel', 'Signal', 'Soundings', 'Sundial', 'Surplus', 'Tangent', 'Tenancy', 'Testament', 'Tideline',
  'Transit', 'Trellis', 'Tributary', 'Umbrage', 'Vantage', 'Verge', 'Vestibule', 'Warrant', 'Watershed',
  'Waypoint', 'Witness', 'Yardstick', 'Zenith');

/**
 * Chosen names taken from adverbs and connectives — a documented tiefling
 * habit. Tagged `bare` because a qualifier in front of one ("Borrowed
 * Meanwhile") is not a name, it is a typo.
 */
export const ADVERBIAL_CONCEPTS = w('bare',
  'Nevertheless', 'Almost', 'Elsewhere', 'Seldom', 'Hereafter', 'Nowhere', 'Anyway', 'Perhaps', 'Instead',
  'Meanwhile', 'Afterward', 'Otherwise', 'Regardless', 'Henceforth', 'Notwithstanding', 'Whereupon',
  'Somewhere', 'Anywhere', 'Rarely', 'Barely', 'Lately', 'Presently', 'Thereafter', 'Howsoever', 'Moreover',
  'Likewise', 'Accordingly', 'Evermore', 'Sometimes', 'Nonetheless', 'Hitherto', 'Nearly', 'Enough', 'Onward');

export const DARK_CONCEPTS = w('concept',
  'Carrion', 'Dirge', 'Famine', 'Ruin', 'Lament', 'Blight', 'Gallows', 'Cinder', 'Winter', 'Fallow', 'Tally',
  'Debt', 'Penance', 'Verdigris', 'Tithe', 'Embers', 'Vespers', 'Arrears', 'Sundown', 'Hollow', 'Attrition',
  'Blackfrost', 'Cankerwood', 'Censure', 'Cessation', 'Deadlight', 'Deficit', 'Desolation', 'Downturn',
  'Driftwood', 'Dusklight', 'Effigy', 'Entropy', 'Exile', 'Forfeiture', 'Frostbite', 'Grievance', 'Hoarfrost',
  'Illwater', 'Lastlight', 'Longnight', 'Millstone', 'Murrain', 'Nightjar', 'Obloquy', 'Ossuary', 'Quarantine',
  'Reproach', 'Residue', 'Rimefall', 'Sediment', 'Shortfall', 'Silt', 'Slackwater', 'Sleetfall', 'Smoulder',
  'Stillbirth', 'Thornfield', 'Umbrage', 'Wane', 'Wintering', 'Withering');

/**
 * Qualifiers must read as adjectives: they sit directly in front of an
 * abstract noun ("Unbroken Vigil"), so adverbs like "Scarcely" produce
 * ungrammatical names and are deliberately absent.
 */
export const QUALIFIERS = w('qualifier',
  'Unbroken', 'Unbidden', 'Undimmed', 'Quiet', 'Lesser', 'Greater', 'Latter', 'Former', 'Second', 'Last',
  'First', 'Late', 'Early', 'Sudden', 'Certain', 'Common', 'Uncommon', 'Plain', 'Lone', 'Bitter', 'Steady',
  'Narrow', 'Open', 'Wide', 'Far', 'Small', 'True', 'Half', 'Patient', 'Borrowed');

// ---------------------------------------------------------------------------
// Numbers and quantifiers — used by descriptive-phrase traditions
// ---------------------------------------------------------------------------

export const SMALL_NUMBERS = w('number',
  'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve');

/** Convenience: concatenate several palettes. */
export function blend(...groups: Morpheme[][]): Morpheme[] {
  const seen = new Set<string>();
  const out: Morpheme[] = [];
  for (const group of groups) {
    for (const item of group) {
      const key = item.form.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

/** Re-tag a palette (e.g. reuse BEASTS as the second half of a compound). */
export function retag(group: Morpheme[], tag: string): Morpheme[] {
  return group.map((item) => ({ ...item, tags: [tag] }));
}

/** Lower-case a palette, for the trailing half of fused compounds. */
export function lower(group: Morpheme[]): Morpheme[] {
  return group.map((item) => ({ ...item, form: item.form.toLowerCase() }));
}
