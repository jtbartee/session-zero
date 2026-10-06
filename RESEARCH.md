# Session Zero — naming research

This document records what published Dungeons & Dragons material actually says
about how each supported people names itself, how confident we are in each
claim, and — where the sources are silent — exactly what was invented instead.

The guiding rule throughout: **never invent a naming convention and present it
as official lore.** Where a sourcebook is quiet, this document says so, the
species entry in the code says so, and the application says so in the hint text
under the species picker.

No published name table is reproduced. Every name the generator produces is
assembled at run time from original components, built to match the *structure*
and *sound* that published material describes.

---

## 1. Sources consulted

Primary:

- **Player's Handbook (2024)** — the baseline for the ten core species and the
  sixteen core backgrounds.
- **System Reference Document 5.2.1**, released under CC-BY-4.0 —
  <https://www.dndbeyond.com/srd>
- **D&D Beyond species catalogue** — <https://www.dndbeyond.com/species>
- **"The 10 Species in the 2024 Player's Handbook"** —
  <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>
- **"The Backgrounds and Origin Feats in the 2024 Player's Handbook"** —
  <https://www.dndbeyond.com/posts/1785-the-backgrounds-and-origin-feats-in-the-2024>

Supplements referenced for expanded species (named per entry below):
Monsters of the Multiverse; Volo's Guide to Monsters; Mordenkainen's Tome of
Foes; Eberron: Rising from the Last War; Guildmasters' Guide to Ravnica; Mythic
Odysseys of Theros; Van Richten's Guide to Ravenloft; Spelljammer: Astral
Adventurer's Guide; Dragonlance: Shadow of the Dragon Queen; Strixhaven: A
Curriculum of Chaos; The Tortle Package; Elemental Evil Player's Companion;
Sword Coast Adventurer's Guide; Tomb of Annihilation; Bigby Presents: Glory of
the Giants; The Wild Beyond the Witchlight.

Unearthed Arcana "Races of Eberron" (2018) was used only to corroborate the
Eberron naming notes:
<https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

---

## 2. Confidence ratings

Every species entry carries one of three ratings, stored in the data and shown
in the UI:

| Rating | Meaning |
| --- | --- |
| **Documented** | Published material describes the *structure* of these names (what parts there are, what order they come in) and usually their sound. The generator follows that description. |
| **Partial** | Some official guidance exists — a sound profile, a social structure, a handful of published examples — but not a complete naming system. The gap is filled with an original extension that does not contradict what is published, and the entry says which part is which. |
| **Original** | No published naming guidance exists at all. The entire grammar is original to this tool, built so it does not contradict the species' established culture. These entries say so plainly rather than implying a source. |

---

## 3. Catalogue summary

<!-- BEGIN SPECIES_SUMMARY -->

**56 playable species and lineages** — 10 core, 46 expanded.
**76 naming traditions** across them, and
**212 name structures**.

Confidence split: 27 documented, 25 partial, 4 original.

| Species | Tier | Confidence | Traditions | Architectures |
| --- | --- | --- | --- | --- |
| Aasimar | Core | Documented | 2 | chosen/virtue, compound, morphological, phonetic |
| Dragonborn | Core | Documented | 1 | chosen/virtue, compound, phonetic |
| Dwarf | Core | Documented | 1 | compound, morphological, phonetic |
| Elf | Core | Documented | 2 | compound, morphological, phonetic |
| Gnome | Core | Documented | 1 | compound, morphological, phonetic |
| Goliath | Core | Documented | 1 | compound, phonetic |
| Halfling | Core | Documented | 1 | compound, phonetic |
| Human | Core | Partial | 1 | closed set, compound, phonetic |
| Orc | Core | Documented | 1 | compound, morphological, phonetic |
| Tiefling | Core | Documented | 3 | chosen/virtue, compound, phonetic |
| Aarakocra | Expanded | Documented | 1 | compound, phonetic |
| Astral Elf | Expanded | Partial | 1 | chosen/virtue, morphological, phonetic |
| Autognome | Expanded | Partial | 1 | descriptive phrase, morphological, phonetic |
| Bugbear | Expanded | Partial | 1 | compound, phonetic |
| Centaur | Expanded | Partial | 1 | compound, phonetic |
| Changeling | Expanded | Documented | 2 | compound, phonetic |
| Deep Gnome (Svirfneblin) | Expanded | Partial | 1 | morphological, phonetic |
| Dhampir (lineage) | Expanded | Documented | 2 | chosen/virtue, compound, phonetic |
| Duergar | Expanded | Partial | 1 | compound, morphological, phonetic |
| Eladrin | Expanded | Partial | 1 | chosen/virtue, compound, morphological, phonetic |
| Fairy | Expanded | Original | 1 | compound, phonetic |
| Firbolg | Expanded | Documented | 2 | compound, descriptive phrase, phonetic |
| Genasi | Expanded | Documented | 5 | compound, phonetic |
| Giff | Expanded | Documented | 1 | closed set, compound, phonetic |
| Githyanki | Expanded | Documented | 1 | morphological, phonetic |
| Githzerai | Expanded | Documented | 1 | phonetic |
| Goblin | Expanded | Partial | 1 | compound, phonetic |
| Hadozee | Expanded | Original | 1 | compound, phonetic |
| Half-Elf | Expanded | Documented | 3 | compound, morphological, phonetic |
| Half-Orc | Expanded | Documented | 3 | compound, morphological, phonetic |
| Harengon | Expanded | Original | 1 | descriptive phrase |
| Hexblood (lineage) | Expanded | Partial | 2 | compound, phonetic |
| Hobgoblin | Expanded | Partial | 1 | closed set, morphological, phonetic |
| Kalashtar | Expanded | Documented | 1 | phonetic |
| Kender | Expanded | Documented | 1 | compound, phonetic |
| Kenku | Expanded | Documented | 1 | compound, morphological |
| Kobold | Expanded | Partial | 1 | compound, phonetic |
| Leonin | Expanded | Partial | 1 | compound, phonetic |
| Lizardfolk | Expanded | Documented | 1 | morphological |
| Loxodon | Expanded | Partial | 1 | phonetic |
| Minotaur | Expanded | Partial | 1 | compound, phonetic |
| Owlin | Expanded | Original | 1 | compound, phonetic |
| Plasmoid | Expanded | Partial | 2 | chosen/virtue, phonetic |
| Reborn (lineage) | Expanded | Partial | 2 | chosen/virtue, compound, phonetic |
| Satyr | Expanded | Partial | 1 | compound, phonetic |
| Sea Elf | Expanded | Partial | 1 | compound, morphological, phonetic |
| Shadar-kai | Expanded | Partial | 1 | compound, morphological, phonetic |
| Shifter | Expanded | Partial | 1 | compound, morphological |
| Simic Hybrid | Expanded | Documented | 2 | compound, descriptive phrase, phonetic |
| Tabaxi | Expanded | Documented | 1 | descriptive phrase |
| Thri-kreen | Expanded | Partial | 1 | phonetic |
| Tortle | Expanded | Partial | 1 | compound, phonetic |
| Triton | Expanded | Documented | 1 | morphological, phonetic |
| Vedalken | Expanded | Partial | 1 | morphological, phonetic |
| Warforged | Expanded | Documented | 2 | chosen/virtue, descriptive phrase |
| Yuan-ti | Expanded | Partial | 1 | morphological, phonetic |

