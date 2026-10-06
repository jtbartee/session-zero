/** Wires the data registries into the shape the engine expects. */

import { ALL_BACKGROUNDS, BACKGROUNDS_BY_ID } from '../data/backgrounds/index.ts';
import { ALL_SPECIES, GENERIC, SPECIES_BY_ID } from '../data/species/index.ts';
import type { EngineCatalogue } from './generator.ts';

export const CATALOGUE: EngineCatalogue = {
  speciesById: SPECIES_BY_ID,
  pickableSpecies: ALL_SPECIES,
  backgroundsById: BACKGROUNDS_BY_ID,
  pickableBackgrounds: ALL_BACKGROUNDS,
  generic: GENERIC,
};
