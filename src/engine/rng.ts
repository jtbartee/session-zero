/**
 * Deterministic, seedable pseudo-random number generation.
 *
 * Every random decision in the engine flows through an `Rng` instance so that
 * tests and the stress harness can reproduce an exact sequence from a seed.
 */

import type { Choices, Weighted } from '../types/index.ts';

/** 32-bit mix used to turn an arbitrary seed into a well-distributed state. */
function splitmix32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private next01: () => number;
  readonly seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? ((Math.random() * 0x100000000) >>> 0);
    this.next01 = splitmix32(this.seed);
  }

  /** Uniform float in [0, 1). */
  float(): number {
    return this.next01();
  }

  /** Uniform integer in [0, max). Returns 0 when `max <= 0`. */
  int(max: number): number {
    if (max <= 0) return 0;
    return Math.floor(this.next01() * max);
  }

  /** Uniform integer in [min, max] inclusive. */
  range(min: number, max: number): number {
    if (max <= min) return min;
    return min + this.int(max - min + 1);
  }

  /** True with the given probability. */
  chance(p: number): boolean {
    if (p >= 1) return true;
    if (p <= 0) return false;
    return this.next01() < p;
  }

  /** Uniform pick from a plain array. Throws on an empty array. */
  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick called with an empty array');
    return items[this.int(items.length)] as T;
  }

  /** Fisher–Yates shuffle, returning a new array. */
  shuffle<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      const a = out[i] as T;
      out[i] = out[j] as T;
      out[j] = a;
    }
    return out;
  }
}

// ---------------------------------------------------------------------------
// Weighted choice with style shaping and diversity penalties
// ---------------------------------------------------------------------------

/** True when a `Choices<T>` list uses the `[value, weight]` tuple form. */
function isWeightedList<T>(items: Choices<T>): items is readonly Weighted<T>[] {
  const first = items[0];
  return Array.isArray(first) && first.length === 2 && typeof first[1] === 'number';
}

export interface Normalised<T> {
  value: T;
  weight: number;
}

/** Flatten either `Choices` form into `{value, weight}` records. */
export function normalise<T>(items: Choices<T>): Normalised<T>[] {
  if (items.length === 0) return [];
  if (isWeightedList(items)) {
    return (items as readonly Weighted<T>[]).map(([value, weight]) => ({
      value,
      weight: weight > 0 ? weight : 0,
    }));
  }
  return (items as readonly T[]).map((value) => ({ value, weight: 1 }));
}

export interface WeightShaping<T> {
  /**
   * Exponent applied to every weight. `> 1` sharpens toward common choices
   * (Traditional); `< 1` flattens, surfacing rarities (Wild).
   */
  exponent?: number;
  /** Per-candidate multiplier, used for diversity penalties. */
  penalty?: (value: T) => number;
}

/**
 * Weighted selection. Returns `undefined` only when every candidate has been
 * reduced to zero weight, which callers treat as "relax the constraints".
 */
export function weightedPick<T>(
  rng: Rng,
  items: Choices<T>,
  shaping?: WeightShaping<T>,
): T | undefined {
  const pool = normalise(items);
  if (pool.length === 0) return undefined;

  const exponent = shaping?.exponent ?? 1;
  const penalty = shaping?.penalty;

  let total = 0;
  const weights = new Array<number>(pool.length);
  for (let i = 0; i < pool.length; i++) {
    const entry = pool[i] as Normalised<T>;
    let w = entry.weight;
    if (w <= 0) {
      weights[i] = 0;
      continue;
    }
    if (exponent !== 1) w = Math.pow(w, exponent);
    if (penalty) w *= penalty(entry.value);
    if (!Number.isFinite(w) || w <= 0) w = 0;
    weights[i] = w;
    total += w;
  }

  if (total <= 0) return undefined;

  let roll = rng.float() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i] as number;
    if (roll <= 0) return (pool[i] as Normalised<T>).value;
  }
  return (pool[pool.length - 1] as Normalised<T>).value;
}

/**
 * Keep only the candidates a predicate accepts, preserving weights. Returns
 * `null` when nothing survives, so callers can fall back deliberately.
 */
export function filterChoices<T>(
  items: Choices<T>,
  predicate: (value: T) => boolean,
): readonly Weighted<T>[] | null {
  const kept: Weighted<T>[] = [];
  for (const entry of normalise(items)) {
    if (entry.weight > 0 && predicate(entry.value)) kept.push([entry.value, entry.weight] as const);
  }
  return kept.length > 0 ? kept : null;
}

/**
 * Weighted selection that never fails: when penalties zero everything out it
 * falls back to an unpenalised draw.
 */
export function weightedPickOrFallback<T>(
  rng: Rng,
  items: Choices<T>,
  shaping?: WeightShaping<T>,
): T {
  const picked = weightedPick(rng, items, shaping);
  if (picked !== undefined) return picked;
  const relaxed = weightedPick(rng, items, { exponent: shaping?.exponent ?? 1 });
  if (relaxed !== undefined) return relaxed;
  const pool = normalise(items);
  if (pool.length === 0) throw new Error('weightedPickOrFallback called with an empty list');
  return (pool[rng.int(pool.length)] as Normalised<T>).value;
}
