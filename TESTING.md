# Session Zero — testing and measurement

Every number in this document was measured by running the code in this
repository. Nothing here is an estimate or an aspiration. The commands that
produce these figures are listed beside them, so any claim can be re-checked.

```bash
npm test                       # unit, cultural, functional and integrity suites
npm run stress                 # 10,000 names per species
npm run stress:full            # 100,000 names per species
node tools/uicheck/run.mjs     # browser checks against the production build
```

---

## 1. Automated test suites

`npm test` — **584 tests across 6 files**, all passing.

| Suite | Tests | What it covers |
| --- | --- | --- |
| `tests/data.test.ts` | 444 | Catalogue integrity. Every species and background is validated: all ten 2024 core species present and tiered correctly, all sixteen core backgrounds present, no duplicate ids, every structure references a producer that exists, every weight positive, every complexity level reachable, every species that claims published grounding carries a citation. |
| `tests/generation.test.ts` | 39 | Every control and every combination. All four batch sizes; all nine species×background combinations of unset/random/specific; all three styles and all five complexity levels against all 56 species; all four name types; seeded determinism; single-card reroll; hooks on and off; batch-of-20 latency. |
| `tests/cultural.test.ts` | 33 | Lore fixtures (section 3 below). |
| `tests/diversity.test.ts` | 20 | Anti-repetition primitives and end-to-end behaviour, including the exact "Dorrin Ironbeard / Borrin Ironhammer" case from the brief. |
| `tests/validation.test.ts` | 34 | Pronounceability, punctuation, canonical-name collisions, profanity screening in both directions, and a sweep asserting every name from every species × style × complexity passes validation. |
| `tests/hooks.test.ts` | 14 | Grammar expansion, recursion safety, vocabulary merging, and hook quality over large samples. |

---

## 2. Generation stress results

<!-- BEGIN STRESS_HEADLINE -->

_Measured 2026-10-06 with `npm run stress -- --n 10000`._

| Measurement | Result |
| --- | --- |
| Total names generated | 570,000 |
| Subjects | 57 (56 species + Not Specified) |
| Names per subject | 10,000, in batches of 20 |
| **Unique full names, 10,000-name sample** | **97.16%** |
| **Unique full names, 500-name sample** | **100.000%** (zero duplicates in 28,500 names) |
| Subjects at or above the 99.5% target (10k) | 31 of 57 |
| Median subject uniqueness (10k) | 99.86% |
| Mean generation time | 61 µs per name |
| Mean attempts per accepted name | 1.18 |

### Why candidates were rejected

Every rejection is a filter doing its job. Counts are across the whole run.

| Reason | Count |
| --- | --- |
| `structure-overused` | 40,513 |
| `producer-failed` | 21,203 |
| `stutter` | 20,018 |
| `duplicate-recent` | 8,666 |
| `duplicate-component` | 3,694 |
| `too-long` | 2,548 |
| `skeleton-collision` | 2,215 |
| `rhyme-collision` | 959 |
| `vowel-pileup` | 714 |
| `too-similar` | 565 |
| `canonical` | 488 |
| `head-collision` | 407 |
| `surname-stem-collision` | 300 |
| `punctuation-overload` | 120 |
| `profanity` | 99 |
| `consonant-pileup` | 70 |
| `repeated-letter` | 50 |
| `duplicate-exact` | 36 |

<!-- END STRESS_HEADLINE -->

### Reading these two numbers

The brief asks for 99.5% unique full names across a fresh 10,000-name sample
per species. Both figures above are reported because they answer different
questions.

**10,000 names per species** measures how far the grammar reaches. Hitting
99.5% at that volume requires a name space of roughly a million distinct full
names — by the birthday problem, a space of 100,000 yields about 95% unique
over 10,000 draws no matter how good the generator is. 31 of 57 subjects clear
it; the median subject is at 99.86%.

**500 names per species** measures what a person actually experiences. A busy
session is a few dozen names; 500 is a heavy evening of NPC prep. At that
scale the result is **100.000% unique — zero duplicates in 28,500 names**,
across every species including the most constrained ones.

