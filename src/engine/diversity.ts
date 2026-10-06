/**
 * Anti-repetition.
 *
 * Two layers work together:
 *
 *  1. `UsageLedger` — a long-lived, decaying tally of every component the
 *     engine has used recently (stems, onsets, surnames, structures). It feeds
 *     multiplicative penalties back into weighted selection, so over-used
 *     pieces become progressively less likely without ever being banned.
 *
 *  2. `BatchGuard` — a per-request filter that rejects a finished candidate
 *     when it is too close to something else in the same batch or in the
 *     persistent recent-name history.
 *
 * The second layer is what stops batches like
 *   Dorrin Ironbeard / Borrin Ironhammer / Korrin Ironforge
 * which contain no exact duplicates but read as one name four times.
 */

import type { TokenKind } from './grammar.ts';

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

/** Strip to comparable letters. */
function flatten(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Consonant skeleton with common spellings normalised, roughly a
 * metaphone-lite. "Caelynn" and "Kaelin" collapse to the same key.
 */
export function phoneticSkeleton(word: string): string {
  let w = flatten(word);
  if (!w) return '';
  w = w
    .replace(/ph/g, 'f')
    .replace(/gh/g, 'g')
    .replace(/ck|kh|qu?/g, 'k')
    .replace(/sh|ch|zh/g, 'x')
    .replace(/th|dh/g, '0')
    .replace(/[cq]/g, 'k')
    .replace(/[yj]/g, 'i')
    .replace(/z/g, 's')
    .replace(/v/g, 'f')
    .replace(/(.)\1+/g, '$1');
  // Take the leading sound from the *normalised* form, or "Caelynn" keeps a
  // 'c' that normalisation has already turned into 'k' and the two spellings
  // stop colliding. Only a vowel needs prepending; a consonant is already in
  // the skeleton, and it is the vowel-initial names that would otherwise lose
  // their opening ("Amara" and "Mara" must not collapse together).
  const first = w[0] as string;
  const skeleton = w.replace(/[aeiou]/g, '');
  const onset = /[aeiou]/.test(first) ? first : '';
  return (onset + skeleton).replace(/(.)\1+/g, '$1');
}

/** Rhyme key: the tail of a word, which is what makes a batch sound samey. */
export function rhymeKey(word: string): string {
  const w = flatten(word);
  if (w.length <= 3) return w;
  return w.slice(-4);
}

/** Head key: the opening of a word. */
export function headKey(word: string): string {
  const w = flatten(word);
  return w.slice(0, 3);
}

/** Count vowel groups as a cheap syllable estimate. */
export function syllableEstimate(word: string): number {
  const groups = flatten(word).match(/[aeiouy]+/g);
  return groups ? groups.length : 1;
}

/** Levenshtein distance, bounded to short strings. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= b.length; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min((curr[j - 1] as number) + 1, (prev[j] as number) + 1, (prev[j - 1] as number) + cost);
    }
    const swap = prev;
    prev = curr;
    curr = swap;
  }
  return prev[b.length] as number;
}

/** 0 (unrelated) → 1 (identical). */
export function similarity(a: string, b: string): number {
  const fa = flatten(a);
  const fb = flatten(b);
  if (!fa || !fb) return 0;
  const max = Math.max(fa.length, fb.length);
  return 1 - levenshtein(fa, fb) / max;
}

// ---------------------------------------------------------------------------
// Usage ledger
// ---------------------------------------------------------------------------

export interface LedgerOptions {
  /**
   * Multiplier applied to every tally when `decay()` runs. Lower forgets
   * faster. 0.86 keeps roughly the last ~40 uses meaningfully weighted.
   */
  decayFactor?: number;
  /** How aggressively a tally suppresses re-selection. */
  strength?: Partial<Record<TokenKind | 'structure' | 'tradition', number>>;
  /** Tallies below this are dropped entirely, keeping the map small. */
  floor?: number;
}

/**
 * Components get strong suppression — that is what stops a batch reading
 * "Ironbeard, Ironhammer, Ironforge". Structures and traditions get light
 * suppression: batch-level budgets already guarantee variety there, and a
 * heavy penalty here would flatten the authored weights into a uniform
 * distribution, so a dwarf would stop usually having a clan name.
 */
const DEFAULT_STRENGTH: Record<TokenKind | 'structure' | 'tradition', number> = {
  onset: 0.55,
  nucleus: 0.3,
  coda: 0.45,
  stem: 1.1,
  word: 1.25,
  ending: 0.7,
  template: 1.2,
  structure: 0.22,
  tradition: 0.15,
};

export class UsageLedger {
  private counts = new Map<string, number>();
  private readonly decayFactor: number;
  private readonly floor: number;
  private readonly strength: Record<string, number>;

  constructor(options: LedgerOptions = {}) {
    this.decayFactor = options.decayFactor ?? 0.86;
    this.floor = options.floor ?? 0.04;
    this.strength = { ...DEFAULT_STRENGTH, ...options.strength };
  }

  private key(kind: string, token: string): string {
    return `${kind}:${token.toLowerCase()}`;
  }

  record(kind: string, token: string, amount = 1): void {
    if (!token) return;
    const k = this.key(kind, token);
    this.counts.set(k, (this.counts.get(k) ?? 0) + amount);
  }

  /**
   * Penalty multiplier in (0, 1]. Gentle for a first reuse, steeper after
   * that, but sub-quadratic: a squared curve suppressed common components so
   * hard that the authored weights stopped meaning anything.
   */
  penalty(kind: string, token: string): number {
    const n = this.counts.get(this.key(kind, token));
    if (!n) return 1;
    const strength = this.strength[kind] ?? 1;
    return 1 / (1 + strength * Math.pow(n, 1.4) * 0.4);
  }

  /** Age every tally. Called once per generated name. */
  decay(): void {
    for (const [k, v] of this.counts) {
      const next = v * this.decayFactor;
      if (next < this.floor) this.counts.delete(k);
      else this.counts.set(k, next);
    }
  }

  clear(): void {
    this.counts.clear();
  }

  get size(): number {
    return this.counts.size;
  }

  /** Snapshot for diagnostics and the stress harness. */
  top(kind: string, limit = 10): Array<[string, number]> {
    const prefix = `${kind}:`;
    return [...this.counts]
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [k.slice(prefix.length), v] as [string, number])
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }
}

