# Session Zero

**A fantasy character name generator.**
Lore-informed, procedurally generated, free, and entirely offline after first load.

> **Live:** <https://jtbartee.github.io/session-zero/>

Session Zero makes believable names for Dungeons & Dragons characters — 56
species and lineages, 38 backgrounds, and a naming engine that actually knows
the difference between a dwarf clan name and a tabaxi descriptive phrase.

It is not a list of pre-written names being shuffled. Every name is assembled
at the moment you ask for it, from phonologies, morpheme sets and grammars
built from what published material says about how each people names itself.

---

## What it does

- **56 playable species and lineages** — all ten from the 2024 Player's
  Handbook, plus 46 expanded and legacy options, grouped and searchable.
- **38 backgrounds** — all sixteen from the 2024 Player's Handbook, plus 22
  compatible legacy and supplement backgrounds.
- **Six naming architectures**, used where each actually belongs: phonetic
  construction, morphological stems, compounds, descriptive phrases, chosen
  and virtue names, and closed sets where the set really is closed.
- **76 naming traditions across 209 name structures** — a tiefling can get an
  inherited Infernal name, an ordinary regional name, or a chosen virtue name,
  because all three are canonical.
- **Character hooks** — one sentence of situation per name, from a procedural
  grammar. No AI service, no network call.
- **Favourites** — saved locally, exportable as JSON or plain text.
- **Anti-repetition** that understands repetition means *sounding* the same,
  not just being a different string.

No account. No server. No database. No API key. No analytics. No ads. No
network requests at all once the page has loaded.

---

## Quick start

```bash
git clone https://github.com/jtbartee/session-zero.git
cd session-zero
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the full test suite (584 tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run stress` | Generate 10,000 names per species and report on them |
| `npm run stress:full` | The same at 100,000 names per species |

Requires Node 20 or newer.

---

## How the generation works

### Data and logic are separate

`src/data/` describes what names look like. `src/engine/` turns that into
names. Adding a species means adding a data file; it never means touching the
engine.

### Six architectures, not one

The single biggest reason procedural names feel generated is that one
`prefix + suffix` routine is doing every culture. Session Zero has six, and
each species uses whichever ones its lore actually calls for:

| Architecture | What it builds | Used by |
| --- | --- | --- |
| **Phonetic** | Words from a species' own onsets, nuclei, codas and syllable shapes, with phonotactic rules and presentation-style terminations | Dwarf, Elf, Dragonborn, Orc and most others |
| **Morphological** | Meaningful stems glued into words, with glosses | Elvish house names, dwarven clans, gnome clans, Draconic words |
| **Compound** | Transparent Common-language compounds | Dwarf clan names, halfling families, earned epithets |
| **Descriptive phrase** | Grammatical multi-word names from templates | Tabaxi, Harengon, Firbolg, Warforged designations |
| **Chosen / virtue** | A concept adopted as a name | Tiefling virtue names, Warforged chosen words |
| **Closed set** | A genuinely finite set | Giff military ranks |

A dwarf gets a personal name plus a clan name because that is what dwarves
have. A tabaxi gets *Cloud on the Mountaintop* with *Cloud* as the everyday
short name, because that is what tabaxi have. A warforged gets one word,
because that is the whole point of a warforged's name.

### Structures carry the culture

A species has one or more **traditions**, each with weighted **structures** —
the ordered shape of a finished name. Dragonborn structures put the clan name
first, because dragonborn do. The complexity dial filters and re-weights
structures; the style dial sharpens or flattens every weighted choice in the
system, so Traditional leans on a culture's commonest sounds and Wild reaches
for its rare ones without leaving the culture.

### Backgrounds are a nudge, never a verdict

A background can shift social register, occasionally add an earned epithet or
an occupational byname, and colour the character hook. It never decides
morality or temperament. A Soldier does not get a violent name. A Criminal
does not get a sinister one. Each tradition declares how far a background may
reach into it, so a dragonborn clan name is never replaced by "Cooper".

---

## How repetition is prevented

Two layers, because the two kinds of repetition are different problems.

**A decaying usage ledger** tracks every component the engine has used — each
onset, stem, word, template and structure — and feeds a multiplicative penalty
back into weighted selection. A piece used once becomes slightly less likely;
used repeatedly, much less likely; left alone, it recovers. Components are
suppressed hard. Structures and traditions are suppressed only lightly, so a
dwarf keeps usually having a clan name instead of being flattened into
"variety".

**A per-request batch guard** rejects a finished candidate that is too close to
anything else in the batch or in the persistent recent-name history. It checks
exact names, exact components, rhyming tails, shared openings, a phonetic
skeleton with equivalent spellings collapsed together, the leading morpheme of
a compound surname, structural overuse, and normalised edit distance.

This is what catches the case that has no exact duplicates and is still wrong:

```
Dorrin Ironbeard
Borrin Ironhammer     <- rejected: rhymes with Dorrin, shares the Iron- stem
Korrin Ironforge      <- rejected
Thorrin Ironshield    <- rejected
```

When repeated attempts fail, the guard relaxes progressively, so generation
always terminates rather than hanging or returning a short batch.

A bounded history of the last 800 names persists in `localStorage`, so the
generator does not offer you the same name next week.

