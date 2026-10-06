/**
 * The naming architectures.
 *
 * Five independent ways to build one component of a name, plus two combinators.
 * A species picks whichever architectures its documented tradition actually
 * uses — there is deliberately no universal prefix+suffix path.
 */

import type {
  Choices,
  Complexity,
  CompoundSet,
  GenderKey,
  Morpheme,
  MorphSet,
  NameStyle,
  Phonology,
  PhraseSet,
  Producer,
  SyllablePattern,
  VirtueSet,
} from '../types/index.ts';
import { Rng, filterChoices, normalise, weightedPick, weightedPickOrFallback } from './rng.ts';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/** What a producer records about the pieces it used, so diversity can penalise them. */
export type TokenKind = 'onset' | 'nucleus' | 'coda' | 'stem' | 'word' | 'ending' | 'template';

export interface ProducerContext {
  rng: Rng;
  complexity: Complexity;
  style: NameStyle;
  /** `null` means the culture does not mark presentation style in names. */
  gender: GenderKey | null;
  /** Weight exponent derived from the style dial. */
  exponent: number;
  /** Multiplier in (0, 1] applied to over-used components. */
  penalty: (kind: TokenKind, token: string) => number;
  /** Called for every component actually used. */
  record: (kind: TokenKind, token: string) => void;
}

export interface ProducerOutput {
  text: string;
  /** Everyday short form, when the culture uses one (e.g. Tabaxi). */
  short?: string;
  /** Plain-language gloss, when the components carry meaning. */
  meaning?: string;
}

/** Style dial → weight exponent. Sharpen for Traditional, flatten for Wild. */
export function exponentForStyle(style: NameStyle): number {
  switch (style) {
    case 'traditional':
      return 1.85;
    case 'wild':
      return 0.5;
    default:
      return 1;
  }
}

// ---------------------------------------------------------------------------
// Orthographic tidying
// ---------------------------------------------------------------------------

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'á', 'é', 'í', 'ó', 'ú', 'ä', 'ë', 'ï', 'ö', 'ü']);

function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toLowerCase());
}

/**
 * Join two fragments without producing triples, stuttered consonants, or
 * vowel pile-ups. Used wherever two pieces of a word meet.
 */
export function smartJoin(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  let left = a;
  let right = b;

  const lastA = left[left.length - 1] as string;
  const firstB = right[0] as string;

  // Same letter at the seam: keep one of them unless a legitimate double forms.
  if (lastA.toLowerCase() === firstB.toLowerCase()) {
    if (isVowel(lastA)) {
      right = right.slice(1); // no doubled vowels at a seam
    } else {
      // A doubled consonant is fine after a vowel ("Ironnail"), but not when
      // it already follows another consonant: "Crypt" + "taxist" would give
      // "Crypttaxist", and "st" + "taun" would give "sttaun".
      const prev = left.length >= 2 ? (left[left.length - 2] as string).toLowerCase() : '';
      const wouldTriple = prev === lastA.toLowerCase();
      const afterConsonant = prev !== '' && !isVowel(prev);
      if (wouldTriple || afterConsonant) right = right.slice(1);
    }
  }

  // Three vowels in a row reads as a typo in almost every tradition here.
  const seam = left.slice(-2) + right.slice(0, 2);
  if (seam.length >= 3) {
    let run = 0;
    for (const ch of seam) {
      run = isVowel(ch) ? run + 1 : 0;
      if (run >= 3) {
        if (isVowel(right[0] as string)) right = right.slice(1);
        break;
      }
    }
  }
  return left + right;
}