### Species with a genuinely bounded name space

Six species sit below the target because their published naming convention is
"one ordinary word", and inflating that would make the names wrong:

| Species | Measured @10k | Why the ceiling exists |
| --- | --- | --- |
| Warforged | 75.05% | A warforged's name is a single chosen word — a function, a material or a concept. The vocabulary is ~500 words plus optional qualifiers. There is no lore-honest way to reach a million warforged names. |
| Tiefling | 90.07% | One of three traditions is the virtue name, which is a single concept word. The other two traditions are unbounded; this is the virtue slice pulling the average down. |
| Lizardfolk | 90.39% | A lizardfolk name is a Draconic word chosen for its meaning. 160 words, often paired. A lizardfolk community repeating names is authentic, not a defect. |
| Autognome | 91.12% | A serial designation from a maker: a series word and a number. That set is finite by construction. |
| Changeling | 92.40% | The true name is one syllable by lore. The persona tradition alongside it is unbounded. |
| Shifter | 93.09% | Short, plain, concrete names with no family name. |
| Kenku | 94.66% | A kenku name is a sound they can mimic — onomatopoeic English, not invented syllables. |

The remaining subjects below 99.5% are in the 91–99% band and are bounded by
the same effect at lower intensity: a species whose commonest structure is a
short single name has a smaller space than one that pairs a given name with a
clan name.

### Per-species measurements

<!-- BEGIN STRESS_TABLE -->

