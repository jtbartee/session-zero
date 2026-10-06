/**
 * Small constructors so species files read as data rather than boilerplate.
 */

import type { Choices, Complexity, NameStructure, Slot, SlotRole } from '../../types/index.ts';

/** Build a slot. */
export function S(role: SlotRole, producer: string, extra: Partial<Slot> = {}): Slot {
  return { role, producer, ...extra };
}

/** Build a name structure. */
export function ST(
  id: string,
  weight: number,
  slots: Slot[],
  extra: Partial<NameStructure> = {},
): NameStructure {
  return { id, weight, slots, ...extra };
}

// ---------------------------------------------------------------------------
// Syllable-count presets, indexed by the complexity dial
// ---------------------------------------------------------------------------

type SylTable = Partial<Record<Complexity, Choices<number>>>;

/** One to two syllables: Orc, Goblin, Changeling true names. */
export const TERSE: SylTable = {
  1: [[1, 8], [2, 2]],
  2: [[1, 6], [2, 4]],
  3: [[1, 4], [2, 6]],
  4: [[1, 2], [2, 7], [3, 1]],
  5: [[1, 1], [2, 6], [3, 3]],
};

/** Two syllables with a little room: Orc, Goblin, most short personal names. */
export const SHORT: SylTable = {
  1: [[1, 5], [2, 5]],
  2: [[1, 3], [2, 7]],
  3: [[2, 9], [3, 1]],
  4: [[2, 7], [3, 3]],
  5: [[2, 5], [3, 5]],
};

/** The default personal-name shape: two, sometimes three. */
export const MEDIUM: SylTable = {
  1: [[1, 3], [2, 7]],
  2: [[2, 9], [3, 1]],
  3: [[2, 7], [3, 3]],
  4: [[2, 5], [3, 5]],
  5: [[2, 3], [3, 6], [4, 1]],
};

/** Flowing, three-plus: Elf family names, Loxodon, Kalashtar. */
export const LONG: SylTable = {
  1: [[2, 8], [3, 2]],
  2: [[2, 7], [3, 3]],
  3: [[3, 7], [4, 3]],
  4: [[3, 6], [4, 4]],
  5: [[3, 4], [4, 5], [5, 1]],
};

/** Deliberately enormous: Dragonborn clans, Goliath birth names. */
export const EPIC: SylTable = {
  1: [[3, 7], [4, 3]],
  2: [[3, 6], [4, 4]],
  3: [[4, 7], [5, 3]],
  4: [[4, 6], [5, 4]],
  5: [[4, 4], [5, 5], [6, 1]],
};
