/**
 * localStorage that never throws.
 *
 * Storage is unavailable in private windows on some browsers, when a user has
 * blocked site data, and inside embedded previews. Every accessor here can
 * fail, so every accessor is wrapped and the app degrades to in-memory state
 * rather than breaking.
 */

const memory = new Map<string, string>();
let available: boolean | null = null;

function probe(): boolean {
  if (available !== null) return available;
  try {
    const key = '__sz_probe__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function storageAvailable(): boolean {
  return probe();
}

export function readRaw(key: string): string | null {
  if (!probe()) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function writeRaw(key: string, value: string): boolean {
  memory.set(key, value);
  if (!probe()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    // Most often a quota error. Fall back to memory for this session.
    available = false;
    return false;
  }
}

export function removeRaw(key: string): void {
  memory.delete(key);
  if (!probe()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* nothing useful to do */
  }
}

/**
 * Read and validate JSON. A schema version is stored alongside the payload so
 * a future format change can be detected instead of crashing on old data.
 */
export function readJson<T>(key: string, version: number, validate: (value: unknown) => value is T): T | null {
  const raw = readRaw(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const envelope = parsed as { version?: unknown; data?: unknown };
    if (envelope.version !== version) return null;
    return validate(envelope.data) ? envelope.data : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, version: number, data: unknown): boolean {
  try {
    return writeRaw(key, JSON.stringify({ version, data }));
  } catch {
    return false;
  }
}
