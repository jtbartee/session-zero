/**
 * Session Zero — core type definitions.
 *
 * The naming engine deliberately keeps *data* (what a culture's names look like)
 * separate from *logic* (how a name is assembled). Everything in this file
 * describes the data contract; `src/engine/` consumes it.
 */

// ---------------------------------------------------------------------------
// Scalars and enums
// ---------------------------------------------------------------------------

/** Where a species/background came from, for grouping in the UI. */
export type Tier = 'core' | 'expanded';

/** How confident we are that a naming spec reflects published lore. */
export type Confidence =
  /** Structure and phonetic flavour are described in official material. */
  | 'documented'
  /** Some official guidance exists; the rest is an original extrapolation. */
  | 'partial'
  /** No published naming guidance; an original grammar built to not contradict lore. */
  | 'original';

/** User-facing style dial. */
export type NameStyle = 'traditional' | 'distinctive' | 'wild';

/**
 * Preferred naming *presentation*. This describes the sound/shape a user wants,
 * not a character's identity or biology. Many cultures ignore it entirely.
 */
export type GenderStyle = 'any' | 'masculine' | 'feminine' | 'neutral';

/** Resolved gender key used inside producers (never 'any'). */
export type GenderKey = 'masculine' | 'feminine' | 'neutral';

/** Simple (1) → Elaborate (5). */
export type Complexity = 1 | 2 | 3 | 4 | 5;

/** What a component contributes to the assembled name. */
export type SlotRole =
  | 'given'
  | 'family'
  | 'clan'
  | 'epithet'
  | 'nickname'
  | 'title'
  | 'descriptor'
  | 'designation'
  | 'birthname';

// ---------------------------------------------------------------------------
// Weighted choice
// ---------------------------------------------------------------------------

/** A value paired with a selection weight. Tuple form keeps data files terse. */
export type Weighted<T> = readonly [value: T, weight: number];

/** Either a bare list (all weight 1) or an explicitly weighted list. */
export type Choices<T> = readonly T[] | readonly Weighted<T>[];

// ---------------------------------------------------------------------------
// Phonology — for phoneme-driven name construction
// ---------------------------------------------------------------------------

/**
 * Syllable shape. `C` = onset (may be a cluster), `V` = nucleus (may be a
 * diphthong), `K` = coda (may be a cluster). Only these three symbols exist;
 * clusters live in the component lists rather than in the pattern string.
 */
export type SyllablePattern = 'V' | 'CV' | 'VK' | 'CVK';

export interface Phonology {
  /** Onsets available in non-initial syllables. */
  onsets: Choices<string>;
  /** Onsets allowed word-initially. Defaults to `onsets`. */
  initialOnsets?: Choices<string>;
  /** Vowel nuclei, including diphthongs. */
  nuclei: Choices<string>;
  /** Nuclei preferred in the first syllable. Defaults to `nuclei`. */
  initialNuclei?: Choices<string>;
  /** Codas in non-final syllables. */
  codas: Choices<string>;
  /** Codas allowed word-finally. Defaults to `codas`. */
  finalCodas?: Choices<string>;
  /** Syllable shapes and how often each occurs. */
  patterns: Choices<SyllablePattern>;
  /** Shapes preferred for the final syllable (e.g. open endings). */
  finalPatterns?: Choices<SyllablePattern>;
  /**
   * Terminations appended after the final nucleus to colour a name by
   * presentation style. Applied only when the tradition is `gendered`.
   */
  endings?: Partial<Record<GenderKey, Choices<string>>>;
  /** Regex sources rejected anywhere in the assembled word. */
  forbid?: readonly string[];
  /** Strings that may never appear across a syllable boundary. */
  forbidJunctures?: readonly string[];
  /** Punctuation inserted between syllables, with the chance of doing so. */
  internalMark?: { mark: string; chance: number };
  /** Hard cap on identical adjacent letters (default 2). */
  maxRepeatLetter?: number;
  /**
   * Total consonant letters allowed where a coda meets the next onset
   * (default 3). Raise it for deliberately harsh phonologies.
   */
  maxJunctureCluster?: number;
  /**
   * Longest acceptable word from this phonology. Diphthong-rich inventories
   * can assemble a technically-legal fourteen-letter personal name that no
   * one would use; a Dragonborn *clan* name that long is correct, so this is
   * per-producer rather than global.
   */
  maxLength?: number;
}

// ---------------------------------------------------------------------------
// Morphology — meaningful stems glued into words
// ---------------------------------------------------------------------------

