/**
 * A segmented control built from real radio inputs, so keyboard navigation,
 * form semantics and screen-reader grouping all come for free.
 */

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Optional longer description announced to screen readers. */
  description?: string;
}

export interface SegmentedConfig<T extends string> {
  name: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

export class Segmented<T extends string> {
  private readonly inputs: HTMLInputElement[] = [];
  readonly root: HTMLDivElement;

  constructor(mount: HTMLElement, config: SegmentedConfig<T>) {
    this.root = document.createElement('div');
    this.root.className = 'segmented';

    for (const option of config.options) {
      const label = document.createElement('label');
      label.className = 'segmented__item';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = config.name;
      input.value = option.value;
      input.checked = option.value === config.value;
      if (option.description) input.setAttribute('aria-label', `${option.label}. ${option.description}`);
      input.addEventListener('change', () => {
        if (input.checked) config.onChange(option.value);
      });

      const text = document.createElement('span');
      text.textContent = option.label;

      label.append(input, text);
      this.root.append(label);
      this.inputs.push(input);
    }
    mount.append(this.root);
  }

  setValue(value: T): void {
    for (const input of this.inputs) input.checked = input.value === value;
  }
}
