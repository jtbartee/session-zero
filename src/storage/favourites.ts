/**
 * Saved characters.
 *
 * A favourite stores the whole record — name, species, background, hook and
 * the settings that produced it — so a user can see later why a name came out
 * the way it did, and export something useful.
 */

import type { GeneratedCharacter } from '../types/index.ts';
import { readJson, storageAvailable, writeJson } from './safeStorage.ts';

const KEY = 'session-zero:favourites';
const VERSION = 1;
const LIMIT = 500;

function isFavouriteArray(value: unknown): value is GeneratedCharacter[] {
  return Array.isArray(value)
    && value.every((v) => typeof v === 'object' && v !== null
      && typeof (v as GeneratedCharacter).id === 'string'
      && typeof (v as GeneratedCharacter).name === 'string');
}

export class FavouritesStore {
  private items: GeneratedCharacter[];
  private listeners = new Set<() => void>();
  /** False once a write has actually failed, so the UI can say so once. */
  private warned = false;

  constructor() {
    this.items = readJson(KEY, VERSION, isFavouriteArray) ?? [];
  }

  all(): readonly GeneratedCharacter[] {
    return this.items;
  }

  get size(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  /** Returns true when the character ended up saved. */
  toggle(character: GeneratedCharacter): boolean {
    const index = this.items.findIndex((item) => item.id === character.id);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.persist();
      return false;
    }
    this.items.unshift(character);
    if (this.items.length > LIMIT) this.items.length = LIMIT;
    this.persist();
    return true;
  }

  remove(id: string): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index < 0) return;
    this.items.splice(index, 1);
    this.persist();
  }

  clear(): void {
    this.items = [];
    this.persist();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** `null` when storage works; a message when it does not. */
  storageWarning(): string | null {
    if (storageAvailable()) return null;
    if (this.warned) return null;
    this.warned = true;
    return 'Browser storage is unavailable, so favourites will not survive a refresh.';
  }

  toJsonExport(): string {
    return JSON.stringify(
      {
        tool: 'Session Zero',
        exportedAt: new Date().toISOString(),
        count: this.items.length,
        characters: this.items.map((c) => ({
          name: c.name,
          shortName: c.shortName ?? null,
          species: c.speciesName,
          namingTradition: c.traditionLabel,
          background: c.backgroundName,
          hook: c.hook ?? null,
          settings: c.settings,
          savedAt: new Date(c.createdAt).toISOString(),
        })),
      },
      null,
      2,
    );
  }

  toTextExport(): string {
    const lines = ['SESSION ZERO — saved characters', `Exported ${new Date().toLocaleString()}`, ''];
    for (const c of this.items) {
      lines.push(c.name + (c.shortName ? `  (goes by ${c.shortName})` : ''));
      const meta = [c.speciesName, c.backgroundName, c.traditionLabel].filter(Boolean).join(' · ');
      if (meta) lines.push(`  ${meta}`);
      if (c.hook) lines.push(`  ${c.hook}`);
      lines.push('');
    }
    return lines.join('\n');
  }

  private persist(): void {
    writeJson(KEY, VERSION, this.items);
    for (const listener of this.listeners) listener();
  }
}