export interface Morpheme {
  /** The written form of the stem. */
  form: string;
  /** What it means in-world; used for compound sense-checking and hooks. */
  meaning: string;
  /** Free-form tags used by compatibility rules. */
  tags?: readonly string[];
  /** Relative frequency. Default 1. */
  weight?: number;
}

export interface MorphSet {
  /** Stems that may open a word. */
  initial: readonly Morpheme[];
  /** Stems that may close a word. Falls back to `initial` when absent. */
  final?: readonly Morpheme[];
  /** Optional middles for elaborate names. */
  medial?: readonly Morpheme[];
  /** Glue inserted between stems (e.g. `''`, `'a'`, `'-'`). */
  linkers?: Choices<string>;
  /** Terminations by presentation style. */
  endings?: Partial<Record<GenderKey, Choices<string>>>;
  /** Stems may not combine when they share any of these tags. */
  exclusiveTags?: readonly string[];
  /** Number of stems, by complexity (1-indexed by complexity level). */
  partsByComplexity?: Record<Complexity, Choices<number>>;
}

// ---------------------------------------------------------------------------
// Compound / phrase / virtue vocabularies
// ---------------------------------------------------------------------------

export interface CompoundSet {
  first: readonly Morpheme[];
  second: readonly Morpheme[];
  /** Joiner between halves. Default `''`. */
  joiner?: Choices<string>;
  /** Reject a pair when both halves carry the same tag from this list. */
  avoidSharedTags?: readonly string[];
  /** Force lower-case second half (`Fireforge` vs `Fire Forge`). */
  casing?: 'fused' | 'spaced' | 'hyphenated';
}

export interface PhraseSet {
  /**
   * Templates using `{key}` placeholders resolved against `lexicon`.
   * Example: `'{noun} on the {feature}'`.
   */
  templates: Choices<string>;
  lexicon: Record<string, Choices<string>>;
  /**
   * Which lexicon key supplies the everyday short name. When absent the engine
   * picks the longest content word in the phrase.
   */
  shortFrom?: readonly string[];
}

export interface VirtueSet {
  /** Abstract concepts used directly as names. */
  concepts: readonly Morpheme[];
  /** Optional qualifiers (`Ever`, `Unbroken`). */
  qualifiers?: readonly Morpheme[];
  /** Chance of attaching a qualifier at each complexity level. */
  qualifierChance?: Record<Complexity, number>;
  /** Join style for qualifier + concept. */
  casing?: 'fused' | 'spaced';
}

// ---------------------------------------------------------------------------
// Producers — the things that make one component of a name
// ---------------------------------------------------------------------------

export type Producer =
  | { kind: 'phonetic'; phonology: Phonology; syllables?: Partial<Record<Complexity, Choices<number>>> }
  | { kind: 'morph'; set: MorphSet }
  | { kind: 'compound'; set: CompoundSet }
  | { kind: 'phrase'; set: PhraseSet }
  | { kind: 'virtue'; set: VirtueSet }
  /** A closed set that genuinely *is* a closed set in-world (ranks, elements). */
  | { kind: 'closed'; items: Choices<string> }
  /** Pick one of several producers, by weight. */
  | { kind: 'oneOf'; options: readonly Weighted<Producer>[] }
  /** Run several producers and join their output. */
  | { kind: 'sequence'; parts: readonly Producer[]; joiner?: string };

// ---------------------------------------------------------------------------
// Structures — the ordered shape of a full name
// ---------------------------------------------------------------------------

export interface Slot {
  role: SlotRole;
  /** Key into the tradition's (or species') producer table. */
  producer: string;
  /** Probability 0..1 that this slot appears at all. Default 1. */
  chance?: number;
  /** Multiplier applied to `chance` per complexity level. */
  chanceByComplexity?: Partial<Record<Complexity, number>>;
  /** Literal text placed before the component (e.g. `'of '`, `'"'`). */
  prefix?: string;
  /** Literal text placed after the component. */
  suffix?: string;
  /** Separator from the previous rendered slot. Default `' '`. */
  separator?: string;
  /** Force a particular presentation style for this slot only. */
  genderOverride?: GenderKey | 'neutral';
  /** Label shown in the UI breakdown. */
  label?: string;
}

export interface NameStructure {
  id: string;
  weight: number;
  slots: readonly Slot[];
  /** Restrict to a complexity window. */
  minComplexity?: Complexity;
  maxComplexity?: Complexity;
  /** Restrict to particular styles. */
  styles?: readonly NameStyle[];
  /** Human-readable description for tests and documentation. */
  note?: string;
}