/** Collapse accidental triples and stray marks left by assembly. */
export function tidyWord(word: string): string {
  return word
    .replace(/(.)\1{2,}/gi, '$1$1')
    .replace(/''+/g, "'")
    .replace(/--+/g, '-')
    .replace(/^['-]+/, '')
    .replace(/['-]+$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Title-case a single word, leaving internal apostrophes and hyphens alone. */
export function capitalise(word: string): string {
  if (!word) return word;
  return word[0]!.toUpperCase() + word.slice(1);
}

/** Title-case every word in a phrase, keeping small connective words lower. */
const MINOR_WORDS = new Set(['of', 'on', 'the', 'in', 'at', 'and', 'under', 'over', 'from', 'to', 'by', 'with']);
export function titleCasePhrase(phrase: string): string {
  const parts = phrase.split(' ');
  return parts
    .map((w, i) => (i > 0 && MINOR_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : capitalise(w)))
    .join(' ');
}

// ---------------------------------------------------------------------------
// Phonetic architecture
// ---------------------------------------------------------------------------

const DEFAULT_SYLLABLES: Record<Complexity, Choices<number>> = {
  1: [[1, 3], [2, 7], [3, 1]],
  2: [[1, 2], [2, 7], [3, 3]],
  3: [[2, 6], [3, 5], [4, 1]],
  4: [[2, 3], [3, 6], [4, 3]],
  5: [[3, 5], [4, 5], [5, 2]],
};

function patternParts(pattern: SyllablePattern): { onset: boolean; coda: boolean } {
  return { onset: pattern.startsWith('C'), coda: pattern.endsWith('K') };
}

/**
 * Build a word from a phonology. Returns `null` when the phonotactic rules
 * rejected the attempt; the caller retries.
 */
export function buildPhonetic(
  ctx: ProducerContext,
  phon: Phonology,
  syllableOverride?: Partial<Record<Complexity, Choices<number>>>,
): string | null {
  const { rng, exponent } = ctx;
  const sylTable = syllableOverride?.[ctx.complexity] ?? DEFAULT_SYLLABLES[ctx.complexity];
  let count = weightedPickOrFallback(rng, sylTable, { exponent: 1 });

  // Wild names may run a syllable long; Traditional ones stay compact.
  if (ctx.style === 'wild' && rng.chance(0.22)) count += 1;
  if (ctx.style === 'traditional' && count > 3 && rng.chance(0.35)) count -= 1;
  count = Math.max(1, Math.min(6, count));

  const maxRepeat = phon.maxRepeatLetter ?? 2;
  const junctures = phon.forbidJunctures ?? [];
  const maxCluster = phon.maxJunctureCluster ?? 3;
  const usedOnsets = new Set<string>();
  const usedNuclei: string[] = [];

  let word = '';
  /** Coda of the previous syllable, which constrains the next onset. */
  let prevCoda = '';

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const isLast = i === count - 1;
    const patternList = isLast && phon.finalPatterns ? phon.finalPatterns : phon.patterns;
    // After a closed syllable, lean toward an open one. Real languages
    // alternate heavy and light syllables; stacking codas is what makes
    // procedural names unpronounceable.
    const pattern = weightedPickOrFallback(rng, patternList, {
      exponent,
      penalty: (p) => (prevCoda && p.endsWith('K') ? 0.3 : 1),
    });
    const { onset: wantOnset, coda: wantCoda } = patternParts(pattern);

    let syllable = '';

    if (wantOnset) {
      const base = isFirst && phon.initialOnsets ? phon.initialOnsets : phon.onsets;
      // A two-letter coda followed by a two-letter onset is four consonants
      // at a seam; almost nothing is sayable there.
      const list = prevCoda
        ? (filterChoices(base, (o) =>
            prevCoda.length + o.length <= maxCluster
            && !(o.length > 1 && o[0] === prevCoda[prevCoda.length - 1]))
          ?? filterChoices(base, (o) => o.length === 1)
          ?? base)
        : base;
      const onset = weightedPick(rng, list, {
        exponent,
        penalty: (o) => (usedOnsets.has(o) ? 0.1 : 1) * ctx.penalty('onset', o),
      });
      if (onset === undefined) return null;
      usedOnsets.add(onset);
      ctx.record('onset', onset);
      syllable += onset;
    }

    const nucleusList = isFirst && phon.initialNuclei ? phon.initialNuclei : phon.nuclei;
    const nucleus = weightedPick(rng, nucleusList, {
      exponent,
      // Discourage the same vowel three syllables running — that is what makes
      // procedural names sound like a slot machine.
      penalty: (v) => (usedNuclei.length >= 2 && usedNuclei.slice(-2).every((p) => p === v) ? 0.05 : 1)
        * ctx.penalty('nucleus', v),
    });
    if (nucleus === undefined) return null;
    usedNuclei.push(nucleus);
    ctx.record('nucleus', nucleus);
    syllable += nucleus;

    if (wantCoda) {
      const codaList = isLast && phon.finalCodas ? phon.finalCodas : phon.codas;
      const coda = weightedPick(rng, codaList, { exponent, penalty: (c) => ctx.penalty('coda', c) });
      if (coda === undefined) return null;
      ctx.record('coda', coda);
      syllable += coda;
      prevCoda = coda;
    } else {
      prevCoda = '';
    }

    if (word) {
      const seam = (word.slice(-2) + syllable.slice(0, 2)).toLowerCase();
      if (junctures.some((bad) => seam.includes(bad))) return null;
      // An optional internal mark (apostrophes in Githyanki, for instance).
      if (phon.internalMark && !isLast && rng.chance(phon.internalMark.chance)) {
        word += phon.internalMark.mark;
      }
    }
    word = smartJoin(word, syllable);
  }

  // Presentation-style termination, where the tradition marks one.
  if (ctx.gender && phon.endings) {
    const endings = phon.endings[ctx.gender];
    if (endings && endings.length > 0) {
      const applyChance = ctx.gender === 'neutral' ? 0.55 : 0.78;
      if (rng.chance(applyChance)) {
        const ending = weightedPick(rng, endings, {
          exponent,
          penalty: (e) => ctx.penalty('ending', e),
        });
        if (ending !== undefined) {
          ctx.record('ending', ending);
          word = smartJoin(word, ending);
        }
      }
    }
  }

  word = tidyWord(word);
  if (!word) return null;
  if (phon.maxLength && word.length > phon.maxLength) return null;

  // Hard phonotactic rejections.
  const lower = word.toLowerCase();
  const repeatRe = new RegExp(`(.)\\1{${maxRepeat},}`, 'i');
  if (repeatRe.test(word)) return null;
  if (phon.forbid?.some((src) => new RegExp(src, 'i').test(lower))) return null;

  return capitalise(word);
}

// ---------------------------------------------------------------------------
// Morphological architecture
// ---------------------------------------------------------------------------

const DEFAULT_MORPH_PARTS: Record<Complexity, Choices<number>> = {
  1: [[1, 7], [2, 3]],
  2: [[1, 4], [2, 6]],
  3: [[1, 2], [2, 8]],
  4: [[2, 7], [3, 3]],
  5: [[2, 4], [3, 6]],
};

function morphChoices(list: readonly Morpheme[]): Choices<Morpheme> {
  return list.map((m) => [m, m.weight ?? 1] as const);
}

function tagsClash(a: Morpheme, b: Morpheme, exclusive?: readonly string[]): boolean {
  if (a.form === b.form) return true;
  if (!exclusive || !a.tags || !b.tags) return false;
  return exclusive.some((t) => a.tags!.includes(t) && b.tags!.includes(t));
}

export function buildMorph(ctx: ProducerContext, set: MorphSet): ProducerOutput | null {
  const { rng, exponent } = ctx;
  const table = set.partsByComplexity?.[ctx.complexity] ?? DEFAULT_MORPH_PARTS[ctx.complexity];
  const parts = Math.max(1, weightedPickOrFallback(rng, table, { exponent: 1 }));

  const chosen: Morpheme[] = [];
  const pools: ReadonlyArray<readonly Morpheme[]> = [
    set.initial,
    ...(parts > 2 && set.medial ? [set.medial] : []),
    ...(parts > 1 ? [set.final ?? set.initial] : []),
  ];

  for (let i = 0; i < Math.min(parts, pools.length); i++) {
    const pool = pools[i] as readonly Morpheme[];
    const picked = weightedPick(rng, morphChoices(pool), {
      exponent,
      penalty: (m) =>
        (chosen.some((c) => tagsClash(c, m, set.exclusiveTags)) ? 0 : 1) * ctx.penalty('stem', m.form),
    });
    if (picked === undefined) return null;
    chosen.push(picked);
    ctx.record('stem', picked.form);
  }
  if (chosen.length === 0) return null;

  let word = '';
  for (let i = 0; i < chosen.length; i++) {
    const piece = chosen[i] as Morpheme;
    if (i > 0 && set.linkers) {
      const linker = weightedPickOrFallback(rng, set.linkers, { exponent });
      word = smartJoin(word, linker);
    }
    word = smartJoin(word, piece.form);
  }

  if (ctx.gender && set.endings) {
    const endings = set.endings[ctx.gender];
    if (endings && endings.length > 0 && rng.chance(ctx.gender === 'neutral' ? 0.5 : 0.75)) {
      const ending = weightedPick(rng, endings, { exponent, penalty: (e) => ctx.penalty('ending', e) });
      if (ending !== undefined) {
        ctx.record('ending', ending);
        word = smartJoin(word, ending);
      }
    }
  }

  word = tidyWord(word);
  if (!word) return null;
  return {
    text: capitalise(word),
    meaning: chosen.map((c) => c.meaning).join(' '),
  };
}

// ---------------------------------------------------------------------------
// Compound architecture
// ---------------------------------------------------------------------------

export function buildCompound(ctx: ProducerContext, set: CompoundSet): ProducerOutput | null {
  const { rng, exponent } = ctx;
  const first = weightedPick(rng, morphChoices(set.first), {
    exponent,
    penalty: (m) => ctx.penalty('stem', m.form),
  });
  if (first === undefined) return null;

  const firstTail = first.form[first.form.length - 1]?.toLowerCase() ?? '';
  const second = weightedPick(rng, morphChoices(set.second), {
    exponent,
    penalty: (m) => {
      if (m.form.toLowerCase() === first.form.toLowerCase()) return 0;
      if (set.avoidSharedTags && m.tags && first.tags) {
        if (set.avoidSharedTags.some((t) => m.tags!.includes(t) && first.tags!.includes(t))) return 0;
      }
      // Discourage a seam that doubles a letter ("Burrow" + "warden").
      // Not forbidden — "Ironnail" is fine — but strongly deprioritised.
      const head = m.form[0]?.toLowerCase() ?? '';
      const seamPenalty = head && head === firstTail ? 0.04 : 1;
      return seamPenalty * ctx.penalty('stem', m.form);
    },
  });
  if (second === undefined) return null;

  ctx.record('stem', first.form);
  ctx.record('stem', second.form);

  const casing = set.casing ?? 'fused';
  const joiner = set.joiner ? weightedPickOrFallback(rng, set.joiner, { exponent }) : '';

  let text: string;
  if (casing === 'spaced') {
    text = `${capitalise(first.form)}${joiner ? joiner : ' '}${capitalise(second.form)}`;
  } else if (casing === 'hyphenated') {
    text = `${capitalise(first.form)}-${capitalise(second.form)}`;
  } else {
    text = tidyWord(smartJoin(smartJoin(first.form, joiner), second.form));
    text = capitalise(text);
  }

  return { text, meaning: `${first.meaning} ${second.meaning}` };
}

// ---------------------------------------------------------------------------
// Descriptive-phrase architecture
// ---------------------------------------------------------------------------

const PHRASE_SLOT = /\{([a-z0-9_]+)\}/gi;

export function buildPhrase(ctx: ProducerContext, set: PhraseSet): ProducerOutput | null {
  const { rng, exponent } = ctx;
  const template = weightedPick(rng, set.templates, {
    exponent,
    penalty: (t) => ctx.penalty('template', t),
  });
  if (template === undefined) return null;
  ctx.record('template', template);

  const filled = new Map<string, string>();
  const used = new Set<string>();
  let failed = false;

  const text = template.replace(PHRASE_SLOT, (_match, key: string) => {
    const pool = set.lexicon[key];
    if (!pool) {
      failed = true;
      return '';
    }
    const word = weightedPick(rng, pool, {
      exponent,
      // Never repeat a word inside one phrase — "Rain on the Rain" is a bug.
      penalty: (w) => (used.has(w.toLowerCase()) ? 0 : 1) * ctx.penalty('word', w),
    });
    if (word === undefined) {
      failed = true;
      return '';
    }
    used.add(word.toLowerCase());
    ctx.record('word', word);
    if (!filled.has(key)) filled.set(key, word);
    return word;
  });

  if (failed) return null;
  const phrase = titleCasePhrase(tidyWord(text));
  if (!phrase) return null;

  // The everyday short name: the first nominated slot that was filled, in the
  // order the species declares, else the longest content word. Tried in order
  // rather than shuffled so the head noun wins — a tabaxi called "Cloud on the
  // Mountaintop" goes by Cloud, not by Mountaintop.
  let short: string | undefined;
  if (set.shortFrom) {
    for (const key of set.shortFrom) {
      const candidate = filled.get(key);
      if (candidate) {
        // A short name is one word; take the head of a multi-word slot.
        short = capitalise(candidate.split(' ').pop() as string);
        break;
      }
    }
  }
  if (!short) {
    const words = phrase.split(' ').filter((w) => !MINOR_WORDS.has(w.toLowerCase()));
    short = words.length > 0 ? (words.sort((a, b) => b.length - a.length)[0] as string) : undefined;
  }

  return { text: phrase, short: short && short !== phrase ? short : undefined };
}

// ---------------------------------------------------------------------------
// Virtue / chosen-name architecture
// ---------------------------------------------------------------------------

const DEFAULT_QUALIFIER_CHANCE: Record<Complexity, number> = { 1: 0.02, 2: 0.1, 3: 0.24, 4: 0.42, 5: 0.6 };

export function buildVirtue(ctx: ProducerContext, set: VirtueSet): ProducerOutput | null {
  const { rng, exponent } = ctx;
  const concept = weightedPick(rng, morphChoices(set.concepts), {
    exponent,
    penalty: (m) => ctx.penalty('word', m.form),
  });
  if (concept === undefined) return null;
  ctx.record('word', concept.form);

  const chance = (set.qualifierChance ?? DEFAULT_QUALIFIER_CHANCE)[ctx.complexity];
  // Concepts tagged `bare` are words like "Nevertheless" or "Elsewhere": they
  // work as a standalone chosen name but turn ungrammatical once qualified.
  const qualifiable = !concept.tags?.includes('bare');
  if (qualifiable && set.qualifiers && set.qualifiers.length > 0 && rng.chance(chance)) {
    const qualifier = weightedPick(rng, morphChoices(set.qualifiers), {
      exponent,
      penalty: (m) => (m.form.toLowerCase() === concept.form.toLowerCase() ? 0 : ctx.penalty('word', m.form)),
    });
    if (qualifier !== undefined) {
      ctx.record('word', qualifier.form);
      const text =
        (set.casing ?? 'spaced') === 'fused'
          ? capitalise(tidyWord(smartJoin(qualifier.form, concept.form.toLowerCase())))
          : `${capitalise(qualifier.form)} ${capitalise(concept.form)}`;
      return { text, meaning: `${qualifier.meaning} ${concept.meaning}` };
    }
  }

  return { text: capitalise(concept.form), meaning: concept.meaning };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

/** Run any producer. Returns `null` when its constraints could not be met. */
export function runProducer(ctx: ProducerContext, producer: Producer): ProducerOutput | null {
  switch (producer.kind) {
    case 'phonetic': {
      const text = buildPhonetic(ctx, producer.phonology, producer.syllables);
      return text ? { text } : null;
    }
    case 'morph':
      return buildMorph(ctx, producer.set);
    case 'compound':
      return buildCompound(ctx, producer.set);
    case 'phrase':
      return buildPhrase(ctx, producer.set);
    case 'virtue':
      return buildVirtue(ctx, producer.set);
    case 'closed': {
      const item = weightedPick(ctx.rng, producer.items, {
        exponent: ctx.exponent,
        penalty: (w) => ctx.penalty('word', w),
      });
      if (item === undefined) return null;
      ctx.record('word', item);
      return { text: item };
    }
    case 'oneOf': {
      const option = weightedPick<Producer>(ctx.rng, producer.options, { exponent: ctx.exponent });
      if (option === undefined) return null;
      return runProducer(ctx, option);
    }
    case 'sequence': {
      const pieces: string[] = [];
      const meanings: string[] = [];
      for (const part of producer.parts) {
        const out = runProducer(ctx, part);
        if (!out) return null;
        pieces.push(out.text);
        if (out.meaning) meanings.push(out.meaning);
      }
      const joiner = producer.joiner ?? '';
      const text =
        joiner === ''
          ? capitalise(tidyWord(pieces.reduce((acc, p) => smartJoin(acc, acc ? p.toLowerCase() : p), '')))
          : pieces.join(joiner);
      return { text, meaning: meanings.length ? meanings.join(' ') : undefined };
    }
    default: {
      const exhaustive: never = producer;
      throw new Error(`Unknown producer kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/** Count how many distinct values a `Choices` list offers — used by the docs/tests. */
export function choiceCount<T>(items: Choices<T>): number {
  return normalise(items).filter((n) => n.weight > 0).length;
}

export { isVowel };
