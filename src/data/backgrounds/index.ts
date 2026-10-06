import type { BackgroundSpec } from '../../types/index.ts';
import { CORE_BACKGROUNDS } from './core.ts';
import { EXPANDED_BACKGROUNDS } from './expanded.ts';

export const ALL_BACKGROUNDS: BackgroundSpec[] = [...CORE_BACKGROUNDS, ...EXPANDED_BACKGROUNDS];

export const BACKGROUNDS_BY_ID = new Map(ALL_BACKGROUNDS.map((b) => [b.id, b]));

export { CORE_BACKGROUNDS, EXPANDED_BACKGROUNDS };
