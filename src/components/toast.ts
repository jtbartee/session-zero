/** Transient confirmations. Announced politely, never trapping focus. */

const DURATION = 2400;

export function toast(message: string): void {
  const stack = document.getElementById('toasts');
  if (!stack) return;

  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  stack.append(el);

  window.setTimeout(() => {
    el.classList.add('toast--leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    // Belt and braces: if animations are disabled the event may not fire.
    window.setTimeout(() => el.remove(), 400);
  }, DURATION);
}