**What this does not claim.** The name space is not infinite and repetition is
not impossible. What is measured, and reported in
[TESTING.md](TESTING.md), is this: across **570,000 generated names**, 97.2%
of full names were unique at a 10,000-per-species sample, and **100.000% were
unique at a 500-per-species sample — zero duplicates in 28,500 names.** Seven
species whose published convention is "one ordinary word" have a genuinely
bounded ceiling; that is measured and documented rather than disguised.

---

## Supported content

**Core — 2024 Player's Handbook (10):** Aasimar, Dragonborn, Dwarf, Elf, Gnome,
Goliath, Halfling, Human, Orc, Tiefling.

**Expanded (46):** Aarakocra, Astral Elf, Autognome, Bugbear, Centaur,
Changeling, Deep Gnome, Dhampir, Duergar, Eladrin, Fairy, Firbolg, Genasi (air,
earth, fire and water traditions), Giff, Githyanki, Githzerai, Goblin, Hadozee,
Half-Elf, Half-Orc, Harengon, Hexblood, Hobgoblin, Kalashtar, Kender, Kenku,
Kobold, Leonin, Lizardfolk, Loxodon, Minotaur, Owlin, Plasmoid, Reborn, Satyr,
Sea Elf, Shadar-kai, Shifter, Simic Hybrid, Tabaxi, Thri-kreen, Tortle, Triton,
Vedalken, Warforged, Yuan-ti.

**Backgrounds — core (16):** Acolyte, Artisan, Charlatan, Criminal,
Entertainer, Farmer, Guard, Guide, Hermit, Merchant, Noble, Sage, Sailor,
Scribe, Soldier, Wayfarer.

**Backgrounds — expanded (22):** Anthropologist, Archaeologist, Athlete, City
Watch, Cloistered Scholar, Courtier, Faction Agent, Far Traveler, Feylost,
Folk Hero, Giant Foundling, Gladiator, Guild Artisan, Haunted One, Inheritor,
Knight, Mercenary Veteran, Outlander, Pirate, Spy, Urchin, Wildspacer.

Every species carries a confidence rating — **documented**, **partial** or
**original** — shown in the app and explained in [RESEARCH.md](RESEARCH.md).
Where published material says nothing about a people's names, Session Zero says
so rather than inventing lore and presenting it as canon.

---

## Testing

```bash
npm test                       # 584 tests
npm run stress                 # generation statistics
node tools/uicheck/run.mjs     # 54 browser checks against the production build
```

Full results, methodology, measured limitations and a log of the bugs this
testing caught are in **[TESTING.md](TESTING.md)**.

---

## Deploying to GitHub Pages

The repository ships a workflow at `.github/workflows/deploy.yml` that builds
and publishes on every push to `main`.

**First-time setup:**

1. Create a public repository named `session-zero` under your account.
2. Push this project to it:
   ```bash
   git remote add origin https://github.com/jtbartee/session-zero.git
   git branch -M main
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
4. Push to `main`. The workflow builds and deploys; the site appears at
   `https://jtbartee.github.io/session-zero/`.

`vite.config.ts` sets `base: '/session-zero/'` for production builds, so assets
resolve from the sub-path rather than the domain root. If you fork this under a
different repository name, change that value to match.

To check the production build locally before pushing:

```bash
npm run build
npm run preview
```

---

## Project layout

```
src/
  main.ts                 application wiring
  engine/
    generator.ts          resolve species -> tradition -> structure -> validate
    grammar.ts            the six naming architectures
    diversity.ts          usage ledger and batch guard
    validation.ts         pronounceability, profanity, canonical-name screening
    hooks.ts              character-hook grammar
    rng.ts                seedable RNG and weighted selection
  data/
    species/              56 species specifications
    backgrounds/          38 background specifications
    vocabulary/           shared word palettes
  components/             combobox, segmented control, card, toast
  storage/                localStorage with safe failure
  styles/                 design tokens and component CSS
  types/                  the data contract
tests/                    vitest suites
tools/
  stress.ts               generation statistics harness
  uicheck/                CDP browser checks
```

---

## Technical notes

Vite, TypeScript, and modern CSS. No UI framework — the app is small enough
that a framework would be more code than it saves, and it ships 100 kB gzipped
including all 56 species' naming data.

The engine is deterministic given a seed, which is what makes the stress
harness and the test suite reproducible. `localStorage` access is wrapped so
that a private window, blocked site data or a full quota degrades to in-memory
state rather than breaking the app.

---

## Licence and attribution

The code in this repository is MIT licensed — see [LICENSE](LICENSE).

This work includes material from the System Reference Document 5.2.1
("SRD 5.2.1") by Wizards of the Coast LLC, available at
<https://www.dndbeyond.com/srd>. The SRD 5.2.1 is licensed under the Creative
Commons Attribution 4.0 International License, available at
<https://creativecommons.org/licenses/by/4.0/legalcode>.

**Session Zero is unofficial Fan Content permitted under the Wizards of the
Coast Fan Content Policy. It is not approved or endorsed by Wizards. Portions
of the materials used are property of Wizards of the Coast. ©Wizards of the
Coast LLC.**

Session Zero is an independent, fan-made tool. It is not affiliated with,
endorsed by, sponsored by, or approved by Wizards of the Coast or Hasbro. No
copyrighted name tables, sourcebook text, logos or artwork are reproduced here.
All word lists, phonologies, naming grammars and character-hook text in this
repository are original work.
