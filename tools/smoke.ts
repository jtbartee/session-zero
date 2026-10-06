import { CATALOGUE } from '../src/engine/catalogue.ts';
import { NameEngine } from '../src/engine/generator.ts';
import type { Complexity, GenerationOptions, NameStyle } from '../src/types/index.ts';

const engine = new NameEngine({ catalogue: CATALOGUE });

function show(label: string, opts: Partial<GenerationOptions>) {
  const options: GenerationOptions = {
    species: null, background: null, genderStyle: 'any', style: 'distinctive',
    complexity: 3, count: 8, includeHook: false, seed: 1234, ...opts,
  };
  const { characters, diagnostics } = engine.generate(options);
  console.log(`\n=== ${label} (${diagnostics.attempts} attempts, ${diagnostics.elapsedMs}ms) ===`);
  for (const c of characters) {
    const extra = [c.shortName && `“${c.shortName}”`, c.traditionLabel].filter(Boolean).join(' · ');
    console.log(`  ${c.name.padEnd(42)} ${extra}`);
  }
  const rej = Object.entries(diagnostics.rejections).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (rej.length) console.log('  rejections:', rej.map(([k, v]) => `${k}=${v}`).join(' '));
}

for (const id of ['dwarf', 'elf', 'dragonborn', 'tiefling', 'halfling', 'gnome', 'goliath', 'orc', 'human', 'aasimar']) {
  show(id, { species: id });
}
show('unspecified', { species: null });
show('random species', { species: 'random' });
show('wild dwarf', { species: 'dwarf', style: 'wild' as NameStyle, complexity: 5 as Complexity });
show('traditional elf simple', { species: 'elf', style: 'traditional' as NameStyle, complexity: 1 as Complexity });

const withHooks = engine.generate({
  species: 'dwarf', background: 'sage', genderStyle: 'any', style: 'distinctive',
  complexity: 3, count: 3, includeHook: true, seed: 99,
});
console.log('\n=== hooks ===');
for (const c of withHooks.characters) console.log(`  ${c.name}\n    ${c.hook}`);
