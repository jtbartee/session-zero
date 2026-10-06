/**
 * Name validation.
 *
 * Everything here is a *rejection* test: the generator keeps drawing until a
 * candidate passes. Rejections are counted and reported by the stress harness,
 * so a rule that fires too often shows up as a data problem rather than
 * silently degrading quality.
 */

export type RejectionReason =
  | 'empty'
  | 'too-short'
  | 'too-long'
  | 'no-vowel'
  | 'consonant-pileup'
  | 'vowel-pileup'
  | 'repeated-letter'
  | 'punctuation-overload'
  | 'stutter'
  | 'profanity'
  | 'canonical'
  | 'cliche'
  | 'banned-substring';

export interface ValidationOptions {
  /** Extra substrings this species may never produce. */
  banned?: readonly string[];
  /** Longest run of consonant letters allowed. Default 4. */
  maxConsonantRun?: number;
  /** Maximum apostrophes/hyphens across the whole name. Default 2. */
  maxMarks?: number;
  /** Shortest acceptable single word. Default 2. */
  minWordLength?: number;
  /** Longest acceptable single word. Default 15. */
  maxWordLength?: number;
  /** Most words a full name may contain. Default 5. */
  maxWords?: number;
}

const VOWEL_RE = /[aeiouyáéíóúäëïöüàèìòù]/i;

/**
 * Digraphs that read as a single consonant sound, so they should not count
 * toward a "pileup". Longest first.
 */
const CONSONANT_DIGRAPHS = [
  'sch', 'str', 'scr', 'spl', 'spr', 'thr', 'chr', 'phl', 'phr', 'shr',
  'th', 'sh', 'ch', 'ph', 'gh', 'kh', 'zh', 'ng', 'rh', 'wh', 'ck', 'qu', 'dh', 'bh', 'ts', 'tz', 'sz',
];

/** Count consonant letters in a row, treating known digraphs as one unit. */
function longestConsonantRun(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  let worst = 0;
  let run = 0;
  let i = 0;
  while (i < w.length) {
    const rest = w.slice(i);
    const digraph = CONSONANT_DIGRAPHS.find((d) => rest.startsWith(d));
    if (digraph) {
      run += 1;
      i += digraph.length;
    } else if (VOWEL_RE.test(w[i] as string)) {
      run = 0;
      i += 1;
    } else {
      run += 1;
      i += 1;
    }
    if (run > worst) worst = run;
  }
  return worst;
}

function longestVowelRun(word: string): number {
  const matches = word.toLowerCase().match(/[aeiouy]+/g);
  if (!matches) return 0;
  return matches.reduce((m, s) => Math.max(m, s.length), 0);
}

// ---------------------------------------------------------------------------
// Blocklists
// ---------------------------------------------------------------------------

/**
 * Severe terms are stored ROT13-encoded so the repository does not contain a
 * readable list of slurs. Decode with `rot13` to audit or extend the list.
 */
function rot13(s: string): string {
  return s.replace(/[a-z]/g, (c) =>
    String.fromCharCode(((c.charCodeAt(0) - 97 + 13) % 26) + 97),
  );
}

/**
 * Profanity screening, in three tiers.
 *
 * A naive substring check over the whole name is wrong in both directions:
 * "Quiet Water" flattens to a string containing a slur, and "Silentwatch"
 * contains one across the compound seam. Neither reads as anything. So:
 *
 *  - `SEVERE_ANYWHERE`: long, unambiguous terms that cannot occur innocently.
 *    Matched anywhere inside a single word.
 *  - `SEVERE_ANCHORED`: short terms that *do* occur inside ordinary English.
 *    Matched only at the start or end of a word, where a reader would
 *    actually see them, and suppressed when an allowlisted innocent word
 *    covers the match ("scrape" is not a hit).
 *  - `WHOLE_WORD`: mild terms, matched only as a complete word.
 *
 * Lists are ROT13-encoded so the repository is not itself a slur dump; decode
 * with `rot13` to audit.
 */
const SEVERE_ANYWHERE = [
  'avttre', 'avttn', 'avtt0e', 'avttref', 'snttbg', 'snttbgf', 'jrgonpx', 'fcnfgvp', 'genaal',
  'zbyrfg', 'furznyr', 'encvfg', 'encvat', 'xvxrf', 'abapr', 'tbbxf',
].map(rot13);

const SEVERE_ANCHORED = [
  'xvxr', 'encr', 'phag', 'phagf', 'puvax', 'fcvp', 'gjng', 'ohttre', 'tbbx', 'pbba', 'cnxv', 'jbt',
].map(rot13);

/**
 * Ordinary words that contain an anchored term. A match fully inside one of
 * these is ignored.
 */
