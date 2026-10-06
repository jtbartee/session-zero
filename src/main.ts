/**
 * Session Zero — application wiring.
 *
 * Everything runs client-side: no network, no account, no analytics. The
 * engine is constructed once and reused so its diversity ledger and recent
 * history accumulate across a session.
 */

import './styles/index.css';

import { Combobox, type ComboGroup } from './components/combobox.ts';
import { Segmented } from './components/segmented.ts';
import { toast } from './components/toast.ts';
import { flashCopied, paintFavouriteButton, renderCard } from './components/card.ts';
import { CATALOGUE } from './engine/catalogue.ts';
import { NameEngine } from './engine/generator.ts';
import { ALL_BACKGROUNDS } from './data/backgrounds/index.ts';
import { ALL_SPECIES, speciesGroups } from './data/species/index.ts';
import { FavouritesStore } from './storage/favourites.ts';
import { LocalHistory } from './storage/history.ts';
import { copyText, downloadFile } from './utils/clipboard.ts';
import type {
  Complexity, GeneratedCharacter, GenderStyle, GenerationOptions, NameStyle,
} from './types/index.ts';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const NOT_SPECIFIED = '__none__';
const RANDOM = 'random';

interface Settings {
  species: string;
  background: string;
  genderStyle: GenderStyle;
  style: NameStyle;
  complexity: Complexity;
  count: number;
  includeHook: boolean;
}

const DEFAULTS: Settings = {
  species: NOT_SPECIFIED,
  background: NOT_SPECIFIED,
  genderStyle: 'any',
  style: 'distinctive',
  complexity: 3,
  count: 1,
  includeHook: false,
};

const settings: Settings = { ...DEFAULTS };
let results: GeneratedCharacter[] = [];

const history = new LocalHistory();
const favourites = new FavouritesStore();
const engine = new NameEngine({ catalogue: CATALOGUE, history });

// ---------------------------------------------------------------------------
// Element lookup
// ---------------------------------------------------------------------------

function need<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Session Zero: missing element #${id}`);
  return el as T;
}

const els = {
  form: need<HTMLFormElement>('controls'),
  generate: need<HTMLButtonElement>('generate'),
  reset: need<HTMLButtonElement>('reset'),
  complexity: need<HTMLInputElement>('complexity'),
  complexityValue: need<HTMLOutputElement>('complexity-value'),
  includeHook: need<HTMLInputElement>('include-hook'),
  cardList: need<HTMLOListElement>('card-list'),
  emptyState: need<HTMLDivElement>('empty-state'),
  status: need<HTMLParagraphElement>('status'),
  copyAll: need<HTMLButtonElement>('copy-all'),
  clearResults: need<HTMLButtonElement>('clear-results'),
  styleHint: need<HTMLParagraphElement>('style-hint'),
  speciesHint: need<HTMLParagraphElement>('species-hint'),
  favToggle: need<HTMLButtonElement>('favourites-toggle'),
  favCount: need<HTMLSpanElement>('favourites-count'),
  favCountLabel: need<HTMLSpanElement>('favourites-count-label'),
  favPanel: need<HTMLDivElement>('favourites-panel'),
  favClose: need<HTMLButtonElement>('favourites-close'),
  favBody: need<HTMLDivElement>('favourites-body'),
  exportJson: need<HTMLButtonElement>('export-json'),
  exportText: need<HTMLButtonElement>('export-text'),
  clearFavourites: need<HTMLButtonElement>('clear-favourites'),
  footerCounts: need<HTMLSpanElement>('footer-counts'),
};

// ---------------------------------------------------------------------------
// Option lists
// ---------------------------------------------------------------------------

function buildSpeciesGroups(): ComboGroup[] {
  const groups: ComboGroup[] = [
    {
      label: 'General',
      options: [
        { value: NOT_SPECIFIED, label: 'Not Specified', hint: 'no species', keywords: 'none any blank default' },
        { value: RANDOM, label: 'Random Species', hint: 'picks one', keywords: 'surprise shuffle' },
      ],
    },
  ];
  for (const group of speciesGroups()) {
    groups.push({
      label: group.label,
      options: group.species.map((spec) => ({
        value: spec.id,
        label: spec.name,
        hint: spec.tier === 'core' ? 'Core' : undefined,
        keywords: `${spec.sources.join(' ')} ${spec.traditions.map((t) => t.label).join(' ')}`,
      })),
    });
  }
  return groups;
}

