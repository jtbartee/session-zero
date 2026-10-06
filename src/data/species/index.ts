/**
 * The species registry.
 *
 * `ALL_SPECIES` is what the picker shows. `GENERIC` is deliberately excluded —
 * it backs the "Not Specified" option and is not a species anyone can choose.
 */

import type { SpeciesSpec } from '../../types/index.ts';
import { CORE_SPECIES } from './core.ts';
import { GENERIC } from './generic.ts';
import { ELF_KIN_SPECIES } from './elf-kin.ts';
import { GOBLINOIDS_SPECIES } from './goblinoids.ts';
import { BEASTFOLK_SPECIES } from './beastfolk.ts';
import { PLANAR_SPECIES } from './planar.ts';
import { CONSTRUCTS_SPECIES } from './constructs.ts';
import { FEY_WILD_SPECIES } from './fey-and-wild.ts';
import { LINEAGES_SPECIES } from './lineages.ts';

export const EXPANDED_SPECIES: SpeciesSpec[] = [
  ...ELF_KIN_SPECIES,
  ...LINEAGES_SPECIES,
  ...GOBLINOIDS_SPECIES,
  ...BEASTFOLK_SPECIES,
  ...PLANAR_SPECIES,
  ...FEY_WILD_SPECIES,
  ...CONSTRUCTS_SPECIES,
].sort((a, b) => a.name.localeCompare(b.name));

/** Everything a user can pick, core first. */
export const ALL_SPECIES: SpeciesSpec[] = [...CORE_SPECIES, ...EXPANDED_SPECIES];

export const SPECIES_BY_ID = new Map<string, SpeciesSpec>(
  [...ALL_SPECIES, GENERIC].map((s) => [s.id, s]),
);

/** Grouped for the picker: core first, then expanded sub-groups. */
export function speciesGroups(): Array<{ label: string; species: SpeciesSpec[] }> {
  const groups = new Map<string, SpeciesSpec[]>();
  for (const spec of ALL_SPECIES) {
    const list = groups.get(spec.group);
    if (list) list.push(spec);
    else groups.set(spec.group, [spec]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => {
    if (a.startsWith('Core')) return -1;
    if (b.startsWith('Core')) return 1;
    return a.localeCompare(b);
  });
  return ordered.map(([label, species]) => ({ label, species }));
}

export { CORE_SPECIES, GENERIC };