// ---------------------------------------------------------------------------
// Batch guard
// ---------------------------------------------------------------------------

export type BatchRejection =
  | 'duplicate-exact'
  | 'duplicate-recent'
  | 'duplicate-component'
  | 'rhyme-collision'
  | 'head-collision'
  | 'skeleton-collision'
  | 'too-similar'
  | 'surname-stem-collision'
  | 'structure-overused';

export interface BatchCandidate {
  full: string;
  /** The personal name, used for the strictest similarity checks. */
  given: string;
  /** Family/clan component, when the culture has one. */
  family?: string;
  structureId: string;
  /** First meaningful chunk of the family name ("Iron" in "Ironbeard"). */
  familyStem?: string;
  /**
   * Set for serial designations ("Unit Seven", "Envoy-Nine"). Rhyme, skeleton
   * and edit-distance checks are meaningless there — every designation in a
   * series is *supposed* to look alike — so those are skipped. The head check
   * still applies, so one batch does not become twenty "Unit" somethings.
   */
  skipPhoneticKeys?: boolean;
}

export interface BatchGuardOptions {
  /** How many names this batch will contain. Budgets scale from it. */
  batchSize: number;
  /** Recently generated full names, newest last. */
  recent?: Iterable<string>;
  /** Similarity above this rejects. Relaxed automatically on repeated failure. */
  similarityThreshold?: number;
  /**
   * How many distinct name structures the selected species can actually
   * produce. Without this the guard demands variety a one-structure tradition
   * cannot supply, and every name after the budget is rejected pointlessly.
   */
  structureVariants?: number;
}

export class BatchGuard {
  private readonly recent: Set<string>;
  private readonly fullNames = new Set<string>();
  private readonly components = new Set<string>();
  private readonly rhymes = new Map<string, number>();
  private readonly heads = new Map<string, number>();
  private readonly skeletons = new Map<string, number>();
  private readonly familyStems = new Map<string, number>();
  private readonly structures = new Map<string, number>();
  private readonly givens: string[] = [];

