/**
 * A searchable, grouped single-select.
 *
 * A native `<select>` with 56 grouped species is unusable on a phone and
 * unsearchable everywhere, so this is a button that opens a filtered listbox.
 * The ARIA shape is the standard one: the trigger is a disclosure button, and
 * while open the search input is the combobox that owns `aria-activedescendant`
 * over the listbox.
 */

export interface ComboOption {
  value: string;
  label: string;
  /** Secondary text shown on the right of the row (source book, tier). */
  hint?: string;
  /** Extra text matched by the filter but not displayed. */
  keywords?: string;
}

export interface ComboGroup {
  label: string;
  options: ComboOption[];
}

export interface ComboboxConfig {
  id: string;
  /** Id of the visible field label, for `aria-labelledby`. */
  labelledBy: string;
  groups: ComboGroup[];
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange: (value: string) => void;
}

let uid = 0;

export class Combobox {
  readonly root: HTMLDivElement;
  private readonly button: HTMLButtonElement;
  private readonly valueEl: HTMLSpanElement;
  private readonly popup: HTMLDivElement;
  private readonly search: HTMLInputElement;
  private readonly list: HTMLDivElement;
  private readonly config: ComboboxConfig;

  private open = false;
  private activeIndex = -1;
  private filtered: ComboOption[] = [];
  private value: string;