<!-- END SPECIES_SUMMARY -->

---

## 4. Decisions that needed judgement

### Human regional registers are invented, and deliberately not ethnic

The 2024 rules describe humans as the most varied people on any world and do
not tabulate ethnic groups the way the 2014 book did. Reproducing those older
tables would have been both a copyright problem and a quality problem: a
phonology invented to evoke a real-world culture and then labelled with that
culture's name is caricature, which the brief for this project explicitly warns
against.

Instead, Session Zero ships **six original fantasy regional registers** —
Heartlands, Northreach, Sunward Coast, The Steppes, Old Empire and River
Cantons. Each is an internally consistent invented phonology, named for
unspecified fantasy geography. They are not models of any real people. They are
defined once in `src/data/species/_shared.ts` and shared by every tradition
that legitimately draws on "whatever the local common tongue is".

### Species that use another culture's naming do so openly

Several species *documentedly* take the naming conventions of whoever raised
them: aasimar, genasi, many tieflings, half-elves and half-orcs raised among
humans, simic hybrids, and the three Ravenloft lineages (dhampir, hexblood,
reborn), which are changes that happen to a person who already had a name.

For these, the generator uses the shared common-tongue registers and **labels
the result** with the tradition name ("Fostered name", "The name they already
had"). This is the opposite of quietly substituting another species' generator:
the substitution is the lore, and the UI says it is happening.

### Which structures the background may touch

A background is a secondary influence. Each naming tradition declares, in
`backgroundInfluence`, how far a background may reach:

- **Epithet** (default on): an earned epithet works in nearly any culture.
- **Byname** (default off): an occupational surname like "Cooper" is only
  allowed where the culture already uses Common-language surnames. A dragonborn
  clan name is never replaced by one.
- **Title** (default off): an honorific only where the culture uses them.

The epithet and byname vocabularies are built from trades, places, journeys and
counts — never from violence or morality. A Soldier does not get a violent
name; a Criminal does not get a sinister one. This is verified by test, not by
intention: see `tests/cultural.test.ts`.

### Species with genuinely small name spaces

Some species' lore says, in effect, "the name is one ordinary word." Warforged
choose a single word. Kenku use a sound. Lizardfolk use a Draconic word.
Shifters use a short plain name. Changeling true names are one syllable.

For these, authenticity beats variety. The vocabularies were expanded as far as
the lore plausibly allows and no further; the measured ceiling is reported
honestly in `TESTING.md` rather than papered over by bolting on syllables that
would make the names wrong. In practice this is invisible: at session scale
(500 names) every one of these species still produces zero duplicates.

### Elf lineages, tiefling legacies, goliath ancestries

The 2024 rules replace subraces with lineages (elf), legacies (tiefling) and
giant ancestries (goliath), and attach **no naming rules** to those choices.
Session Zero therefore does not invent per-lineage phonologies for them. Elf
lineages that were published as separate playable options (Astral Elf, Eladrin,
Sea Elf, Shadar-kai) do get their own entries, because they are separate
options with their own described cultures — but each one says in its notes that
its distinctive phonetic shading is an extension, not published lore.

---

## 5. Backgrounds

All sixteen 2024 Player's Handbook backgrounds are included, plus twenty-two
compatible legacy and supplement backgrounds.

<!-- BEGIN BACKGROUNDS -->

| Background | Tier | Source | Register | Byname chance |
| --- | --- | --- | --- | --- |
| Acolyte | Core | Player’s Handbook (2024) | devout | 14% |
| Artisan | Core | Player’s Handbook (2024) | plain | 30% |
| Charlatan | Core | Player’s Handbook (2024) | itinerant | 26% |
| Criminal | Core | Player’s Handbook (2024) | plain | 20% |
| Entertainer | Core | Player’s Handbook (2024) | itinerant | 24% |
| Farmer | Core | Player’s Handbook (2024) | plain | 30% |
| Guard | Core | Player’s Handbook (2024) | martial | 20% |
| Guide | Core | Player’s Handbook (2024) | itinerant | 22% |
| Hermit | Core | Player’s Handbook (2024) | learned | 10% |
| Merchant | Core | Player’s Handbook (2024) | mercantile | 32% |
| Noble | Core | Player’s Handbook (2024) | formal | 18% |
| Sage | Core | Player’s Handbook (2024) | learned | 16% |
| Sailor | Core | Player’s Handbook (2024) | plain | 22% |
| Scribe | Core | Player’s Handbook (2024) | learned | 26% |
| Soldier | Core | Player’s Handbook (2024) | martial | 20% |
| Wayfarer | Core | Player’s Handbook (2024) | itinerant | 18% |
| Folk Hero | Expanded | Player’s Handbook (2014) | plain | 22% |
| Guild Artisan | Expanded | Player’s Handbook (2014) | mercantile | 34% |
| Outlander | Expanded | Player’s Handbook (2014) | itinerant | 16% |
| Urchin | Expanded | Player’s Handbook (2014) | plain | 14% |
| Pirate | Expanded | Player’s Handbook (2014) — Sailor variant | itinerant | 26% |
| Knight | Expanded | Player’s Handbook (2014) — Noble variant | formal | 20% |
| Gladiator | Expanded | Player’s Handbook (2014) — Entertainer variant | itinerant | 30% |
| Spy | Expanded | Player’s Handbook (2014) — Criminal variant | plain | 16% |
| City Watch | Expanded | Sword Coast Adventurer’s Guide | martial | 22% |
| Courtier | Expanded | Sword Coast Adventurer’s Guide | formal | 24% |
| Faction Agent | Expanded | Sword Coast Adventurer’s Guide | plain | 18% |
| Far Traveler | Expanded | Sword Coast Adventurer’s Guide | itinerant | 12% |
| Inheritor | Expanded | Sword Coast Adventurer’s Guide | formal | 20% |
| Mercenary Veteran | Expanded | Sword Coast Adventurer’s Guide | martial | 24% |
| Haunted One | Expanded | Van Richten’s Guide to Ravenloft / Curse of Strahd | plain | 10% |
| Anthropologist | Expanded | Tomb of Annihilation | learned | 14% |
| Archaeologist | Expanded | Tomb of Annihilation | learned | 16% |
| Cloistered Scholar | Expanded | Sword Coast Adventurer’s Guide | learned | 14% |
| Athlete | Expanded | Mythic Odysseys of Theros | plain | 22% |
| Feylost | Expanded | The Wild Beyond the Witchlight | itinerant | 10% |
| Giant Foundling | Expanded | Bigby Presents: Glory of the Giants | plain | 14% |
| Wildspacer | Expanded | Spelljammer: Astral Adventurer’s Guide | itinerant | 20% |

<!-- END BACKGROUNDS -->

---

## 6. Per-species naming specifications

<!-- BEGIN SPECIES_DETAIL -->

### Aasimar

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** Fostered name (weight 6), Celestial-touched name (weight 4)
- **Architectures used:** chosen/virtue, compound, morphological, phonetic
- **Structures:** 6

Naming observations:

- Aasimar are born to the peoples around them and are raised inside those cultures, so most carry an entirely ordinary name from wherever they grew up. This generator uses the shared common-tongue registers for that case and says so in the result.
- Some aasimar take or are given a second, celestial-sounding name once their guide manifests; it sits alongside the fostered name rather than replacing it.
- There is no single published "aasimar language" name table, so the celestial morphology here is original, built from radiance, vigil and herald imagery.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/species>

### Dragonborn

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1; Fizban’s Treasury of Dragons
- **Confidence:** Documented
- **Naming traditions:** Clan name first (weight 10)
- **Architectures used:** chosen/virtue, compound, phonetic
- **Structures:** 4

Naming observations:

- Dragonborn place the clan name FIRST, before the personal name, as a mark of honour. This ordering is the single most distinctive thing about their naming.
- Clan names are long — commonly five or more syllables — and are not translated into Common.
- Children earn a childhood name, usually a plain descriptive Common word for something they do, which many keep into adulthood as an affectionate nickname.
- A dragonborn who gives only their personal name is signalling something: either informality or separation from a clan.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Dwarf

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Documented
- **Naming traditions:** Clan and hold (weight 10)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 5

Naming observations:

- A dwarf carries a personal name and a clan name; the clan name is granted by clan elders and is not lightly set aside.
- Published clan names come in two flavours: transparent Common compounds built from stone, metal and craft, and opaque names that sound like the dwarves’ own tongue.
- Personal names lean Old Norse and Germanic in sound: hard stops, heavy codas, and dark vowels.
- A dwarf without a clan name is unusual and usually says something about their story, so that structure is deliberately rare here.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Elf

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Documented
- **Naming traditions:** Elvish family name (weight 9), Translated family name (weight 7)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 6

Naming observations:

- An elf may carry up to three names: a child name, an adult name chosen after their hundredth year, and a family name.
- Family names are built from Elvish words and are usually given alongside a Common translation, so both forms are legitimate.
- Child names are short and easy to say; adult names are chosen deliberately and tend to be longer and more flowing.
- The 2024 rules replace subraces with lineages (High, Wood, Drow). Published naming guidance is shared across lineages rather than split by them, so this entry does not fabricate per-lineage phonologies.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Gnome

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Documented
- **Naming traditions:** Short name and clan (weight 10)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 5

Naming observations:

- Gnomes accumulate names: a long true name, a short everyday name, nicknames from friends, and a clan name built from Gnomish words.
- Among other peoples a gnome usually goes by one short name or nickname rather than the full string.
- Clan names are compounds of ordinary Gnomish words, so they stay transparent to anyone who speaks the language.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>

### Goliath

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1; Monsters of the Multiverse; Elemental Evil Player’s Companion
- **Confidence:** Documented
- **Naming traditions:** Birth name, nickname, clan (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 5

Naming observations:

- Goliath names have three parts: a birth name given by the elders, a nickname awarded by the community for a deed or trait, and a clan name.
- Birth names can run to many syllables; in practice only the first part or two is used day to day.
- Clan names are long and vowel-rich, and frequently contain a hyphenated element.
- Nicknames can be revoked and reassigned, so a goliath may carry several across a lifetime.
- The 2024 rules attach goliaths to a giant ancestry (cloud, fire, frost, hill, stone, storm) but do not tie naming to it, so this entry does not invent per-ancestry phonologies.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Halfling

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Documented
- **Naming traditions:** Family name (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 4

Naming observations:

- Halflings use a given name and a family name; family names are typically transparent Common compounds drawn from home, craft and countryside.
- Nicknames are common and stick for life, often earned for something small and specific rather than heroic.
- The 2024 rules removed halfling subraces, so this entry keeps one shared naming culture.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>

### Human

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Partial
- **Naming traditions:** Common tongue (weight 10)
- **Architectures used:** closed set, compound, phonetic
- **Structures:** 5

Naming observations:

- Human naming is defined by region and family rather than by species; the 2024 rules describe humans as the most varied people on any world.
- Surnames may be occupational, toponymic, descriptive or patronymic, and plenty of humans use none at all.
- The six registers here are original regional dialects invented for this tool. They are not modelled on any real-world culture, and the published ethnic name tables are not reproduced.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Orc

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1; Monsters of the Multiverse
- **Confidence:** Documented
- **Naming traditions:** Personal name and earned epithet (weight 10)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 4

Naming observations:

- Orc names are short and strongly consonantal; published examples run to one or two syllables and do not consistently mark gender.
- Epithets are earned and describe a deed, a journey, a count of winters or a role — not a disposition. Orcs in the 2024 rules are a people, not a moral alignment, and this generator never produces violence-coded or "evil-sounding" names by default.
- Tribe or band names are used alongside personal names in some communities and omitted entirely in others.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Tiefling

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Player’s Handbook (2024); SRD 5.2.1
- **Confidence:** Documented
- **Naming traditions:** Inherited Infernal name (weight 7), Virtue name (weight 6), Name of the region (weight 5)
- **Architectures used:** chosen/virtue, compound, phonetic
- **Structures:** 8

Naming observations:

- Tieflings use three distinct and equally legitimate naming traditions: inherited Infernal names, ordinary names from the region they grew up in, and chosen "virtue names" taken from a concept or quality.
- Virtue names are not required to be grim; the published examples range from Hope and Reverence to Nowhere and Random.
- The 2024 rules give tieflings a fiendish legacy (Abyssal, Chthonic or Infernal) rather than a bloodline, and attach no naming rules to the choice, so this entry does not invent per-legacy phonologies.
- A tiefling raised among humans is very likely to have a perfectly ordinary human name, and the generator reflects that.

Citations: <https://www.dndbeyond.com/posts/1783-the-10-species-in-the-2024-players-handbook>, <https://www.dndbeyond.com/srd>

### Aarakocra

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Elemental Evil Player’s Companion
- **Confidence:** Documented
- **Naming traditions:** Call-name and flock (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Aarakocra names are combinations of clicks, whistles and trills, written in Common with doubled consonants and apostrophes.
- Names are short and gender-neutral; aarakocra identify by flock rather than by family.
- The flock names here are an original extension — published material names flocks but does not tabulate them.

Citations: <https://www.dndbeyond.com/species>

### Astral Elf

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Partial
- **Naming traditions:** Elven name with an epoch (weight 7)
- **Architectures used:** chosen/virtue, morphological, phonetic
- **Structures:** 4

Naming observations:

- Astral elves have lived for millennia in the Astral Sea, where time does not pass normally; the sourcebook describes that condition but publishes no separate name table.
- They use elven naming, which this entry inherits. The epoch reference — the age an astral elf counts themselves from — is an original extension built on the documented timelessness.

Citations: <https://www.dndbeyond.com/species>

### Autognome

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Partial
- **Naming traditions:** Maker’s designation (weight 7)
- **Architectures used:** descriptive phrase, morphological, phonetic
- **Structures:** 4

Naming observations:

- Autognomes are built by rock gnomes, and published material presents them as receiving a serial designation from their maker.
- An autognome who has outlived or outgrown its maker often picks up a gnome-style nickname, and some adopt a gnomish clan name from the family that built them.
- The specific designations here are original; the designation-plus-nickname shape follows the published description.

Citations: <https://www.dndbeyond.com/species>

### Bugbear

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Partial
- **Naming traditions:** Single name and epithet (weight 8)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Bugbears share the goblinoid tongue; published names are one or two heavy syllables with no inherited family name.
- Epithets describing reach, quiet and patience are an original extension built on the documented bugbear traits of stealth and long arms.

Citations: <https://www.dndbeyond.com/species>

### Centaur

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Guildmasters’ Guide to Ravnica; Mythic Odysseys of Theros
- **Confidence:** Partial
- **Naming traditions:** Personal name and band (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Centaur names in published settings have a Hellenic colouring, and centaurs identify by band or herd rather than by inherited family.
- Monsters of the Multiverse makes centaurs fey; the band structure survives across both treatments.
- The band vocabulary here is original; the structure follows the published settings.

Citations: <https://www.dndbeyond.com/species>

### Changeling

- **Classification:** Expanded
- **Sources:** Eberron: Rising from the Last War; Monsters of the Multiverse; Eberron: Forge of the Artificer
- **Confidence:** Documented
- **Naming traditions:** True name (weight 3), A persona (weight 6)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- A changeling’s true name is almost always a single syllable, and it is shared sparingly.
- Changelings adopt a different name for each persona, as readily as a face, so most of the names a changeling uses are perfectly ordinary names from wherever the persona lives.
- That is why this entry has two traditions: the monosyllabic true name, and a complete common-tongue identity.

Citations: <https://www.dndbeyond.com/species>, <https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

### Deep Gnome (Svirfneblin)

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes; Elemental Evil Player’s Companion
- **Confidence:** Partial
- **Naming traditions:** Warren and clan (weight 7)
- **Architectures used:** morphological, phonetic
- **Structures:** 2

Naming observations:

- Deep gnomes keep gnomish naming — a short everyday name and a clan name — but with far less of the accumulated nickname habit of surface gnomes, which published material describes as a cultural difference.
- The harsher consonant colouring is an original extension; no separate svirfneblin name table has been published.

Citations: <https://www.dndbeyond.com/species>

### Dhampir (lineage)

- **Classification:** Expanded
- **Sources:** Van Richten’s Guide to Ravenloft; Ravenloft: The Horrors Within
- **Confidence:** Documented
- **Naming traditions:** The name they already had (weight 7), A name taken since (weight 3)
- **Architectures used:** chosen/virtue, compound, phonetic
- **Structures:** 5

Naming observations:

- Dhampir is a lineage, not a species: a person of any ancestry who was changed. Most keep the name they already had, which is why this entry uses the shared common-tongue registers and says so.
- Some adopt a second name marking the change — an original extension, kept optional and never the default.
- If you want a dhampir elf or a dhampir dwarf, generate the species name and treat this entry as the overlay.

Citations: <https://www.dndbeyond.com/species>

### Duergar

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Partial
- **Naming traditions:** Deep clan (weight 7)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 3

Naming observations:

- Duergar are dwarves of the Underdark; they keep dwarven naming — personal name plus clan — and no separate name table has been published.
- The darker vowel colouring and the industrial clan vocabulary here are original extensions consistent with the published setting, not invented lore.

Citations: <https://www.dndbeyond.com/species>

### Eladrin

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Partial
- **Naming traditions:** Elven name with a season (weight 7)
- **Architectures used:** chosen/virtue, compound, morphological, phonetic
- **Structures:** 4

Naming observations:

- Eladrin are fey elves whose temperament and appearance shift with a season, and published material ties that season to mood rather than to naming.
- No separate eladrin name list has been published, so they use elven naming: a chosen adult name plus a family name.
- The seasonal epithet here is an original extension that follows the documented season mechanic rather than contradicting it.

Citations: <https://www.dndbeyond.com/species>

### Fairy

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; The Wild Beyond the Witchlight
- **Confidence:** Original
- **Naming traditions:** True name and seeming (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- No fairy name table has been published. Monsters of the Multiverse describes fairies as native to the Feywild and as varied as the fey themselves, and leaves naming open.
- This entry is therefore an original naming grammar: light, quick, open syllables, with a transparent "seeming" name of the kind fey are described as using with outsiders.
- Fairies in published material guard their true names, which is the basis for the structure that gives a seeming name only.

Citations: <https://www.dndbeyond.com/species>

### Firbolg

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** Descriptive name in Common (weight 7), A borrowed name (weight 4)
- **Architectures used:** compound, descriptive phrase, phonetic
- **Structures:** 3

Naming observations:

- Firbolgs traditionally do not name things, including themselves; a firbolg among their own people is simply referred to by what they are.
- When dealing with others, firbolgs adopt a descriptive name in Common, or borrow a name from a neighbouring people — most often an elven one.
- That is why this entry offers a descriptive phrase tradition and an adopted-name tradition rather than a firbolg "language" that does not exist.

Citations: <https://www.dndbeyond.com/species>

### Genasi

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Elemental Evil Player’s Companion
- **Confidence:** Documented
- **Naming traditions:** Name of the people who raised them (weight 5), Air genasi (weight 3), Earth genasi (weight 3), Fire genasi (weight 3), Water genasi (weight 3)
- **Architectures used:** compound, phonetic
- **Structures:** 10

Naming observations:

- Genasi use the naming conventions of whoever raised them; the shared common-tongue registers cover that case and the result says so.
- Many also carry a name marking their elemental manifestation, and the four elemental lines — air, earth, fire and water — sound noticeably different from one another.
- Each element below is a separate naming tradition within this one species entry, rather than four duplicate species.

Citations: <https://www.dndbeyond.com/species>

### Giff

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Documented
- **Naming traditions:** Rank and name (weight 10)
- **Architectures used:** closed set, compound, phonetic
- **Structures:** 3

Naming observations:

- A giff does not omit their rank. Published material is consistent on this: the rank is part of the name, and even a retired giff keeps the last one they held.
- The surname is a sturdy compound in the Common tongue; the personal name is short and plosive.
- Rank is a closed set, which is why it is the one place in this generator where a fixed list is the correct model.

Citations: <https://www.dndbeyond.com/species>

### Githyanki

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Documented
- **Naming traditions:** Name and crèche (weight 10)
- **Architectures used:** morphological, phonetic
- **Structures:** 3

Naming observations:

- Published githyanki names are hard and angular, frequently carrying an internal apostrophe, with -th and -s endings common.
- Githyanki organise by crèche rather than family; the crèche or house name is the second element where one is used.
- The specific house vocabulary here is original; the apostrophised shape follows published examples.

Citations: <https://www.dndbeyond.com/species>

### Githzerai

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Documented
- **Naming traditions:** Name and monastery (weight 10)
- **Architectures used:** phonetic
- **Structures:** 2

Naming observations:

- Published githzerai names are shorter and blunter than githyanki ones, heavy with doubled vowels and consonant endings, and carry no apostrophes.
- Githzerai identify by the monastery they trained in rather than by family. The monastery names here are original.

Citations: <https://www.dndbeyond.com/species>

### Goblin

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters; Guildmasters’ Guide to Ravnica
- **Confidence:** Partial
- **Naming traditions:** Single name and earned nickname (weight 8)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Published goblin names are short, one or two syllables, heavy on hard consonants, and are not consistently marked for gender.
- Goblins commonly acquire a practical nickname for a specific thing they did or carry; this generator favours those over inherited surnames, which goblins generally lack.
- Goblins in the current rules are a people with their own communities, so nothing here is coded as monstrous or evil.

Citations: <https://www.dndbeyond.com/species>

### Hadozee

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Original
- **Naming traditions:** Name and berth (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- No hadozee name table has been published. The sourcebook establishes them as a spacefaring people with a deep shipboard culture and a strong sense of crew.
- This is therefore an original naming grammar: short bright names with a crew or rigging name attached, built on the documented shipboard culture. It is marked original.

Citations: <https://www.dndbeyond.com/species>

### Half-Elf

- **Classification:** Expanded
- **Sources:** Player’s Handbook (2014); Basic Rules
- **Confidence:** Documented
- **Naming traditions:** Raised among elves (weight 4), Raised among humans (weight 4), A name from each side (weight 4)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 7

Naming observations:

- Half-elves use either human or elven naming conventions, and a great many use a blend — one name from each side.
- The 2024 Player’s Handbook folds mixed heritage into the two parent species rather than printing a separate half-elf entry; this remains a supported legacy option.
- Because both parent traditions are documented, this entry draws on both openly rather than inventing a third.

Citations: <https://www.dndbeyond.com/species>

### Half-Orc

- **Classification:** Expanded
- **Sources:** Player’s Handbook (2014); Basic Rules
- **Confidence:** Documented
- **Naming traditions:** Raised among orcs (weight 5), Raised among humans (weight 4), A name from each side (weight 3)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 8

Naming observations:

- Half-orcs use orc names, human names, or both, depending on who raised them.
- Epithets earned among orc communities are common and describe deeds or roles rather than temperament.
- The 2024 Player’s Handbook folds mixed heritage into the parent species; this remains a supported legacy option.

Citations: <https://www.dndbeyond.com/species>

### Harengon

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; The Wild Beyond the Witchlight
- **Confidence:** Original
- **Naming traditions:** Descriptive name (weight 10)
- **Architectures used:** descriptive phrase
- **Structures:** 1

Naming observations:

- No harengon name table has been published; the sourcebooks establish them as fey rabbitfolk who travel constantly and value luck and freedom.
- This entry is an original descriptive-phrase grammar built on those described values. It is marked original rather than presented as lore.

Citations: <https://www.dndbeyond.com/species>

### Hexblood (lineage)

- **Classification:** Expanded
- **Sources:** Van Richten’s Guide to Ravenloft; Ravenloft: The Horrors Within
- **Confidence:** Partial
- **Naming traditions:** The name from before (weight 5), The name the hag gave (weight 4)
- **Architectures used:** compound, phonetic
- **Structures:** 5

Naming observations:

- Hexblood is a lineage: someone a hag took and changed. The original name usually survives, so the common-tongue registers apply.
- Hags deal in names, and a hexblood frequently carries one the hag gave them. The hag-given compound here is an original construction built on the documented bargain-and-naming theme.

Citations: <https://www.dndbeyond.com/species>

### Hobgoblin

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters; Eberron: Rising from the Last War
- **Confidence:** Partial
- **Naming traditions:** Personal name and clan (weight 8)
- **Architectures used:** closed set, morphological, phonetic
- **Structures:** 3

Naming observations:

- Hobgoblin society in published material is organised around legions and clans, and a hobgoblin is identified by their unit as much as by their personal name.
- Eberron’s Dhakaani hobgoblins use apostrophised clan names, which is the documented basis for the internal mark here.
- Monsters of the Multiverse reframes hobgoblins as fey-touched and intensely communal; the naming here reflects that collective identity rather than a military stereotype.

Citations: <https://www.dndbeyond.com/species>, <https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

### Kalashtar

- **Classification:** Expanded
- **Sources:** Eberron: Rising from the Last War; Monsters of the Multiverse; Eberron: Forge of the Artificer
- **Confidence:** Documented
- **Naming traditions:** Bonded name (weight 10)
- **Architectures used:** phonetic
- **Structures:** 2

Naming observations:

- A kalashtar name blends a personal element with the name of the bonded quori spirit; published names are almost always two syllables.
- Gender is marked by a soft suffix, and the spirit’s gender identity need not match the kalashtar’s — so a kalashtar of any identity may carry any of these suffixes. This generator does not enforce a match.
- The quori spirit’s own name is not spoken to outsiders, which is why it appears here only at the most elaborate settings and is labelled as unspoken.

Citations: <https://www.dndbeyond.com/species>, <https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

### Kender

- **Classification:** Expanded
- **Sources:** Dragonlance: Shadow of the Dragon Queen
- **Confidence:** Documented
- **Naming traditions:** Personal and family name (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Kender personal names published for Krynn are long, playful and multi-syllabic, and they carry transparent compound family names.
- Kender collect nicknames with enthusiasm, and a kender will often give a different one depending on the day.
- The specific vocabulary here is original; the shape follows the published Dragonlance convention.

Citations: <https://www.dndbeyond.com/species>

### Kenku

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** Name from a sound (weight 10)
- **Architectures used:** compound, morphological
- **Structures:** 5

Naming observations:

- Kenku names come from sounds a kenku mimics, so they are onomatopoeic words or compounds of a source and a sound — never pseudo-fantasy syllables.
- Names are gender-neutral and there are no family names.
- Monsters of the Multiverse removed the hard restriction on kenku speech, but the naming habit is cultural and persists.

Citations: <https://www.dndbeyond.com/species>

### Kobold

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Partial
- **Naming traditions:** Name and trade (weight 8)
- **Architectures used:** compound, phonetic
- **Structures:** 4

Naming observations:

- Kobold names draw on Draconic sounds — sibilants and hard stops with frequent -ix and -ss endings — and are short.
- Kobolds organise around a warren and a job, so a trade-name attached to the personal name is the common full form. The specific trade vocabulary here is original.
- Monsters of the Multiverse detaches kobolds from draconic servitude; nothing here implies subservience.

Citations: <https://www.dndbeyond.com/species>

### Leonin

- **Classification:** Expanded
- **Sources:** Mythic Odysseys of Theros
- **Confidence:** Partial
- **Naming traditions:** Personal name and pride (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Leonin names published for Theros mix melodic and harsh sounds against a broadly Hellenic backdrop.
- A leonin carries a pride name as well as a personal name; pride names are transparent Common compounds.
- The specific pride vocabulary here is original; the structure (personal name plus pride) follows the published setting.

Citations: <https://www.dndbeyond.com/species>

### Lizardfolk

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** A Draconic word (weight 10)
- **Architectures used:** morphological
- **Structures:** 3

Naming observations:

- A lizardfolk name is a Draconic word, chosen for what it means — a physical feature, a deed, or a thing in the world. Names are gender-neutral.
- Lizardfolk may take a new name after a significant event, so a person can accumulate several across a lifetime.
- The Draconic vocabulary here is original to this tool; the published word list is not reproduced. The mechanism — word-as-name — is canonical.

Citations: <https://www.dndbeyond.com/species>

### Loxodon

- **Classification:** Expanded
- **Sources:** Guildmasters’ Guide to Ravnica
- **Confidence:** Partial
- **Naming traditions:** Personal and family name (weight 10)
- **Architectures used:** phonetic
- **Structures:** 3

Naming observations:

- Loxodon names published for Ravnica use low, resonant, open sounds — long vowels and nasals — matching how loxodons speak.
- Loxodons value family and community deeply and carry a family name, often with a long and deliberate full form.
- The specific vocabulary here is original; the sound profile follows the published examples.

Citations: <https://www.dndbeyond.com/species>

### Minotaur

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Guildmasters’ Guide to Ravnica; Mythic Odysseys of Theros
- **Confidence:** Partial
- **Naming traditions:** Personal name and earned surname (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Published minotaur names are guttural with a Hellenic colouring, and minotaurs carry a surname earned for a deed or a merit.
- Earned surnames in this generator describe work, craft and endurance as readily as combat — minotaurs in current material are labyrinth-builders and navigators, not a warrior monoculture.

Citations: <https://www.dndbeyond.com/species>

### Owlin

- **Classification:** Expanded
- **Sources:** Strixhaven: A Curriculum of Chaos
- **Confidence:** Original
- **Naming traditions:** Name and roost (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Strixhaven publishes no owlin name table; owlin are presented as a scholarly, nocturnal people descended from owls.
- This is therefore an original naming grammar — soft, rounded, breathy sounds, with a transparent night-and-study compound used as a family name. It is marked original, not presented as lore.

Citations: <https://www.dndbeyond.com/species>

### Plasmoid

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Partial
- **Naming traditions:** A sound they can make (weight 6), A borrowed word (weight 5)
- **Architectures used:** chosen/virtue, phonetic
- **Structures:** 3

Naming observations:

- Plasmoids communicate in vibrations and take names that are either the closest sound they can produce or a word borrowed from whoever they are living among.
- There is no inherited name and no family name; a plasmoid’s name is entirely self-chosen.
- Both traditions below follow that published description. The specific sounds and borrowed words are original.

Citations: <https://www.dndbeyond.com/species>

### Reborn (lineage)

- **Classification:** Expanded
- **Sources:** Van Richten’s Guide to Ravenloft; Ravenloft: The Horrors Within
- **Confidence:** Partial
- **Naming traditions:** A name they recovered (weight 5), Only part of a name (weight 4)
- **Architectures used:** chosen/virtue, compound, phonetic
- **Structures:** 5

Naming observations:

- Reborn is a lineage: someone who died and came back, carrying fragments of a former life. The published material makes memory loss central.
- This entry supports three cases that follow from that: a recovered full name, a partial name with the rest missing, and a name found on an object. The partial-name structures are an original construction.

Citations: <https://www.dndbeyond.com/species>

### Satyr

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mythic Odysseys of Theros
- **Confidence:** Partial
- **Naming traditions:** Name and reputation (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 3

Naming observations:

- Satyr names published for Theros sit against a Hellenic backdrop; satyrs are fey in Monsters of the Multiverse and keep that sound.
- Satyrs accumulate reputations rather than surnames, and the earned second name reflects something they are known for.
- The reputation vocabulary here is original. It avoids reducing satyrs to a single appetite — being thrice-forgiven is as satyr as being thirsty.

Citations: <https://www.dndbeyond.com/species>

### Sea Elf

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Partial
- **Naming traditions:** Elven name of the deep (weight 7)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 2

Naming observations:

- Sea elves live in the oceans of the Material Plane and keep elven naming; no separate published name table exists for them.
- Their translated family names are built from the sea rather than the forest, which is an original extension consistent with where they live.

Citations: <https://www.dndbeyond.com/species>

### Shadar-kai

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Mordenkainen’s Tome of Foes
- **Confidence:** Partial
- **Naming traditions:** Elven name of the Shadowfell (weight 7)
- **Architectures used:** compound, morphological, phonetic
- **Structures:** 4

Naming observations:

- Shadar-kai are elves shaped by long service in the Shadowfell; published material describes that service but gives no separate name list.
- They use elven naming with a drier, greyer sound, and epithets attached to a term of service. Both the phonetic shading and the epithets are original extensions.

Citations: <https://www.dndbeyond.com/species>

### Shifter

- **Classification:** Expanded
- **Sources:** Eberron: Rising from the Last War; Monsters of the Multiverse; Eberron: Forge of the Artificer
- **Confidence:** Partial
- **Naming traditions:** Plain name (weight 10)
- **Architectures used:** compound, morphological
- **Structures:** 3

Naming observations:

- Published shifter names are short, plain and often taken from the natural world; shifters generally do not carry inherited family names.
- A descriptive second name earned within a community is common, and functions as a nickname rather than a surname.
- No shifter name table has been published, so the specific vocabulary here is original while the shape follows the described convention.

Citations: <https://www.dndbeyond.com/species>, <https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

### Simic Hybrid

- **Classification:** Expanded
- **Sources:** Guildmasters’ Guide to Ravnica
- **Confidence:** Documented
- **Naming traditions:** The name they already had (weight 7), Specimen designation (weight 3)
- **Architectures used:** compound, descriptive phrase, phonetic
- **Structures:** 5

Naming observations:

- A simic hybrid began as a member of another Ravnican people and was altered by the Simic Combine, so they keep the name they already had.
- Alongside that name a hybrid carries a specimen designation from the laboratory that performed the work; some use it, most do not.
- This entry uses the common-tongue registers for the personal name and says so, rather than inventing a "hybrid language".

Citations: <https://www.dndbeyond.com/species>

### Tabaxi

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** Descriptive name (weight 10)
- **Architectures used:** descriptive phrase
- **Structures:** 2

Naming observations:

- A tabaxi name is a short descriptive phrase — a sensory image or a moment — rather than a personal name in the usual sense, and it is gender-neutral.
- One word of the phrase becomes the everyday short name: "Cloud" from a longer phrase about a cloud.
- Clan names are drawn from a geographic feature of the clan’s territory, and are two words.
- This entry never falls back on pseudo-fantasy syllables for tabaxi; the phrase architecture is the whole point.

Citations: <https://www.dndbeyond.com/species>

### Thri-kreen

- **Classification:** Expanded
- **Sources:** Spelljammer: Astral Adventurer’s Guide
- **Confidence:** Partial
- **Naming traditions:** Click-name and clutch (weight 10)
- **Architectures used:** phonetic
- **Structures:** 3

Naming observations:

- Thri-kreen names published across editions are built from clicking, chirping consonants and are commonly written with apostrophes and doubled letters.
- Thri-kreen identify by clutch rather than by family, and many thri-kreen communicate partly through pheromone and posture that written Common cannot represent — so a written name is only part of it.
- The clutch names here are original; the sound profile follows published examples.

Citations: <https://www.dndbeyond.com/species>

### Tortle

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; The Tortle Package
- **Confidence:** Partial
- **Naming traditions:** Hatch name (weight 10)
- **Architectures used:** compound, phonetic
- **Structures:** 2

Naming observations:

- Published tortle names are short — one or two syllables — given by a parent at hatching and kept for life.
- Tortles have no inherited family names; where a second element appears it is the place a tortle hatched.
- The hatching-place vocabulary here is an original extension consistent with tortle coastal life.

Citations: <https://www.dndbeyond.com/species>

### Triton

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Documented
- **Naming traditions:** Personal name and family (weight 10)
- **Architectures used:** morphological, phonetic
- **Structures:** 2

Naming observations:

- Tritons use a personal name and a surname, and the surname marks the family a triton belongs to — published material is explicit that the surname matters to them.
- Published names are flowing, with -os and -yn endings common.
- The specific family vocabulary here is original; the structure follows the published convention.

Citations: <https://www.dndbeyond.com/species>

### Vedalken

- **Classification:** Expanded
- **Sources:** Guildmasters’ Guide to Ravnica
- **Confidence:** Partial
- **Naming traditions:** Formal name and discipline (weight 10)
- **Architectures used:** morphological, phonetic
- **Structures:** 3

Naming observations:

- Vedalken published for Ravnica are defined by precision and the pursuit of perfection, and their names read as formal and measured.
- A vedalken is commonly identified by their field of study as much as by a family name, which is the basis for the discipline-name tradition here.
- The specific vocabulary is original; the formal register follows the published characterisation.

Citations: <https://www.dndbeyond.com/species>

### Warforged

- **Classification:** Expanded
- **Sources:** Eberron: Rising from the Last War; Monsters of the Multiverse; Eberron: Forge of the Artificer
- **Confidence:** Documented
- **Naming traditions:** A chosen word (weight 8), Forge designation (weight 4)
- **Architectures used:** chosen/virtue, descriptive phrase
- **Structures:** 3

Naming observations:

- Warforged choose their own single-word names: a function, a material, or a concept. There are no family names and no birth names.
- The chosen name is often the first real decision a warforged made as a free person, which is why a word as plain as "Anchor" carries weight.
- Warforged who have not chosen, or who prefer not to, keep the series designation from the creation forge — which is why that is a separate tradition here rather than a fallback.

Citations: <https://www.dndbeyond.com/species>, <https://media.wizards.com/2018/dnd/downloads/723UA_EberronRaces7232018.pdf>

### Yuan-ti

- **Classification:** Expanded
- **Sources:** Monsters of the Multiverse; Volo’s Guide to Monsters
- **Confidence:** Partial
- **Naming traditions:** Personal name and house (weight 10)
- **Architectures used:** morphological, phonetic
- **Structures:** 3

Naming observations:

- Published yuan-ti names are strongly sibilant, with doubled s and sh sounds, and are not especially long.
- Yuan-ti society is organised by lineage, so a house or line name alongside the personal name is the formal full form.
- Monsters of the Multiverse detaches yuan-ti from an assumed alignment; nothing in this generator is coded as villainous.

Citations: <https://www.dndbeyond.com/species>

### Unspecified

- **Classification:** Core — 2024 Player’s Handbook
- **Sources:** Original to Session Zero
- **Confidence:** Original
- **Naming traditions:** Unspecified (weight 1)
- **Architectures used:** chosen/virtue, compound, phonetic
- **Structures:** 5

Naming observations:

- Used when no species is chosen. Four original phonologies plus the shared common-tongue registers produce a name that reads as fantasy without claiming any particular people.
- Surnames appear less often here than in any single culture, because an unspecified character should not be quietly assigned a family tradition.

<!-- END SPECIES_DETAIL -->

---

## 7. Licensing and attribution

This work includes material from the System Reference Document 5.2.1
("SRD 5.2.1") by Wizards of the Coast LLC, available at
<https://www.dndbeyond.com/srd>. The SRD 5.2.1 is licensed under the Creative
Commons Attribution 4.0 International License, available at
<https://creativecommons.org/licenses/by/4.0/legalcode>.

Session Zero is unofficial Fan Content permitted under the Wizards of the Coast
Fan Content Policy. It is not approved or endorsed by Wizards. Portions of the
materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.

No copyrighted name tables, sourcebook text, logos or artwork are reproduced.
Species and background names are used nominatively to identify the game options
the tool supports. All generated names, all word lists, all phonologies and all
character-hook text in this repository are original work created for this tool.
