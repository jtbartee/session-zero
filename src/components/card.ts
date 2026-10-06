/**
 * A generated character card.
 *
 * The name is the point, so it gets the largest type and everything else sits
 * underneath it. Actions are real buttons with accessible names that include
 * the character, because "Copy" repeated twenty times tells a screen-reader
 * user nothing.
 */

import type { GeneratedCharacter } from '../types/index.ts';

export interface CardHandlers {
  onCopy: (character: GeneratedCharacter) => void;
  onFavourite: (character: GeneratedCharacter, button: HTMLButtonElement) => void;
  onReroll: (character: GeneratedCharacter, card: HTMLLIElement) => void;
}

const ICONS = {
  copy: 'M7 7V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5v7a1.5 1.5 0 0 1-1.5 1.5H13M4.5 7h7A1.5 1.5 0 0 1 13 8.5v7A1.5 1.5 0 0 1 11.5 17h-7A1.5 1.5 0 0 1 3 15.5v-7A1.5 1.5 0 0 1 4.5 7Z',
  star: 'M10 14.6 5.2 17.2l.9-5.4-3.9-3.8 5.4-.8L10 2.3l2.4 4.9 5.4.8-3.9 3.8.9 5.4Z',
  reroll: 'M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 2.5V6H13',
  check: 'm4 10.5 4 4 8-9',
};

function svg(path: string): SVGSVGElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 20 20');
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('focusable', 'false');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', path);
  el.append(p);
  return el;
}

function action(label: string, icon: string, accessibleName: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-action';
  button.append(svg(icon));
  const text = document.createElement('span');
  text.textContent = label;
  button.append(text);
  button.setAttribute('aria-label', accessibleName);
  return button;
}

function tag(text: string, modifier: string): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = `tag tag--${modifier}`;
  el.textContent = text;
  return el;
}

export interface CardOptions {
  index: number;
  isFavourite: boolean;
  animate: boolean;
  /** Suppress the tradition tag when the species only has one. */
  showTradition: boolean;
}

export function renderCard(
  character: GeneratedCharacter,
  options: CardOptions,
  handlers: CardHandlers,
): HTMLLIElement {
  const { index, isFavourite, animate, showTradition } = options;
  const card = document.createElement('li');
  card.className = animate ? 'card card--enter' : 'card';
  card.dataset.id = character.id;
  if (animate) card.style.animationDelay = `${Math.min(index, 10) * 45}ms`;

  // --- name ---------------------------------------------------------
  const name = document.createElement('h3');
  name.className = 'card__name';
  name.textContent = character.name;
  if (character.shortName) {
    const short = document.createElement('span');
    short.className = 'card__short';
    short.textContent = `Goes by ${character.shortName}`;
    name.append(short);
  }
  card.append(name);

  // --- tags ---------------------------------------------------------
  const tags: HTMLSpanElement[] = [];
  if (character.speciesName) tags.push(tag(character.speciesName, 'species'));
  if (character.backgroundName) tags.push(tag(character.backgroundName, 'background'));
  if (showTradition && character.traditionLabel && character.speciesName) {
    tags.push(tag(character.traditionLabel, 'tradition'));
  }
  if (tags.length > 0) {
    const row = document.createElement('div');
    row.className = 'card__tags';
    row.append(...tags);
    card.append(row);
  }

  // --- hook ---------------------------------------------------------
  if (character.hook) {
    const hook = document.createElement('p');
    hook.className = 'card__hook';
    hook.textContent = character.hook;
    card.append(hook);
  }

  // --- component breakdown -------------------------------------------
  const labelled = character.components.filter((c) => c.label);
  if (labelled.length > 0) {
    const breakdown = document.createElement('p');
    breakdown.className = 'card__breakdown';
    for (const component of labelled) {
      const part = document.createElement('span');
      const b = document.createElement('b');
      b.textContent = `${component.label}: `;
      part.append(b, document.createTextNode(component.text));
      breakdown.append(part);
    }
    card.append(breakdown);
  }

  // --- actions --------------------------------------------------------
  const actions = document.createElement('div');
  actions.className = 'card__actions';

  const copy = action('Copy', ICONS.copy, `Copy ${character.name}`);
  copy.addEventListener('click', () => handlers.onCopy(character));

  const fav = action(isFavourite ? 'Saved' : 'Favourite', ICONS.star,
    `${isFavourite ? 'Remove' : 'Save'} ${character.name} ${isFavourite ? 'from' : 'to'} favourites`);
  fav.setAttribute('aria-pressed', String(isFavourite));
  fav.addEventListener('click', () => handlers.onFavourite(character, fav));

  const reroll = action('Reroll', ICONS.reroll, `Reroll ${character.name}`);
  reroll.addEventListener('click', () => handlers.onReroll(character, card));

  actions.append(copy, fav, reroll);
  card.append(actions);
  return card;
}

/** Flip a favourite button's label, icon state and accessible name together. */
export function paintFavouriteButton(button: HTMLButtonElement, name: string, saved: boolean): void {
  button.setAttribute('aria-pressed', String(saved));
  const text = button.querySelector('span');
  if (text) text.textContent = saved ? 'Saved' : 'Favourite';
  button.setAttribute('aria-label', `${saved ? 'Remove' : 'Save'} ${name} ${saved ? 'from' : 'to'} favourites`);
}

/** Briefly confirm a copy on the button itself, not only in a toast. */
export function flashCopied(button: HTMLButtonElement): void {
  const text = button.querySelector('span');
  if (!text) return;
  const original = text.textContent;
  button.classList.add('is-done');
  text.textContent = 'Copied';
  window.setTimeout(() => {
    button.classList.remove('is-done');
    text.textContent = original;
  }, 1400);
}