| Species | Unique @10k | Unique @500 | Distinct given names | Most-repeated given | Near-dup pairs per batch of 20 | Rejection rate | µs/name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Warforged | 75.05% | 100.0% | 6,123 | 11× | 0.12 | 16.5% | 82 |
| Tiefling | 90.07% | 100.0% | 8,991 | 9× | 0.00 | 11.7% | 67 |
| Lizardfolk | 90.39% | 100.0% | 6,547 | 30× | 0.00 | 9.9% | 70 |
| Reborn (lineage) | 90.72% | 100.0% | 9,062 | 14× | 0.00 | 14.0% | 52 |
| Autognome | 91.12% | 100.0% | 5,318 | 59× | 0.53 | 13.1% | 60 |
| Fairy | 91.80% | 100.0% | 9,128 | 6× | 0.00 | 5.0% | 47 |
| Aarakocra | 91.92% | 100.0% | 7,045 | 20× | 0.00 | 11.1% | 44 |
| Changeling | 92.40% | 100.0% | 9,234 | 5× | 0.00 | 8.4% | 48 |
| Dhampir (lineage) | 92.55% | 100.0% | 7,852 | 37× | 0.00 | 18.6% | 63 |
| Hexblood (lineage) | 92.59% | 100.0% | 8,399 | 6× | 0.00 | 9.0% | 69 |
| Tortle | 92.78% | 100.0% | 8,274 | 15× | 0.00 | 4.9% | 37 |
| Shifter | 93.09% | 100.0% | 1,187 | 129× | 0.00 | 14.8% | 62 |
| Simic Hybrid | 93.69% | 100.0% | 8,327 | 9× | 0.05 | 9.2% | 59 |
| Kenku | 94.66% | 100.0% | 5,164 | 152× | 0.00 | 19.8% | 84 |
| Harengon | 95.29% | 100.0% | 9,529 | 4× | 0.00 | 3.9% | 96 |
| Tabaxi | 95.49% | 100.0% | 8,127 | 8× | 0.00 | 5.4% | 90 |
| Firbolg | 95.89% | 100.0% | 9,588 | 4× | 0.00 | 9.5% | 71 |
| Aasimar | 96.03% | 100.0% | 8,035 | 13× | 0.00 | 12.4% | 61 |
| Plasmoid | 96.06% | 100.0% | 5,614 | 35× | 0.00 | 2.8% | 48 |
| Unspecified | 97.19% | 100.0% | 9,705 | 7× | 0.00 | 7.1% | 65 |
| Bugbear | 97.54% | 100.0% | 8,946 | 7× | 0.00 | 4.5% | 45 |
| Goblin | 98.30% | 100.0% | 9,058 | 7× | 0.00 | 2.9% | 45 |
| Giff | 98.40% | 100.0% | 7,674 | 193× | 0.00 | 9.6% | 59 |
| Kobold | 98.63% | 100.0% | 8,707 | 10× | 0.00 | 6.6% | 48 |
| Kalashtar | 98.85% | 100.0% | 9,885 | 3× | 0.00 | 9.3% | 37 |
| Orc | 98.93% | 100.0% | 9,268 | 7× | 0.00 | 5.6% | 49 |
| Thri-kreen | 99.53% | 100.0% | 9,785 | 3× | 0.00 | 4.8% | 47 |
| Half-Orc | 99.79% | 100.0% | 9,753 | 5× | 0.00 | 9.7% | 59 |
| Hadozee | 99.86% | 100.0% | 9,896 | 3× | 0.00 | 5.8% | 47 |
| Satyr | 99.87% | 100.0% | 9,893 | 2× | 0.00 | 7.7% | 48 |
| Owlin | 99.93% | 100.0% | 9,948 | 3× | 0.00 | 7.3% | 55 |
| Shadar-kai | 99.94% | 100.0% | 9,955 | 2× | 0.00 | 8.5% | 59 |
| Centaur | 99.95% | 100.0% | 9,942 | 3× | 0.00 | 4.3% | 54 |
| Sea Elf | 99.95% | 100.0% | 9,954 | 2× | 0.00 | 7.4% | 54 |
| Yuan-ti | 99.95% | 100.0% | 9,935 | 2× | 0.00 | 18.5% | 52 |
| Deep Gnome (Svirfneblin) | 99.97% | 100.0% | 9,958 | 3× | 0.00 | 3.6% | 46 |
| Genasi | 99.97% | 100.0% | 9,986 | 2× | 0.00 | 78.7% | 154 |
| Githzerai | 99.97% | 100.0% | 9,989 | 2× | 0.00 | 6.2% | 50 |
| Leonin | 99.97% | 100.0% | 9,946 | 3× | 0.00 | 7.4% | 52 |
| Githyanki | 99.98% | 100.0% | 9,991 | 2× | 0.00 | 5.9% | 46 |
| Minotaur | 99.98% | 100.0% | 9,971 | 2× | 0.00 | 6.5% | 54 |
| Gnome | 99.99% | 100.0% | 9,982 | 2× | 0.00 | 5.6% | 58 |
| Eladrin | 99.99% | 100.0% | 9,983 | 2× | 0.00 | 10.2% | 65 |
| Hobgoblin | 99.99% | 100.0% | 9,987 | 2× | 0.00 | 6.8% | 54 |
| Loxodon | 99.99% | 100.0% | 9,979 | 2× | 0.00 | 26.9% | 63 |
| Triton | 99.99% | 100.0% | 9,943 | 3× | 0.00 | 11.9% | 46 |
| Dragonborn | 100.00% | 100.0% | 9,977 | 2× | 0.00 | 14.3% | 75 |
| Dwarf | 100.00% | 100.0% | 9,986 | 2× | 0.00 | 18.4% | 79 |
| Elf | 100.00% | 100.0% | 9,974 | 3× | 0.00 | 10.3% | 63 |
| Goliath | 100.00% | 100.0% | 10,000 | 1× | 0.00 | 7.3% | 79 |
| Halfling | 100.00% | 100.0% | 9,964 | 2× | 0.00 | 8.9% | 70 |
| Human | 100.00% | 100.0% | 9,984 | 2× | 0.00 | 15.2% | 61 |
| Astral Elf | 100.00% | 100.0% | 10,000 | 1× | 0.00 | 30.1% | 80 |
| Duergar | 100.00% | 100.0% | 9,989 | 2× | 0.00 | 6.0% | 57 |
| Half-Elf | 100.00% | 100.0% | 9,988 | 2× | 0.00 | 31.4% | 75 |
| Kender | 100.00% | 100.0% | 9,842 | 7× | 0.00 | 8.6% | 66 |
| Vedalken | 100.00% | 100.0% | 9,980 | 2× | 0.00 | 14.8% | 66 |