// ---------------------------------------------------------------------------
// Traditions and species
// ---------------------------------------------------------------------------

export type GenderPolicy =
  /** Names carry gendered terminations. */
  | 'gendered'
  /** Culture does not mark gender in names at all. */
  | 'neutral'
  /** Gender marking is common but optional. */
  | 'mixed';

export interface Tradition {
  id: string;
  label: string;
  weight: number;
  /** Lore note shown in RESEARCH.md and (abridged) in the UI. */
  note: string;
  genderPolicy: GenderPolicy;
  producers: Record<string, Producer>;
  structures: readonly NameStructure[];
  /**
   * How far a selected background may reach into this tradition's names.
   * Defaults to `{ epithet: true }`: a background can contribute an earned
   * epithet to almost any culture, but it may only supply an occupational
   * surname or an honorific where the culture already uses Common-language
   * ones. Dragonborn clan names, for instance, are never replaced by "Cooper".
   */
  backgroundInfluence?: {
    byname?: boolean;
    epithet?: boolean;
    title?: boolean;
  };
}

export interface SpeciesSpec {
  id: string;
  name: string;
  tier: Tier;
  /** UI grouping label, e.g. `'Elf lineages'`. */
  group: string;
  /** Publications the species appears in. */
  sources: readonly string[];
  confidence: Confidence;
  /** Short bullets summarising the documented naming practice. */
  loreNotes: readonly string[];
  /** Citations (URLs or book references) backing `loreNotes`. */
  citations: readonly string[];
  /** Producers shared across every tradition of this species. */
  sharedProducers?: Record<string, Producer>;
  traditions: readonly Tradition[];
  /** Substrings that must never appear in this species' names. */
  banned?: readonly string[];
  /** Vocabulary used to colour character hooks for this species. */
  hookVocabulary?: HookVocabulary;
}

// ---------------------------------------------------------------------------
// Backgrounds
// ---------------------------------------------------------------------------

export interface BackgroundSpec {
  id: string;
  name: string;
  tier: Tier;
  source: string;
  /**
   * Social register this life gives a name. Nudges honorifics and formality;
   * never dictates personality or morality.
   */
  register: 'plain' | 'formal' | 'itinerant' | 'learned' | 'martial' | 'devout' | 'mercantile';
  /** Chance this background contributes an occupational byname at all. */
  bynameChance: number;
  /** Occupational or circumstantial bynames, used sparingly. */
  bynames?: readonly Morpheme[];
  /** Epithets earned through the work, not through violence. */
  epithets?: readonly string[];
  /** Honorifics only used where a culture already supports titles. */
  titles?: readonly string[];
  /** Hook vocabulary contributed by this background. */
  hookVocabulary: HookVocabulary;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Grammar fragments merged into the hook generator. Keys correspond to
 * `#symbol#` references in hook templates.
 */
export type HookVocabulary = Record<string, readonly string[]>;

// ---------------------------------------------------------------------------
// Generation request / result
// ---------------------------------------------------------------------------

export interface GenerationOptions {
  /** `null` = Not Specified, `'random'` = pick a species, otherwise an id. */
  species: string | null | 'random';
  /** `null` = Not Specified, `'random'` = pick a background, otherwise an id. */
  background: string | null | 'random';
  genderStyle: GenderStyle;
  style: NameStyle;
  complexity: Complexity;
  count: number;
  includeHook: boolean;
  /** Optional seed for reproducible output (used by tests and the stress rig). */
  seed?: number;
}

export interface NameComponent {
  role: SlotRole;
  text: string;
  label?: string;
}

export interface GeneratedCharacter {
  /** Stable id for list keying and favourites. */
  id: string;
  /** The assembled, display-ready name. */
  name: string;
  /** The everyday short name, when the culture uses one and it differs. */
  shortName?: string;
  components: NameComponent[];
  speciesId: string | null;
  speciesName: string | null;
  /** Which naming tradition produced this name, for display + tests. */
  traditionId: string | null;
  traditionLabel: string | null;
  structureId: string;
  backgroundId: string | null;
  backgroundName: string | null;
  hook?: string;
  /** Settings in effect when the name was made (stored with favourites). */
  settings: {
    style: NameStyle;
    complexity: Complexity;
    genderStyle: GenderStyle;
  };
  createdAt: number;
}

export interface GenerationDiagnostics {
  attempts: number;
  rejections: Record<string, number>;
  elapsedMs: number;
}

export interface GenerationResult {
  characters: GeneratedCharacter[];
  diagnostics: GenerationDiagnostics;
}
