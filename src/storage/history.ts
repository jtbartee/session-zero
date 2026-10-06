/**
 * The persistent recent-name list.
 *
 * This is what stops the generator handing you the same name next week. It is
 * deliberately bounded: an unbounded history would grow without limit and slow
 * every batch down.
 */

import type { HistoryPort } from '../engine/generator.ts';
import { readJson, writeJson } from './safeStorage.ts';

const KEY = 'session-zero:recent';
const VERSION = 1;
const LIMIT = 800;
/** Writing on every single name would thrash storage during a batch of 20. */
const FLUSH_DELAY = 400;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export class LocalHistory implements HistoryPort {
  private names: string[];
  private flushTimer: number | null = null;

  constructor() {
    this.names = readJson(KEY, VERSION, isStringArray) ?? [];
    if (this.names.length > LIMIT) this.names = this.names.slice(-LIMIT);
  }

  recent(): readonly string[] {
    return this.names;
  }

  remember(name: string): void {
    this.names.push(name);
    if (this.names.length > LIMIT) this.names.splice(0, this.names.length - LIMIT);
    this.scheduleFlush();
  }

  clear(): void {
    this.names = [];
    writeJson(KEY, VERSION, this.names);
  }

  get size(): number {
    return this.names.length;
  }

  private scheduleFlush(): void {
    if (this.flushTimer !== null) return;
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      writeJson(KEY, VERSION, this.names);
    }, FLUSH_DELAY);
  }
}