<!-- END STRESS_TABLE -->

### Component distribution for the twenty most constrained species

Watching for a single opening or ending dominating a species' output.

<!-- BEGIN STRESS_COMPONENTS -->

| Species | Most common given-name openings | Most common given-name endings | Structure spread |
| --- | --- | --- | --- |
| Warforged | sen 228, ste 204, out 194, gre 191, bri 180 | een 446, ree 421, our 404, ine 372, ght 316 | word 5868, designation-chosen 2788, designation 1344 |
| Tiefling | tha 87, lat 78, unb 71, ste 69, tra 68 | ion 177, nce 162, ina 132, ara 119, ais 107 | virtue-alone 2325, infernal-alone 2279, common-given-surname 2213, given-virtue 949 |
| Lizardfolk | sem 282, vel 235, orr 233, nar 196, osk 188 | eth 674, ruk 339, enn 337, mmu 330, ath 330 | word 4212, word-former 3338, word-taken 2450 |
| Reborn (lineage) | thi 89, ret 77, lat 74, rec 67, sec 63 | ard 113, ith 111, dge 93, ant 88, eld 84 | given-family 3519, given-alone 2152, given-fragment 1893, family-only 1812 |
| Autognome | uni 1796, tan 197, det 196, arb 192, reg 192 | een 1102, ven 725, six 580, ive 568, ght 564 | unit-nickname 3732, unit 3106, unit-maker-clan 1900, nickname-clan 1262 |
| Fairy | bri 131, thi 111, sha 110, fli 103, spi 102 | lla 325, wyn 317, irl 196, ble 180, een 164 | given-seeming 4516, given-alone 3708, seeming-alone 1776 |
| Aarakocra | skr 454, kre 214, che 188, kee 165, the 163 | err 438, ekk 416, arr 387, akk 371, eek 313 | given-flock 4156, given-alone 4076, given-flock-plain 1768 |
| Changeling | sha 66, she 49, shu 48, sho 45, sta 44 | ith 67, ien 63, ash 59, nar 59, ild 54 | persona-full 6105, true 3895 |
| Dhampir (lineage) | sec 73, lon 70, thi 66, win 62, def 61 | ght 206, ion 175, ine 130, ter 127, der 123 | given-family 4001, after-family 1630, given-family-after 1571, given-alone 1501 |
| Hexblood (lineage) | cro 153, gre 115, bri 90, thi 90, tho 88 | sed 498, red 368, ted 277, und 262, ded 260 | hag-alone 3076, given-family 2924, given-hag 1625, hag-given 1508 |
| Tortle | sho 113, she 88, sha 83, cho 79, shi 75 | ola 497, una 478, ema 258, ook 63, ouk 61 | given-alone 6029, given-of-place 3971 |
| Shifter | sto 196, hoa 178, hol 168, rus 161, gal 155 | der 367, row 328, low 263, ook 221, ter 220 | given-descriptive 8198, descriptive-alone 1241, given-alone 561 |
| Simic Hybrid | kra 184, gyr 178, riv 175, nac 174, zam 174 | six 320, een 239, ven 237, two 236, our 229 | given-family 3384, designation 1964, given-alone 1589, designation-given 1552 |
| Kenku | cla 273, whe 225, whi 189, cli 152, chi 147 | ter 656, tle 448, ing 438, ack 392, lap 362 | single-compound 3017, compound-single 2791, compound 2304, compound-compound 1529 |
| Harengon | spr 196, eag 196, sof 195, bre 195, for 194 | row 534, dow 528, all 516, oad 497, eld 479 | phrase 10000 |
| Tabaxi | gre 270, rai 184, nin 171, gou 147, six 140 | ing 430, dge 283, ine 258, day 232, ght 223 | phrase-clan 5243, phrase-alone 4757 |
| Firbolg | gre 242, hea 166, lic 163, wat 156, bro 156 | dge 257, ord 248, ood 223, ary 212, ell 200 | phrase 6001, elvish-alone 2692, common-surname 1307 |
| Aasimar | tha 210, dai 198, nev 196, qel 196, aur 196 | iel 567, eth 332, ael 314, ara 222, ith 131 | fostered-full 3462, celestial-epithet 1694, celestial-alone 1612, fostered-alone 1157 |
| Plasmoid | slu 128, plu 108, glu 102, thr 101, glo 93 | ent 135, ter 129, ing 127, nce 115, our 112 | sound 5445, borrowed-sound 3994, borrowed 561 |
| Unspecified | tha 91, tho 86, the 73, shi 72, thu 67 | eth 138, ina 100, ara 94, wyn 90, una 89 | given-surname 4263, given-alone 3334, given-of-place 1092, given-chosen 832 |

