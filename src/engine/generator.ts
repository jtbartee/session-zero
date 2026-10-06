/**
 * The generation engine.
 *
 * One pass produces one character: resolve species → resolve tradition →
 * choose a structure → run each slot's producer → apply background influence →
 * validate → check against the batch guard and recent history. Anything that
 * fails is retried with progressively relaxed constraints, so generation
 * always terminates while still preferring the strictest result it can get.
 */

import type {
  BackgroundSpec,
  Complexity,
  GeneratedCharacter,
  GenerationDiagnostics,
  GenerationOptions,
  GenderKey,
  GenderStyle,
  NameComponent,
  NameStructure,
  Producer,
  Slot,
  SpeciesSpec,
  Tradition,
} from '../types/index.ts';
import { BatchGuard, UsageLedger } from './diversity.ts';
import { ProducerContext, TokenKind, capitalise, exponentForStyle, runProducer } from './grammar.ts';
import { generateHook } from './hooks.ts';
import { Rng, weightedPick } from './rng.ts';
import { RejectionReason, validateName } from './validation.ts';

// ---------------------------------------------------------------------------
// Ports
// ---------------------------------------------------------------------------

/** Where recently generated names are remembered between sessions. */
export interface HistoryPort {
  recent(): readonly string[];
  remember(name: string): void;
}

export class MemoryHistory implements HistoryPort {
  private names: string[] = [];
  constructor(private readonly limit = 600) {}
  recent(): readonly string[] {
    return this.names;
  }
  remember(name: string): void {
    this.names.push(name);
    if (this.names.length > this.limit) this.names.splice(0, this.names.length - this.limit);
  }
}

export interface EngineCatalogue {
  speciesById: ReadonlyMap<string, SpeciesSpec>;
  pickableSpecies: readonly SpeciesSpec[];
  backgroundsById: ReadonlyMap<string, BackgroundSpec>;
  pickableBackgrounds: readonly BackgroundSpec[];
  /** Used when `species` is `null`. */
  generic: SpeciesSpec;
}

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 48;
/** Attempts before the guard starts relaxing. */
const STRICT_ATTEMPTS = 18;
/** How many recent hook openings to remember across batches. */
const HOOK_OPENER_MEMORY = 40;

const GENDER_SPREAD: ReadonlyArray<readonly [GenderKey, number]> = [
  ['masculine', 4],
  ['feminine', 4],
  ['neutral', 3],
];

function resolveGender(rng: Rng, style: GenderStyle, tradition: Tradition): GenderKey | null {
  if (tradition.genderPolicy === 'neutral') return null;
  if (style === 'any') {
    if (tradition.genderPolicy === 'mixed' && rng.chance(0.12)) return null;
    return weightedPick<GenderKey>(rng, GENDER_SPREAD) ?? 'neutral';
  }
  return style;
}

/**
 * Social register nudges which structures feel right. This is deliberately a
 * gentle multiplier: a Noble is a little more likely to carry a family name,
 * not guaranteed one, and no register ever makes a structure impossible.
 */
function registerBias(background: BackgroundSpec | null, structure: NameStructure): number {
  if (!background) return 1;
  const roles = new Set(structure.slots.map((s) => s.role));
  const hasFamily = roles.has('family') || roles.has('clan');
  const hasEpithet = roles.has('epithet') || roles.has('nickname');
  const bare = structure.slots.length === 1;

  switch (background.register) {
    case 'formal':
      return hasFamily ? 1.35 : bare ? 0.7 : 1;
    case 'learned':
      return hasFamily ? 1.15 : 1;
    case 'mercantile':
      return hasFamily ? 1.25 : bare ? 0.8 : 1;
    case 'itinerant':
      return bare ? 1.3 : hasEpithet ? 1.15 : 0.95;
    case 'martial':
      return hasEpithet ? 1.25 : 1;
    case 'devout':
      return hasEpithet ? 1.15 : bare ? 1.1 : 1;
    default:
      return 1;
  }
}