const INNOCENT = [
  'scrape', 'scraper', 'scraping', 'grape', 'grapes', 'drape', 'drapes', 'draper', 'trapeze',
  'therapist', 'therapy', 'therapeutic', 'raccoon', 'cocoon', 'tycoon', 'lampoon', 'spice', 'spicy',
  'spicule', 'chinkapin', 'wogan', 'buggered', 'packing', 'pakira',
];

const WHOLE_WORD = [
  'shpx', 'fuvg', 'fuvgf', 'cvff', 'pbpx', 'qvpx', 'gvgf', 'nefr', 'nff', 'nffubyr', 'onfgneq',
  'qnza', 'uryy', 'fyhg', 'juber', 'ohz', 'cbba', 'sernx', 'ynzr', 'fghcvq', 'penc', 'gheq', 'penccl',
].map(rot13);

/**
 * Well-known characters from D&D and adjacent fantasy. Accidentally generating
 * "Drizzt" undermines the whole point of the tool.
 */
const CANONICAL = [
  // Forgotten Realms / D&D
  'drizzt', 'elminster', 'bruenor', 'wulfgar', 'catti', 'cattibrie', 'regis', 'artemis',
  'entreri', 'minsc', 'jaheira', 'imoen', 'volothamp', 'mordenkainen', 'bigby', 'tasha',
  'iggwilv', 'vecna', 'strahd', 'vonzarovich', 'acererak', 'halaster', 'khelben', 'laeral',
  'szass', 'manshoon', 'alustriel', 'storm silverhand', 'tiamat', 'bahamut', 'lolth',
  'gruumsh', 'corellon', 'moradin', 'yondalla', 'garl', 'asmodeus', 'zariel', 'baphomet',
  'raistlin', 'caramon', 'tanis', 'tasslehoff', 'sturm', 'flint fireforge', 'goldmoon',
  'riverwind', 'kitiara', 'laurana', 'fizban', 'takhisis', 'paladine',
  // Tolkien
  'legolas', 'gandalf', 'aragorn', 'frodo', 'bilbo', 'gimli', 'thorin', 'sauron',
  'galadriel', 'elrond', 'arwen', 'boromir', 'samwise', 'gollum', 'saruman', 'eowyn',
  'faramir', 'theoden', 'celeborn', 'thranduil', 'beren', 'luthien', 'feanor', 'melkor',
  // Other widely-known fantasy
  'geralt', 'yennefer', 'triss', 'ciri', 'kvothe', 'denna', 'daenerys', 'tyrion', 'arya',
  'jaina', 'thrall', 'illidan', 'sylvanas', 'arthas', 'uther', 'kratos', 'link', 'zelda',
  'ganondorf', 'cloud strife', 'sephiroth', 'aerith', 'tifa', 'eragon', 'saphira',
  'rincewind', 'granny weatherwax', 'vimes', 'conan', 'elric', 'fafhrd',
];

/**
 * Exhausted fantasy-name clichés. These are *components*, so they are checked
 * against individual words rather than the full string.
 */
const CLICHE_WORDS = [
  'shadowblade', 'bloodfang', 'darkbane', 'doomhammer', 'deathbringer', 'dragonslayer',
  'nightshade', 'ravenclaw', 'stormwind', 'edgelord', 'bloodraven', 'darkheart',
  'shadowfax', 'xxx',
];

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/** True when `[start, start + length)` sits inside an allowlisted word. */
function coveredByInnocent(word: string, start: number, length: number): boolean {
  for (const safe of INNOCENT) {
    let from = 0;
    for (;;) {
      const at = word.indexOf(safe, from);
      if (at < 0) break;
      if (start >= at && start + length <= at + safe.length) return true;
      from = at + 1;
    }
  }
  return false;
}

function wordIsProfane(word: string): boolean {
  if (!word) return false;
  for (const term of SEVERE_ANYWHERE) {
    const at = word.indexOf(term);
    if (at >= 0 && !coveredByInnocent(word, at, term.length)) return true;
  }
  for (const term of SEVERE_ANCHORED) {
    if (word.length < term.length) continue;
    if (word.startsWith(term) && !coveredByInnocent(word, 0, term.length)) return true;
    const tail = word.length - term.length;
    if (word.endsWith(term) && !coveredByInnocent(word, tail, term.length)) return true;
  }
  return false;
}

function containsSevere(words: readonly string[]): boolean {
  return words.some(wordIsProfane);
}

function containsWholeWord(words: readonly string[]): boolean {
  return words.some((w) => WHOLE_WORD.includes(w));
}