function buildBackgroundGroups(): ComboGroup[] {
  const core = ALL_BACKGROUNDS.filter((b) => b.tier === 'core');
  const expanded = ALL_BACKGROUNDS.filter((b) => b.tier === 'expanded');
  return [
    {
      label: 'General',
      options: [
        { value: NOT_SPECIFIED, label: 'Not Specified', hint: 'no background', keywords: 'none any blank default' },
        { value: RANDOM, label: 'Random Background', hint: 'picks one', keywords: 'surprise shuffle' },
      ],
    },
    {
      label: 'Core — 2024 Player’s Handbook',
      options: core.map((b) => ({ value: b.id, label: b.name, hint: 'Core', keywords: b.register })),
    },
    {
      label: 'Expanded — legacy and supplements',
      options: expanded.map((b) => ({ value: b.id, label: b.name, hint: undefined, keywords: `${b.source} ${b.register}` })),
    },
  ];
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

const speciesCombo = new Combobox(need('species-combobox'), {
  id: 'species',
  labelledBy: 'species-label',
  groups: buildSpeciesGroups(),
  value: settings.species,
  searchPlaceholder: 'Search 56 species…',
  onChange: (value) => {
    settings.species = value;
    els.speciesHint.textContent = speciesHintFor(value);
  },
});

const backgroundCombo = new Combobox(need('background-combobox'), {
  id: 'background',
  labelledBy: 'background-label',
  groups: buildBackgroundGroups(),
  value: settings.background,
  searchPlaceholder: 'Search backgrounds…',
  onChange: (value) => {
    settings.background = value;
  },
});

const genderSegmented = new Segmented<GenderStyle>(need('gender-segmented'), {
  name: 'gender-style',
  value: settings.genderStyle,
  options: [
    { value: 'any', label: 'Any' },
    { value: 'masculine', label: 'Masc' , description: 'Masculine-presenting name sounds' },
    { value: 'feminine', label: 'Fem', description: 'Feminine-presenting name sounds' },
    { value: 'neutral', label: 'Neutral', description: 'Gender-neutral name sounds' },
  ],
  onChange: (value) => { settings.genderStyle = value; },
});

const STYLE_HINTS: Record<NameStyle, string> = {
  traditional: 'Grounded and familiar. Leans on the commonest sounds a culture uses.',
  distinctive: 'Memorable and unusual, without sounding absurd.',
  wild: 'Bold and surprising — rare sounds and longer shapes, still culturally coherent.',
};

const styleSegmented = new Segmented<NameStyle>(need('style-segmented'), {
  name: 'style',
  value: settings.style,
  options: [
    { value: 'traditional', label: 'Traditional' },
    { value: 'distinctive', label: 'Distinctive' },
    { value: 'wild', label: 'Wild' },
  ],
  onChange: (value) => {
    settings.style = value;
    els.styleHint.textContent = STYLE_HINTS[value];
  },
});

const countSegmented = new Segmented<string>(need('count-segmented'), {
  name: 'count',
  value: String(settings.count),
  options: [
    { value: '1', label: '1' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
  ],
  onChange: (value) => { settings.count = Number(value); },
});

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  1: 'Simple',
  2: 'Plain',
  3: 'Balanced',
  4: 'Ornate',
  5: 'Elaborate',
};

els.complexity.addEventListener('input', () => {
  settings.complexity = Number(els.complexity.value) as Complexity;
  els.complexityValue.textContent = COMPLEXITY_LABELS[settings.complexity];
});

els.includeHook.addEventListener('change', () => {
  settings.includeHook = els.includeHook.checked;
});

function speciesHintFor(value: string): string {
  if (value === NOT_SPECIFIED) return 'Not Specified gives a general fantasy name with no species attached.';
  if (value === RANDOM) return 'Random Species picks a species per name and uses its real naming grammar.';
  const spec = CATALOGUE.speciesById.get(value);
  if (!spec) return '';
  const traditions = spec.traditions.length === 1
    ? spec.traditions[0]!.note
    : `${spec.traditions.length} naming traditions: ${spec.traditions.map((t) => t.label).join(', ')}.`;
  const confidence = spec.confidence === 'documented'
    ? 'Documented in published material.'
    : spec.confidence === 'partial'
      ? 'Partly documented; the rest is an original extension.'
      : 'No published naming guidance — an original grammar.';
  return `${traditions} ${confidence}`;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

function toEngineOptions(): GenerationOptions {
  return {
    species: settings.species === NOT_SPECIFIED ? null : settings.species === RANDOM ? 'random' : settings.species,
    background: settings.background === NOT_SPECIFIED ? null
      : settings.background === RANDOM ? 'random' : settings.background,
    genderStyle: settings.genderStyle,
    style: settings.style,
    complexity: settings.complexity,
    count: settings.count,
    includeHook: settings.includeHook,
  };
}

let rollTimer: number | null = null;

function generate(): void {
  // The dice turn once. There is no artificial delay: by the time the
  // animation starts the names already exist.
  els.generate.classList.add('is-rolling');
  if (rollTimer !== null) window.clearTimeout(rollTimer);
  rollTimer = window.setTimeout(() => els.generate.classList.remove('is-rolling'), 520);

  const { characters, diagnostics } = engine.generate(toEngineOptions());
  results = characters;
  paintResults(true);

  const plural = characters.length === 1 ? 'name' : 'names';
  announce(`${characters.length} ${plural} generated in ${Math.max(1, diagnostics.elapsedMs)} milliseconds. `
    + (characters[0] ? `First result: ${characters[0].name}.` : ''));
}

function announce(message: string): void {
  // Clearing first forces assistive tech to re-read an identical message.
  els.status.textContent = '';
  window.setTimeout(() => { els.status.textContent = message; }, 40);
}

/** A tradition label only tells the reader something when there is a choice. */
function hasMultipleTraditions(speciesId: string | null): boolean {
  if (!speciesId) return false;
  return (CATALOGUE.speciesById.get(speciesId)?.traditions.length ?? 0) > 1;
}

function paintResults(animate: boolean): void {
  els.cardList.textContent = '';
  const hasResults = results.length > 0;
  els.emptyState.hidden = hasResults;
  els.copyAll.hidden = !hasResults;
  els.clearResults.hidden = !hasResults;

  results.forEach((character, index) => {
    els.cardList.append(renderCard(character, {
      index,
      isFavourite: favourites.has(character.id),
      animate,
      showTradition: hasMultipleTraditions(character.speciesId),
    }, handlers));
  });
}

const handlers = {
  onCopy: (character: GeneratedCharacter) => {
    void copyText(character.name).then((ok) => {
      const button = els.cardList
        .querySelector<HTMLElement>(`[data-id="${CSS.escape(character.id)}"]`)
        ?.querySelector<HTMLButtonElement>('.card-action');
      if (ok && button) flashCopied(button);
      toast(ok ? `Copied “${character.name}”` : 'Could not reach the clipboard');
    });
  },
  onFavourite: (character: GeneratedCharacter, button: HTMLButtonElement) => {
    const saved = favourites.toggle(character);
    paintFavouriteButton(button, character.name, saved);
    toast(saved ? `Saved “${character.name}”` : `Removed “${character.name}”`);
    const warning = favourites.storageWarning();
    if (warning) toast(warning);
  },
  onReroll: (character: GeneratedCharacter, card: HTMLLIElement) => {
    const index = results.findIndex((c) => c.id === character.id);
    if (index < 0) return;
    const siblings = results.filter((c) => c.id !== character.id).map((c) => c.name);
    const replacement = engine.reroll({ ...toEngineOptions(), count: 1 }, siblings);
    if (!replacement) {
      toast('Could not find a sufficiently different name — try again');
      return;
    }
    results[index] = replacement;
    const fresh = renderCard(replacement, {
      index,
      isFavourite: favourites.has(replacement.id),
      animate: false,
      showTradition: hasMultipleTraditions(replacement.speciesId),
    }, handlers);
    fresh.classList.add('card--rerolled');
    card.replaceWith(fresh);
    // Keep the keyboard where the user left it.
    fresh.querySelector<HTMLButtonElement>('.card-action:nth-child(3)')?.focus();
    announce(`Rerolled. New name: ${replacement.name}.`);
  },
};

// ---------------------------------------------------------------------------
// Results toolbar
// ---------------------------------------------------------------------------

els.form.addEventListener('submit', (event) => {
  event.preventDefault();
  generate();
});

els.reset.addEventListener('click', () => {
  Object.assign(settings, DEFAULTS);
  speciesCombo.setValue(DEFAULTS.species);
  backgroundCombo.setValue(DEFAULTS.background);
  genderSegmented.setValue(DEFAULTS.genderStyle);
  styleSegmented.setValue(DEFAULTS.style);
  countSegmented.setValue(String(DEFAULTS.count));
  els.complexity.value = String(DEFAULTS.complexity);
  els.complexityValue.textContent = COMPLEXITY_LABELS[DEFAULTS.complexity];
  els.includeHook.checked = DEFAULTS.includeHook;
  els.styleHint.textContent = STYLE_HINTS[DEFAULTS.style];
  els.speciesHint.textContent = speciesHintFor(DEFAULTS.species);
  toast('Settings reset');
});

els.copyAll.addEventListener('click', () => {
  const text = results
    .map((c) => {
      const meta = [c.speciesName, c.backgroundName].filter(Boolean).join(' · ');
      return [c.name, meta && `  ${meta}`, c.hook && `  ${c.hook}`].filter(Boolean).join('\n');
    })
    .join('\n\n');
  void copyText(text).then((ok) => toast(ok ? `Copied ${results.length} names` : 'Could not reach the clipboard'));
});

els.clearResults.addEventListener('click', () => {
  results = [];
  paintResults(false);
  announce('Results cleared.');
  els.generate.focus();
});

// ---------------------------------------------------------------------------
// Favourites drawer
// ---------------------------------------------------------------------------

let lastFocused: HTMLElement | null = null;

function openFavourites(): void {
  lastFocused = document.activeElement as HTMLElement | null;
  els.favPanel.hidden = false;
  els.favToggle.setAttribute('aria-expanded', 'true');
  paintFavourites();
  els.favClose.focus();
  document.addEventListener('keydown', onDrawerKey);
}

function closeFavourites(): void {
  els.favPanel.hidden = true;
  els.favToggle.setAttribute('aria-expanded', 'false');
  document.removeEventListener('keydown', onDrawerKey);
  lastFocused?.focus();
}

function onDrawerKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeFavourites();
    return;
  }
  if (event.key !== 'Tab') return;
  // A modal dialog has to keep the keyboard inside it.
  const focusable = els.favPanel.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

els.favToggle.addEventListener('click', () => (els.favPanel.hidden ? openFavourites() : closeFavourites()));
els.favClose.addEventListener('click', closeFavourites);
els.favPanel.querySelector('[data-close-drawer]')?.addEventListener('click', closeFavourites);

function paintFavourites(): void {
  els.favBody.textContent = '';
  const items = favourites.all();
  const empty = items.length === 0;

  els.exportJson.disabled = empty;
  els.exportText.disabled = empty;
  els.clearFavourites.disabled = empty;

  if (empty) {
    const state = document.createElement('div');
    state.className = 'empty-state';
    const title = document.createElement('p');
    title.className = 'empty-state__title';
    title.textContent = 'No favourites yet.';
    const body = document.createElement('p');
    body.className = 'empty-state__body';
    body.textContent = 'Press Favourite on any generated name and it will be kept here, in this browser.';
    state.append(title, body);
    els.favBody.append(state);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'fav-list';
  for (const character of items) {
    const item = document.createElement('li');
    item.className = 'fav';

    const name = document.createElement('p');
    name.className = 'fav__name';
    name.textContent = character.name + (character.shortName ? ` — “${character.shortName}”` : '');
    item.append(name);

    const metaParts = [character.speciesName, character.backgroundName, character.traditionLabel]
      .filter(Boolean) as string[];
    metaParts.push(`${character.settings.style} · ${COMPLEXITY_LABELS[character.settings.complexity]}`);
    const meta = document.createElement('p');
    meta.className = 'fav__meta';
    meta.textContent = metaParts.join(' · ');
    item.append(meta);

    if (character.hook) {
      const hook = document.createElement('p');
      hook.className = 'fav__hook';
      hook.textContent = character.hook;
      item.append(hook);
    }

    const actions = document.createElement('div');
    actions.className = 'fav__actions';

    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'ghost-button';
    copy.textContent = 'Copy';
    copy.setAttribute('aria-label', `Copy ${character.name}`);
    copy.addEventListener('click', () => {
      void copyText(character.name).then((ok) => toast(ok ? `Copied “${character.name}”` : 'Could not reach the clipboard'));
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'ghost-button ghost-button--danger';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', `Remove ${character.name} from favourites`);
    remove.addEventListener('click', () => {
      favourites.remove(character.id);
      paintFavourites();
      // Reflect the change on any matching card still on screen.
      const card = els.cardList.querySelector<HTMLElement>(`[data-id="${CSS.escape(character.id)}"]`);
      const button = card?.querySelectorAll<HTMLButtonElement>('.card-action')[1];
      if (button) paintFavouriteButton(button, character.name, false);
      toast(`Removed “${character.name}”`);
    });

    actions.append(copy, remove);
    item.append(actions);
    list.append(item);
  }
  els.favBody.append(list);
}

els.exportJson.addEventListener('click', () => {
  downloadFile('session-zero-favourites.json', favourites.toJsonExport(), 'application/json');
  toast('Exported JSON');
});

els.exportText.addEventListener('click', () => {
  downloadFile('session-zero-favourites.txt', favourites.toTextExport(), 'text/plain');
  toast('Exported text');
});

els.clearFavourites.addEventListener('click', () => {
  if (favourites.size === 0) return;
  favourites.clear();
  paintFavourites();
  paintResults(false);
  toast('All favourites removed');
});

favourites.subscribe(() => {
  const n = favourites.size;
  els.favCount.textContent = String(n);
  els.favCountLabel.textContent = `${n} saved`;
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function boot(): void {
  els.favCount.textContent = String(favourites.size);
  els.favCountLabel.textContent = `${favourites.size} saved`;
  els.complexityValue.textContent = COMPLEXITY_LABELS[settings.complexity];
  els.styleHint.textContent = STYLE_HINTS[settings.style];
  els.footerCounts.textContent =
    `${ALL_SPECIES.length} species · ${ALL_BACKGROUNDS.length} backgrounds · everything runs in your browser`;
  paintResults(false);

  const warning = favourites.storageWarning();
  if (warning) toast(warning);
}

boot();