  constructor(mount: HTMLElement, config: ComboboxConfig) {
    this.config = config;
    this.value = config.value;
    const n = ++uid;
    const listId = `${config.id}-listbox-${n}`;

    this.root = document.createElement('div');
    this.root.className = 'combobox';

    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'combobox__button';
    this.button.id = `${config.id}-button`;
    this.button.setAttribute('aria-haspopup', 'listbox');
    this.button.setAttribute('aria-expanded', 'false');
    this.button.setAttribute('aria-controls', listId);
    this.button.setAttribute('aria-labelledby', `${config.labelledBy} ${config.id}-button`);

    this.valueEl = document.createElement('span');
    this.valueEl.className = 'combobox__value';
    this.button.append(this.valueEl);

    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('class', 'combobox__chevron');
    chevron.setAttribute('viewBox', '0 0 12 12');
    chevron.setAttribute('aria-hidden', 'true');
    const chevronPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chevronPath.setAttribute('d', 'm2 4.5 4 4 4-4');
    chevron.append(chevronPath);
    this.button.append(chevron);

    this.popup = document.createElement('div');
    this.popup.className = 'combobox__popup';
    this.popup.hidden = true;

    const searchWrap = document.createElement('div');
    searchWrap.className = 'combobox__search';
    this.search = document.createElement('input');
    this.search.type = 'text';
    this.search.setAttribute('role', 'combobox');
    this.search.setAttribute('aria-expanded', 'true');
    this.search.setAttribute('aria-controls', listId);
    this.search.setAttribute('aria-autocomplete', 'list');
    this.search.setAttribute('autocomplete', 'off');
    this.search.setAttribute('spellcheck', 'false');
    this.search.placeholder = config.searchPlaceholder ?? 'Search…';
    this.search.setAttribute('aria-label', config.searchPlaceholder ?? 'Search options');
    searchWrap.append(this.search);

    this.list = document.createElement('div');
    this.list.className = 'combobox__list';
    this.list.id = listId;
    this.list.setAttribute('role', 'listbox');

    this.popup.append(searchWrap, this.list);
    this.root.append(this.button, this.popup);
    mount.append(this.root);

    this.button.addEventListener('click', () => (this.open ? this.close() : this.openPopup()));
    this.button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.openPopup();
      }
    });
    this.search.addEventListener('input', () => this.render());
    this.search.addEventListener('keydown', (event) => this.onSearchKey(event));
    this.list.addEventListener('mousedown', (event) => {
      // mousedown, not click: the input's blur would otherwise close us first.
      const row = (event.target as HTMLElement).closest<HTMLElement>('[data-value]');
      if (!row) return;
      event.preventDefault();
      this.select(row.dataset.value as string);
    });
    document.addEventListener('pointerdown', this.onDocumentPointer, true);

    this.renderValue();
    this.render();
  }

  destroy(): void {
    document.removeEventListener('pointerdown', this.onDocumentPointer, true);
    this.root.remove();
  }

  /** Change the selection from outside (used by Reset). */
  setValue(value: string): void {
    this.value = value;
    this.renderValue();
  }

  getValue(): string {
    return this.value;
  }

  // -------------------------------------------------------------------

  private onDocumentPointer = (event: PointerEvent): void => {
    if (!this.open) return;
    if (!this.root.contains(event.target as Node)) this.close();
  };

  private get allOptions(): ComboOption[] {
    return this.config.groups.flatMap((g) => g.options);
  }

  private renderValue(): void {
    const match = this.allOptions.find((o) => o.value === this.value);
    this.valueEl.textContent = match?.label ?? this.config.placeholder ?? 'Select…';
    this.valueEl.classList.toggle('combobox__value--placeholder', !match);
  }

  private openPopup(): void {
    if (this.open) return;
    this.open = true;
    this.popup.hidden = false;
    this.button.setAttribute('aria-expanded', 'true');
    this.search.value = '';
    this.render();
    // Start on the current selection so Enter is a no-op rather than a surprise.
    this.activeIndex = Math.max(0, this.filtered.findIndex((o) => o.value === this.value));
    this.paintActive();
    this.search.focus();
  }

  private close(returnFocus = false): void {
    if (!this.open) return;
    this.open = false;
    this.popup.hidden = true;
    this.button.setAttribute('aria-expanded', 'false');
    this.search.removeAttribute('aria-activedescendant');
    if (returnFocus) this.button.focus();
  }

  private onSearchKey(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.move(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex = 0;
        this.paintActive();
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex = this.filtered.length - 1;
        this.paintActive();
        break;
      case 'Enter': {
        event.preventDefault();
        const option = this.filtered[this.activeIndex];
        if (option) this.select(option.value);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
      case 'Tab':
        this.close();
        break;
      default:
        break;
    }
  }

  private move(delta: number): void {
    if (this.filtered.length === 0) return;
    const next = this.activeIndex + delta;
    this.activeIndex = next < 0 ? this.filtered.length - 1 : next % this.filtered.length;
    this.paintActive();
  }

  private select(value: string): void {
    this.value = value;
    this.renderValue();
    this.close(true);
    this.config.onChange(value);
  }

  private render(): void {
    const query = this.search.value.trim().toLowerCase();
    this.list.textContent = '';
    this.filtered = [];

    for (const group of this.config.groups) {
      const matches = group.options.filter((option) => {
        if (!query) return true;
        const haystack = `${option.label} ${option.hint ?? ''} ${option.keywords ?? ''}`.toLowerCase();
        return haystack.includes(query);
      });
      if (matches.length === 0) continue;

      const heading = document.createElement('div');
      heading.className = 'combobox__group';
      heading.textContent = group.label;
      heading.setAttribute('role', 'presentation');
      this.list.append(heading);

      for (const option of matches) {
        const index = this.filtered.length;
        this.filtered.push(option);

        const row = document.createElement('div');
        row.className = 'combobox__option';
        row.id = `${this.list.id}-opt-${index}`;
        row.setAttribute('role', 'option');
        row.setAttribute('aria-selected', String(option.value === this.value));
        row.dataset.value = option.value;

        const label = document.createElement('span');
        label.textContent = option.label;
        row.append(label);

        if (option.hint && option.value !== this.value) {
          const hint = document.createElement('span');
          hint.className = 'combobox__source';
          hint.textContent = option.hint;
          row.append(hint);
        }
        this.list.append(row);
      }
    }

    if (this.filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'combobox__empty';
      empty.textContent = 'No matches. Try a shorter search.';
      this.list.append(empty);
      this.activeIndex = -1;
      this.search.removeAttribute('aria-activedescendant');
      return;
    }

    if (this.activeIndex >= this.filtered.length) this.activeIndex = 0;
    if (this.activeIndex < 0) this.activeIndex = 0;
    this.paintActive();
  }

  private paintActive(): void {
    const rows = this.list.querySelectorAll<HTMLElement>('[role="option"]');
    rows.forEach((row, i) => {
      const active = i === this.activeIndex;
      row.dataset.active = String(active);
      if (active) {
        this.search.setAttribute('aria-activedescendant', row.id);
        row.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