/** Cheap bounded edit-distance check: true when at most one edit apart. */
function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.length - short.length > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (short.length === long.length) i++;
    j++;
  }
  return true;
}

function matchesCanonical(name: string, words: readonly string[]): boolean {
  const lower = name.toLowerCase();
  for (const known of CANONICAL) {
    if (known.includes(' ')) {
      if (lower.includes(known)) return true;
      continue;
    }
    for (const word of words) {
      if (word === known) return true;
      // Catch near-misses on longer canon names: "Drizzta" (an added letter)
      // and "Legolan" (a substituted one). The 3-character prefix guard keeps
      // this off the hot path for almost every candidate.
      if (known.length >= 6 && Math.abs(word.length - known.length) <= 1
          && word.slice(0, 3) === known.slice(0, 3)
          && editDistanceAtMostOne(word, known)) {
        return true;
      }
    }
  }
  return false;
}

/** A "stutter" is a syllable repeated back to back: Baladalada, Renren. */
function hasStutter(word: string): boolean {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  for (let size = 2; size <= 4; size++) {
    for (let i = 0; i + size * 2 <= w.length; i++) {
      if (w.slice(i, i + size) === w.slice(i + size, i + size * 2)) return true;
    }
  }
  return false;
}

/**
 * Validate a fully assembled name. Returns `null` when the name is acceptable,
 * otherwise the reason it was rejected.
 */
export function validateName(name: string, options: ValidationOptions = {}): RejectionReason | null {
  const maxRun = options.maxConsonantRun ?? 4;
  const maxMarks = options.maxMarks ?? 2;
  const minWord = options.minWordLength ?? 2;
  const maxWord = options.maxWordLength ?? 15;
  const maxWords = options.maxWords ?? 7;

  const trimmed = name.trim();
  if (!trimmed) return 'empty';

  const words = trimmed
    .toLowerCase()
    .split(/[\s]+/)
    .map((w) => w.replace(/^["'“”]+|["'“”,.]+$/g, ''))
    .filter(Boolean);
  if (words.length === 0) return 'empty';

  const flat = trimmed.toLowerCase().replace(/[^a-z]/g, '');
  if (flat.length < 2) return 'too-short';
  void flat;
  if (trimmed.length > 56) return 'too-long';
  if (words.filter((x) => !['of', 'on', 'the', 'in', 'at', 'to', 'by', 'called'].includes(x)).length > maxWords) {
    return 'too-long';
  }

  // Multi-word descriptive names legitimately carry more punctuation than a
  // single personal name does, so the allowance scales with word count.
  const markCount = (trimmed.match(/['’-]/g) ?? []).length;
  if (markCount > maxMarks + Math.max(0, words.length - 2)) return 'punctuation-overload';

  for (const raw of words) {
    const word = raw.replace(/[^a-zà-ÿ'’-]/g, '');
    if (!word) continue;
    const letters = word.replace(/[^a-zà-ÿ]/g, '');
    // Connective particles are legitimately short.
    if (letters.length < minWord && !['of', 'on', 'the', 'in', 'at', 'to', 'by', 'da', 'de'].includes(letters)) {
      return 'too-short';
    }
    // A hyphenated compound is several words wearing one coat; judge the
    // longest hyphen-free run rather than the whole string.
    const longestSegment = Math.max(...word.split(/[-'’]/).map((seg) => seg.replace(/[^a-zà-ÿ]/g, '').length));
    if (longestSegment > maxWord) return 'too-long';
    if (!VOWEL_RE.test(letters)) return 'no-vowel';
    if (longestConsonantRun(letters) > maxRun) return 'consonant-pileup';
    if (longestVowelRun(letters) > 3) return 'vowel-pileup';
    if (/(.)\1\1/i.test(letters)) return 'repeated-letter';
    if (letters.length >= 6 && hasStutter(letters)) return 'stutter';
    if ((word.match(/['’]/g) ?? []).length > 1) return 'punctuation-overload';
  }

  if (containsSevere(words.map((x) => x.replace(/[^a-z]/g, '')))) return 'profanity';
  if (containsWholeWord(words)) return 'profanity';
  if (matchesCanonical(trimmed, words)) return 'canonical';
  if (words.some((w) => CLICHE_WORDS.includes(w))) return 'cliche';

  if (options.banned?.length) {
    for (const bad of options.banned) {
      if (flat.includes(bad.toLowerCase().replace(/[^a-z]/g, ''))) return 'banned-substring';
    }
  }

  return null;
}

/** Exposed for tests so the blocklists can be exercised without re-encoding. */
export const __testing = { rot13, longestConsonantRun, hasStutter, wordIsProfane, CANONICAL, CLICHE_WORDS };