function eligibleStructures(
  tradition: Tradition,
  complexity: Complexity,
  style: GenerationOptions['style'],
): NameStructure[] {
  const matches = tradition.structures.filter((s) => {
    if (s.minComplexity && complexity < s.minComplexity) return false;
    if (s.maxComplexity && complexity > s.maxComplexity) return false;
    if (s.styles && !s.styles.includes(style)) return false;
    return true;
  });
  // Never leave a tradition with nothing to build.
  return matches.length > 0 ? matches : [...tradition.structures];
}

/** The leading morpheme of a compound surname — "Iron" in "Ironbeard". */
function leadingStem(text: string): string | undefined {
  if (!text) return undefined;
  const firstWord = text.split(/[\s-]/)[0] ?? text;
  const inner = firstWord.replace(/[^A-Za-z]/g, '');
  if (inner.length <= 4) return inner;
  // Split a fused compound at the second capital, else take the opening.
  const secondCap = inner.slice(1).search(/[A-Z]/);
  if (secondCap > 2) return inner.slice(0, secondCap + 1);
  return inner.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export interface NameEngineOptions {
  catalogue: EngineCatalogue;
  history?: HistoryPort;
  ledger?: UsageLedger;
}

interface BuiltName {
  full: string;
  shortName?: string;
  components: NameComponent[];
  given: string;
  family?: string;
  familyStem?: string;
  skipPhoneticKeys?: boolean;
}

export class NameEngine {
  private readonly catalogue: EngineCatalogue;
  private readonly history: HistoryPort;
  private readonly ledger: UsageLedger;
  /**
   * Hook openings used recently on this engine. A party built one card at a
   * time is several single-name batches, so a per-batch set alone would let
   * the same opening come round again immediately.
   */
  private readonly recentHookOpeners = new Set<string>();

  constructor(options: NameEngineOptions) {
    this.catalogue = options.catalogue;
    this.history = options.history ?? new MemoryHistory();
    this.ledger = options.ledger ?? new UsageLedger();
  }

  /** Generate a batch. */
  generate(options: GenerationOptions): { characters: GeneratedCharacter[]; diagnostics: GenerationDiagnostics } {
    const started = Date.now();
    const rng = new Rng(options.seed);
    const count = Math.max(1, Math.min(50, Math.floor(options.count)));
    const guard = new BatchGuard({
      batchSize: count,
      recent: this.history.recent(),
      structureVariants: this.countStructureVariants(options),
    });
    const rejections: Record<string, number> = {};
    const hookSeen = this.recentHookOpeners;
    let attempts = 0;

    const characters: GeneratedCharacter[] = [];
    for (let i = 0; i < count; i++) {
      const result = this.generateOne(rng, options, guard, rejections, hookSeen);
      attempts += result.attempts;
      if (result.character) {
        characters.push(result.character);
        this.history.remember(result.character.name);
      }
    }

    this.trimHookOpeners();
    return {
      characters,
      diagnostics: { attempts, rejections, elapsedMs: Date.now() - started },
    };
  }

  /**
   * Regenerate a single card, leaving the rest of a batch untouched. The
   * caller passes the names currently on screen so the replacement does not
   * collide with any of them.
   */
  reroll(options: GenerationOptions, siblingNames: readonly string[]): GeneratedCharacter | null {
    const rng = new Rng(options.seed);
    const guard = new BatchGuard({
      batchSize: Math.max(2, siblingNames.length + 1),
      recent: this.history.recent(),
      structureVariants: this.countStructureVariants(options),
    });
    for (const name of siblingNames) {
      guard.commit({ full: name, given: name.split(' ')[0] ?? name, structureId: '__sibling__' });
    }
    const rejections: Record<string, number> = {};
    const result = this.generateOne(rng, { ...options, count: 1 }, guard, rejections, this.recentHookOpeners);
    if (result.character) this.history.remember(result.character.name);
    this.trimHookOpeners();
    return result.character;
  }

  /** Exposed so the stress harness can inspect component pressure. */
  get usage(): UsageLedger {
    return this.ledger;
  }

  /** Keep the opener memory bounded; a Set evicts in insertion order. */
  private trimHookOpeners(): void {
    const excess = this.recentHookOpeners.size - HOOK_OPENER_MEMORY;
    if (excess <= 0) return;
    let removed = 0;
    for (const opener of this.recentHookOpeners) {
      if (removed++ >= excess) break;
      this.recentHookOpeners.delete(opener);
    }
  }

  /**
   * How many distinct structures the chosen species can produce at this
   * complexity. The batch guard needs this: demanding structural variety from
   * a tradition that has exactly one structure rejects every name after the
   * first few for no reason.
   */
  private countStructureVariants(options: GenerationOptions): number {
    // 'random' draws a different species per name, and structure ids are
    // namespaced by species, so collisions there are already unlikely.
    if (options.species === 'random') return 24;
    const species = options.species === null
      ? this.catalogue.generic
      : this.catalogue.speciesById.get(options.species);
    if (!species) return 24;
    let total = 0;
    for (const tradition of species.traditions) {
      total += eligibleStructures(tradition, options.complexity, options.style).length;
    }
    return Math.max(1, total);
  }

  // -------------------------------------------------------------------------

  private generateOne(
    rng: Rng,
    options: GenerationOptions,
    guard: BatchGuard,
    rejections: Record<string, number>,
    hookSeen: Set<string>,
  ): { character: GeneratedCharacter | null; attempts: number } {
    const species = this.resolveSpecies(rng, options.species);
    const background = this.resolveBackground(rng, options.background);
    const exponent = exponentForStyle(options.style);

    let attempts = 0;
    let fallback: { built: BuiltName; tradition: Tradition; structure: NameStructure } | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      attempts++;
      const relaxation = attempt < STRICT_ATTEMPTS ? 0 : (attempt - STRICT_ATTEMPTS) / (MAX_ATTEMPTS - STRICT_ATTEMPTS);

      const tradition = this.pickTradition(rng, species, exponent);
      const structure = this.pickStructure(rng, tradition, options, background, exponent);
      const gender = resolveGender(rng, options.genderStyle, tradition);

      const built = this.buildName(rng, {
        species,
        tradition,
        structure,
        background,
        gender,
        complexity: options.complexity,
        style: options.style,
        exponent,
        relaxation,
      });
      if (!built) {
        bump(rejections, 'producer-failed');
        continue;
      }

      const invalid = validateName(built.full, { banned: species.banned });
      if (invalid) {
        bump(rejections, invalid satisfies RejectionReason);
        continue;
      }

      if (!fallback) fallback = { built, tradition, structure };

      const collision = guard.check(
        {
          full: built.full,
          given: built.given,
          family: built.family,
          familyStem: built.familyStem,
          skipPhoneticKeys: built.skipPhoneticKeys,
          structureId: `${species.id}:${structure.id}`,
        },
        relaxation,
      );
      if (collision) {
        bump(rejections, collision);
        continue;
      }

      return {
        character: this.finish(rng, built, { species, tradition, structure, background, options, guard, hookSeen }),
        attempts,
      };
    }

    // Every attempt collided. Accept the best valid candidate we saw rather
    // than returning a gap in the batch.
    if (fallback) {
      bump(rejections, 'accepted-after-exhaustion');
      return {
        character: this.finish(rng, fallback.built, {
          species, tradition: fallback.tradition, structure: fallback.structure,
          background, options, guard, hookSeen,
        }),
        attempts,
      };
    }
    bump(rejections, 'gave-up');
    return { character: null, attempts };
  }

  private finish(
    rng: Rng,
    built: BuiltName,
    ctx: {
      species: SpeciesSpec;
      tradition: Tradition;
      structure: NameStructure;
      background: BackgroundSpec | null;
      options: GenerationOptions;
      guard: BatchGuard;
      hookSeen: Set<string>;
    },
  ): GeneratedCharacter {
    const { species, tradition, structure, background, options, guard, hookSeen } = ctx;
    guard.commit({
      full: built.full,
      given: built.given,
      family: built.family,
      familyStem: built.familyStem,
      skipPhoneticKeys: built.skipPhoneticKeys,
      structureId: `${species.id}:${structure.id}`,
    });
    this.ledger.record('structure', `${species.id}:${structure.id}`);
    this.ledger.record('tradition', `${species.id}:${tradition.id}`);
    this.ledger.decay();

    const named = options.species !== null;
    return {
      id: `sz_${rng.int(0xffffffff).toString(36)}${Date.now().toString(36)}`,
      name: built.full,
      shortName: built.shortName,
      components: built.components,
      speciesId: named ? species.id : null,
      speciesName: named ? species.name : null,
      traditionId: named ? tradition.id : null,
      traditionLabel: named ? tradition.label : null,
      structureId: structure.id,
      backgroundId: background?.id ?? null,
      backgroundName: background?.name ?? null,
      hook: options.includeHook
        ? generateHook({ rng, species: named ? species : null, background, seen: hookSeen })
        : undefined,
      settings: {
        style: options.style,
        complexity: options.complexity,
        genderStyle: options.genderStyle,
      },
      createdAt: Date.now(),
    };
  }

  // -------------------------------------------------------------------------

  private resolveSpecies(rng: Rng, selection: GenerationOptions['species']): SpeciesSpec {
    if (selection === null) return this.catalogue.generic;
    if (selection === 'random') {
      const pool = this.catalogue.pickableSpecies;
      return pool[rng.int(pool.length)] ?? this.catalogue.generic;
    }
    return this.catalogue.speciesById.get(selection) ?? this.catalogue.generic;
  }

  private resolveBackground(rng: Rng, selection: GenerationOptions['background']): BackgroundSpec | null {
    if (selection === null) return null;
    if (selection === 'random') {
      const pool = this.catalogue.pickableBackgrounds;
      return pool[rng.int(pool.length)] ?? null;
    }
    return this.catalogue.backgroundsById.get(selection) ?? null;
  }

  private pickTradition(rng: Rng, species: SpeciesSpec, exponent: number): Tradition {
    const options = species.traditions.map((t) => [t, t.weight] as const);
    const picked = weightedPick<Tradition>(rng, options, {
      exponent,
      penalty: (t) => this.ledger.penalty('tradition', `${species.id}:${t.id}`),
    });
    return picked ?? (species.traditions[0] as Tradition);
  }

  private pickStructure(
    rng: Rng,
    tradition: Tradition,
    options: GenerationOptions,
    background: BackgroundSpec | null,
    exponent: number,
  ): NameStructure {
    const pool = eligibleStructures(tradition, options.complexity, options.style);
    const weighted = pool.map((s) => [s, s.weight * registerBias(background, s)] as const);
    const picked = weightedPick<NameStructure>(rng, weighted, {
      exponent,
      penalty: (s) => this.ledger.penalty('structure', `${tradition.id}:${s.id}`),
    });
    return picked ?? (pool[0] as NameStructure);
  }

  // -------------------------------------------------------------------------

  private buildName(
    rng: Rng,
    args: {
      species: SpeciesSpec;
      tradition: Tradition;
      structure: NameStructure;
      background: BackgroundSpec | null;
      gender: GenderKey | null;
      complexity: Complexity;
      style: GenerationOptions['style'];
      exponent: number;
      relaxation: number;
    },
  ): BuiltName | null {
    const { species, tradition, structure, background, gender, complexity, style, exponent, relaxation } = args;
    const producers: Record<string, Producer> = { ...species.sharedProducers, ...tradition.producers };

    const ctx: ProducerContext = {
      rng,
      complexity,
      style,
      gender,
      exponent,
      // Relaxing the penalty late in the retry loop keeps rare components
      // reachable instead of starving the pool.
      penalty: (kind: TokenKind, token: string) => {
        const p = this.ledger.penalty(kind, token);
        return relaxation > 0 ? p + (1 - p) * relaxation : p;
      },
      record: (kind: TokenKind, token: string) => this.ledger.record(kind, token),
    };

    const components: NameComponent[] = [];
    const rendered: string[] = [];
    let given = '';
    let family: string | undefined;
    let shortName: string | undefined;

    for (const slot of structure.slots) {
      const chance = slotChance(slot, complexity);
      if (chance < 1 && !rng.chance(chance)) continue;

      const producer = producers[slot.producer];
      if (!producer) return null;

      const slotCtx: ProducerContext = slot.genderOverride
        ? { ...ctx, gender: slot.genderOverride }
        : ctx;

      const out = runProducer(slotCtx, producer);
      if (!out || !out.text) return null;

      const text = `${slot.prefix ?? ''}${out.text}${slot.suffix ?? ''}`;
      components.push({ role: slot.role, text: out.text, label: slot.label });
      rendered.push(`${rendered.length > 0 ? (slot.separator ?? ' ') : ''}${text}`);

      if (!given && (slot.role === 'given' || slot.role === 'birthname')) given = out.text;
      if (!family && (slot.role === 'family' || slot.role === 'clan')) family = out.text;
      if (!shortName && out.short) shortName = out.short;
    }

    if (components.length === 0) return null;
    if (!given) given = components[0]!.text;

    let full = rendered.join('').replace(/\s{2,}/g, ' ').trim();

    // --- background influence ------------------------------------------------
    const influence = tradition.backgroundInfluence ?? { epithet: true };
    if (background) {
      const roles = new Set(components.map((c) => c.role));

      // An honorific, only where the culture already uses Common-language ones.
      if (influence.title && background.titles?.length && !roles.has('title')
          && rng.chance(0.12 + complexity * 0.03)) {
        const title = rng.pick(background.titles);
        components.unshift({ role: 'title', text: title, label: 'Title' });
        full = `${title} ${full}`;
      }

      // An occupational byname replaces nothing; it is appended as a family
      // name only when the culture has no clan name of its own in this result.
      if (influence.byname && background.bynames?.length && !roles.has('family') && !roles.has('clan')
          && rng.chance(background.bynameChance)) {
        const byname = rng.pick(background.bynames);
        const text = capitalise(byname.form);
        components.push({ role: 'family', text, label: 'Byname' });
        full = `${full} ${text}`;
        family = text;
      }

      // An earned epithet works in almost any culture.
      if ((influence.epithet ?? true) && background.epithets?.length
          && !roles.has('epithet') && !roles.has('nickname')
          && rng.chance(0.06 + complexity * 0.035)) {
        const epithet = rng.pick(background.epithets);
        components.push({ role: 'epithet', text: epithet, label: 'Epithet' });
        full = `${full}, ${epithet}`;
      }
    }

    full = full.replace(/\s{2,}/g, ' ').trim();
    if (!full) return null;

    return {
      full,
      shortName: shortName && shortName.toLowerCase() !== full.toLowerCase() ? shortName : undefined,
      components,
      given,
      family,
      familyStem: family ? leadingStem(family) : undefined,
      skipPhoneticKeys: components[0]?.role === 'designation',
    };
  }
}

function slotChance(slot: Slot, complexity: Complexity): number {
  const base = slot.chance ?? 1;
  const modifier = slot.chanceByComplexity?.[complexity];
  return modifier === undefined ? base : Math.max(0, Math.min(1, base * modifier));
}

function bump(counter: Record<string, number>, key: string): void {
  counter[key] = (counter[key] ?? 0) + 1;
}