  private readonly baseThreshold: number;
  private readonly rhymeBudget: number;
  private readonly headBudget: number;
  private readonly stemBudget: number;
  private readonly structureBudget: number;

  constructor(options: BatchGuardOptions) {
    const n = Math.max(1, options.batchSize);
    this.recent = new Set<string>();
    if (options.recent) {
      for (const r of options.recent) this.recent.add(flatten(r));
    }
    this.baseThreshold = options.similarityThreshold ?? 0.72;
    // With one name per batch nothing can collide; budgets only matter at size.
    this.rhymeBudget = n <= 2 ? n : Math.max(1, Math.round(n / 10));
    this.headBudget = n <= 5 ? 2 : Math.max(2, Math.ceil(n / 6));
    this.stemBudget = n <= 5 ? 1 : Math.max(1, Math.ceil(n / 7));
    // 2.6x the even share: enough headroom that a dominant structure still
    // dominates, tight enough that no single shape swallows a whole batch.
    const variants = Math.max(1, options.structureVariants ?? 4);
    this.structureBudget = n <= 2 ? n : Math.max(3, Math.ceil((n / variants) * 2.6));
  }

  /**
   * @param relaxation 0 on the first attempts, rising toward 1 as retries fail,
   *   progressively loosening every budget so generation always terminates.
   */
  check(candidate: BatchCandidate, relaxation = 0): BatchRejection | null {
    const full = flatten(candidate.full);
    if (!full) return 'duplicate-exact';
    if (this.fullNames.has(full)) return 'duplicate-exact';
    if (this.recent.has(full)) return 'duplicate-recent';

    const given = candidate.given;
    const relax = Math.max(0, Math.min(1, relaxation));

    // Exact component reuse is always wrong inside a batch.
    if (this.components.has(flatten(given))) return 'duplicate-component';
    if (candidate.family && this.components.has(flatten(candidate.family))) {
      return 'duplicate-component';
    }

    const budgetBoost = Math.floor(relax * 3);

    const hk = headKey(given);
    if (hk.length >= 2 && (this.heads.get(hk) ?? 0) >= this.headBudget + budgetBoost) {
      return 'head-collision';
    }

    if (!candidate.skipPhoneticKeys) {
      const rk = rhymeKey(given);
      if (rk.length >= 3 && (this.rhymes.get(rk) ?? 0) >= this.rhymeBudget + budgetBoost) {
        return 'rhyme-collision';
      }

      const sk = phoneticSkeleton(given);
      if (sk.length >= 2 && (this.skeletons.get(sk) ?? 0) >= 1 + budgetBoost) {
        return 'skeleton-collision';
      }
    }

    if (candidate.familyStem) {
      const fs = flatten(candidate.familyStem);
      if (fs.length >= 3 && (this.familyStems.get(fs) ?? 0) >= this.stemBudget + budgetBoost) {
        return 'surname-stem-collision';
      }
    }

    if ((this.structures.get(candidate.structureId) ?? 0) >= this.structureBudget + budgetBoost * 2) {
      return 'structure-overused';
    }

    // Near-identical personal names, even when every other key differs.
    if (candidate.skipPhoneticKeys) return null;
    const threshold = Math.min(0.95, this.baseThreshold + relax * 0.2);
    const syl = syllableEstimate(given);
    for (const prior of this.givens) {
      if (Math.abs(syllableEstimate(prior) - syl) > 1) continue;
      if (similarity(prior, given) > threshold) return 'too-similar';
    }

    return null;
  }

  commit(candidate: BatchCandidate): void {
    const full = flatten(candidate.full);
    this.fullNames.add(full);
    this.recent.add(full);
    this.components.add(flatten(candidate.given));
    if (candidate.family) this.components.add(flatten(candidate.family));
    this.givens.push(candidate.given);

    bump(this.heads, headKey(candidate.given));
    if (!candidate.skipPhoneticKeys) {
      bump(this.rhymes, rhymeKey(candidate.given));
      bump(this.skeletons, phoneticSkeleton(candidate.given));
    }
    bump(this.structures, candidate.structureId);
    if (candidate.familyStem) bump(this.familyStems, flatten(candidate.familyStem));
  }

  get accepted(): number {
    return this.fullNames.size;
  }
}

function bump(map: Map<string, number>, key: string): void {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}