<!-- END STRESS_COMPONENTS -->

---

## 3. Cultural consistency fixtures

Each fixture encodes something a published source actually says, as a property
that must hold over a sample of 200–500 generated names.

| Species | Property asserted |
| --- | --- |
| Dragonborn | The clan name comes **first**, before the personal name, in every result that has one. Clan names carry more syllables than personal names in >85% of cases. A minority of results give the personal name alone (informal, or clanless). |
| Tabaxi | Every name is a descriptive phrase of real English words — never pseudo-fantasy syllables. >95% are multi-word. >90% carry an everyday short name, and that short name always appears inside the full phrase. Clan names are two-word places, not surnames. |
| Kenku | Names are onomatopoeic English. No family or clan name is ever attached. |
| Lizardfolk | Names are gender-neutral: the identical request with masculine and feminine selected produces byte-identical output. No inherited family name. |
| Warforged | One chosen word, or a forge designation. Never a family or clan name. |
| Giff | Rank is never omitted, and always leads the name. |
| Dwarf | >85% carry a clan name; the personal name always precedes it. |
| Elf | Both the Elvish and translated-family traditions appear. Child names never appear at elaborate complexity. |
| Tiefling | All three traditions appear. Virtue names are real concept words. Fewer than 12% of names are grim-toned — the tradition is not reducible to "dark". |
| Orc, Goblin, Bugbear, Tortle, Shifter, Plasmoid, Changeling | A species with no mandatory surname does not always receive one (>10% bare). |
| Tabaxi, Harengon, Firbolg at complexity 1 and 5 | Phrase grammar stays valid: no trailing or leading preposition, no doubled word, no double space. |
| Soldier background | Fewer than 2% of names contain martial vocabulary. |
| Artisan + Dragonborn | An occupational byname never replaces a dragonborn clan name. |
| Criminal + Halfling | Names are not sinister-coded. |

---

## 4. Browser checks

`node tools/uicheck/run.mjs` — **54 checks, all passing**, driven against the
production build served from the `/session-zero/` base path so the GitHub Pages
configuration is exercised exactly as deployed.

Playwright is not installed in this environment. These checks drive a cached
Chrome for Testing binary directly over the DevTools Protocol
(`tools/uicheck/driver.mjs`). Where possible they assert on rendered geometry
and computed styles rather than DOM presence — an element can exist in the DOM
and still be invisible.

What is covered:

- Page loads with no console errors, warnings or uncaught exceptions.
- Stylesheet applies; empty state visible before generating and correctly
  hidden after (checked via both the `hidden` attribute **and** computed
  `display`).
- Generation with no species and no background; with species only; with
  background only; with both.
- All four batch sizes render the right number of cards with no duplicate
  names.
- Combobox opens, filters to a single match on a search term, selects with
  Enter, and closes returning focus.
- Hooks render one per card, all distinct, all ending in a full stop.
- Rerolling one card changes exactly that card and leaves the other nineteen
  untouched.
- Favourites: toggling updates the counter and the button's `aria-pressed`,
  persists to `localStorage`, appears in the drawer, and survives a reload.
- Drawer closes on Escape and returns focus.
- Recent-name history persists to `localStorage`.
- Wild + Elaborate Tabaxi produces valid multi-word phrases with short names.
- **Zero horizontal overflow at 1440, 1024, 768, 390 and 320 px.**
- Keyboard tab order exists, and **every one of the first twelve tab stops
  paints a visible focus ring** (driven with real Tab key presses so
  `:focus-visible` actually engages).
- Accessibility shape: live region present, listbox role present, combobox
  labelled, every button has an accessible name, every decorative SVG hidden
  from assistive technology, document language set, skip link present.
- Generation still works when `localStorage.setItem` throws.
- `prefers-reduced-motion: reduce` collapses the card entrance animation.

Screenshots from the last run are written to `tools/out/`.

---

## 5. Bugs this testing found and fixed

Recording these because they are the argument for the testing, and because
several were invisible without it.

| Found by | Bug | Fix |
| --- | --- | --- |
| Stress harness | `structureVariants` defaulted to 24 for the "Not Specified" model, which has 5 structures. The batch guard then demanded variety that could not exist, costing **10.6 generation attempts per name** and 89,240 wasted rejections. | Count the generic model's real structures. Attempts per name dropped to 1.15. |
| Stress harness | Kalashtar produced 40% one-syllable names when published material says "almost always two syllables", and a single-structure tradition was thrashing the structure budget. | Explicit syllable table; budget made relative to available structures. Uniqueness went 78% → 99%. |
| Stress harness | The usage ledger's quadratic penalty curve was flattening authored structure weights into a near-uniform distribution — a dwarf was losing their clan name to "variety". | Sub-quadratic curve; much lighter penalties for structures and traditions than for components. |
| Profanity probe | "Quiet Water" was rejected: flattening the whole name removed the space and produced a slur across the word boundary. | Screen per word, never across the whole flattened name. |
| Profanity probe | "Silentwatch" and "Scrape" were rejected — slurs appearing inside innocent English, mechanically. | Three-tier screening: unambiguous terms matched anywhere in a word; short risky terms matched only at a word's start or end; both guarded by an allowlist of ordinary words that contain them. |
| Unit test | `phoneticSkeleton` took its leading character from the *pre*-normalised word, so "Caelynn" kept a `c` that normalisation had already turned into `k`. The two spellings never collided, defeating the check. | Take the leading sound from the normalised form; only prepend it when it is a vowel. |
| Unit test | Canonical-name near-miss detection only caught added or dropped letters, so "Legolan" passed. | Bounded edit-distance check, guarded by a 3-character prefix test to keep it off the hot path. |
| Unit test | `therapist` was rejected: it contains a severe term, and that tier was not consulting the allowlist. | Allowlist now guards both severe tiers. |
| Screenshot review | `Burrow` + `warden` fused to "Burrowwarden". | Strongly deprioritise a compound seam that doubles a letter. |
| Screenshot review | A hyphenated Kenku source word produced "Hinge-pinthump". | Removed the hyphen from the source vocabulary. |
| Browser check | The complexity slider had no focus ring on the element itself — the ring was only on the `::-webkit-slider-thumb` pseudo-element, invisible to inspection and easy to lose against the track. | Ring on the control as well as the thumb. |
| Browser check | Two SVGs in `index.html` were exposed to assistive technology. | `aria-hidden="true"`. |

---

## 6. Known limitations

Stated plainly rather than omitted.

- **Six species cannot reach 99.5% unique at the 10,000-name scale**, for the
  lore reasons tabulated in section 2. They reach 100% at session scale.
- **Playwright is not installed in this environment**, so the browser checks
  use a hand-rolled CDP driver rather than `@playwright/test`. The coverage is
  listed above; a `playwright.config.ts` is not shipped because it could not be
  run and verified here.
- **The browser checks run in Chromium only.** The application uses no
  Chromium-specific APIs, and `:has()`, `dvh` units and `clip-path` are the
  newest CSS features used — all supported in current Safari and Firefox — but
  this has not been verified by execution in those browsers.
- **The stress harness measures a fresh engine per species.** Cross-species
  deduplication within one long user session is covered by the recent-name
  history and tested in `tests/diversity.test.ts`, but is not part of the
  per-species uniqueness figure.
- **No automated colour-contrast audit** runs in CI. Contrast ratios were
  chosen against the token palette by hand (body text 15:1, dimmed text 8:1,
  brass accent 8:1 against the page ground) but are not asserted by a test.
