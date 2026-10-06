/**
 * End-to-end UI checks against the production build.
 *
 * Playwright is not installed in this environment, so these drive a cached
 * Chrome for Testing over CDP. Assertions are made against rendered pixels
 * and computed styles where possible, not only DOM presence — a node can
 * exist and still be invisible.
 */
import { serve } from './serve.mjs';
import { launch } from './driver.mjs';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../out/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const results = [];
function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

const { server, port, base } = await serve();
const page = await launch({ port: 9333, width: 1440, height: 1000 });
const URL_BASE = `http://127.0.0.1:${port}${base}/`;

try {
  await page.goto(URL_BASE);

  // --- loads cleanly ------------------------------------------------
  const title = await page.eval('document.title');
  check('page loads with correct title', title.startsWith('Session Zero'), title);
  check('no uncaught exceptions on load', page.exceptions().length === 0, page.exceptions().join(' | '));

  const cssApplied = await page.eval(
    `getComputedStyle(document.body).backgroundColor`);
  check('stylesheet applied (dark ground)', cssApplied.includes('13, 12, 11'), cssApplied);

  // --- empty state --------------------------------------------------
  const emptyVisible = await page.eval(
    `(() => { const e = document.getElementById('empty-state'); const r = e.getBoundingClientRect();
      return r.width > 100 && r.height > 50; })()`);
  check('empty state is visible before generating', emptyVisible);

  // --- generate with defaults (Not Specified) -----------------------
  await page.click('#generate');
  await new Promise((r) => setTimeout(r, 250));
  let cards = await page.eval(`document.querySelectorAll('#card-list .card').length`);
  check('default generate produces 1 card', cards === 1, `got ${cards}`);
  const emptyHiddenNow = await page.eval(
    `(() => { const e = document.getElementById('empty-state');
      return e.hidden && getComputedStyle(e).display === 'none'; })()`);
  check('empty state hides (attribute AND computed display)', emptyHiddenNow);

  const firstName = await page.eval(`document.querySelector('.card__name')?.firstChild?.textContent?.trim()`);
  check('card shows a name', typeof firstName === 'string' && firstName.length > 2, firstName);
  const noSpeciesTag = await page.eval(`document.querySelectorAll('.tag--species').length === 0`);
  check('Not Specified attaches no species tag', noSpeciesTag);

  // --- batch sizes ---------------------------------------------------
  for (const n of [5, 10, 20]) {
    await page.eval(`(() => {
      const input = [...document.querySelectorAll('input[name="count"]')].find(i => i.value === '${n}');
      input.click();
    })()`);
    await page.click('#generate');
    await new Promise((r) => setTimeout(r, 280));
    cards = await page.eval(`document.querySelectorAll('#card-list .card').length`);
    check(`batch of ${n} renders ${n} cards`, cards === n, `got ${cards}`);
    const unique = await page.eval(
      `new Set([...document.querySelectorAll('.card__name')].map(e => e.firstChild.textContent.trim())).size`);
    check(`batch of ${n} has no duplicate names`, unique === n, `${unique} unique of ${n}`);
  }

  // --- species selection via the combobox (keyboard) -----------------
  await page.click('#species-button');
  await new Promise((r) => setTimeout(r, 150));
  const popupOpen = await page.eval(
    `document.querySelectorAll('.combobox__popup:not([hidden])').length === 1`);
  check('species combobox opens (and only one popup is open)', popupOpen);
  await page.type('dwarf');
  await new Promise((r) => setTimeout(r, 200));
  const searchValue = await page.eval(`document.querySelector('.combobox__search input').value`);
  // Scope to the *open* popup: both comboboxes keep their options in the DOM.
  const filtered = await page.eval(
    `[...document.querySelectorAll('.combobox__popup:not([hidden]) .combobox__option')].map(e => e.textContent)`);
  check('combobox filters on search', filtered.length === 1 && filtered[0].startsWith('Dwarf'),
    `query "${searchValue}" -> ${filtered.length} options: ${filtered.slice(0, 4).join(', ')}`);
  await page.key('Enter', { keyCode: 13 });
  await new Promise((r) => setTimeout(r, 200));
  const chosen = await page.eval(`document.querySelector('#species-button .combobox__value').textContent`);
  check('combobox selects with Enter', chosen.toLowerCase().includes('dwarf'), chosen);

  await page.click('#generate');
  await new Promise((r) => setTimeout(r, 300));
  const speciesTags = await page.eval(
    `[...document.querySelectorAll('.tag--species')].map(e => e.textContent)`);
  check('species selection tags every card', speciesTags.length === 20 && speciesTags.every(t => t === 'Dwarf'),
    `${speciesTags.length} tags, first "${speciesTags[0]}"`);

  const dwarfNames = await page.eval(
    `[...document.querySelectorAll('.card__name')].map(e => e.firstChild.textContent.trim())`);
  check('20 dwarf names are all distinct', new Set(dwarfNames).size === 20, `${new Set(dwarfNames).size}/20`);
  console.log('      sample:', dwarfNames.slice(0, 6).join(' | '));

  // --- background + hook ---------------------------------------------
  await page.click('#background-button');
  await new Promise((r) => setTimeout(r, 150));
  await page.type('sage');
  await new Promise((r) => setTimeout(r, 180));
  await page.key('Enter', { keyCode: 13 });
  await page.click('#include-hook');
  await page.click('#generate');
  await new Promise((r) => setTimeout(r, 320));
  const hooks = await page.eval(`[...document.querySelectorAll('.card__hook')].map(e => e.textContent)`);
  check('hooks render for every card', hooks.length === 20, `${hooks.length} hooks`);
  check('hooks are distinct sentences', new Set(hooks).size >= 18, `${new Set(hooks).size} unique`);
  check('hooks end in a full stop', hooks.every(h => /[.!?]$/.test(h.trim())));
  const bgTags = await page.eval(`[...document.querySelectorAll('.tag--background')].map(e => e.textContent)`);
  check('background tags every card', bgTags.length === 20 && bgTags[0] === 'Sage', bgTags[0]);
  console.log('      hook:', hooks[0]);

  await page.screenshot(`${OUT}desktop-dwarf-sage.png`);

  // --- reroll keeps siblings -----------------------------------------
  const before = await page.eval(
    `[...document.querySelectorAll('.card__name')].map(e => e.firstChild.textContent.trim())`);
  await page.eval(`document.querySelectorAll('.card')[2].querySelectorAll('.card-action')[2].click()`);
  await new Promise((r) => setTimeout(r, 300));
  const after = await page.eval(
    `[...document.querySelectorAll('.card__name')].map(e => e.firstChild.textContent.trim())`);
  const changedIdx = before.map((n, i) => (n !== after[i] ? i : -1)).filter((i) => i >= 0);
  check('reroll changes exactly one card', changedIdx.length === 1 && changedIdx[0] === 2,
    `changed indices ${JSON.stringify(changedIdx)}`);
  check('reroll keeps the batch count', after.length === 20);

  // --- favourites ------------------------------------------------------
  await page.eval(`document.querySelectorAll('.card')[0].querySelectorAll('.card-action')[1].click()`);
  await new Promise((r) => setTimeout(r, 200));
  const favCount = await page.eval(`document.getElementById('favourites-count').textContent`);
  check('favouriting updates the counter', favCount === '1', favCount);
  const pressed = await page.eval(
    `document.querySelectorAll('.card')[0].querySelectorAll('.card-action')[1].getAttribute('aria-pressed')`);
  check('favourite button reports pressed state', pressed === 'true', pressed);

  const stored = await page.eval(`localStorage.getItem('session-zero:favourites') !== null`);
  check('favourite persists to localStorage', stored);

  await page.click('#favourites-toggle');
  await new Promise((r) => setTimeout(r, 250));
  const drawerOpen = await page.eval(
    `(() => { const d = document.getElementById('favourites-panel');
      return !d.hidden && d.getBoundingClientRect().width > 100; })()`);
  check('favourites drawer opens', drawerOpen);
  const favItems = await page.eval(`document.querySelectorAll('.fav').length`);
  check('drawer lists the saved character', favItems === 1, `${favItems} items`);
  await page.screenshot(`${OUT}favourites.png`);
  await page.key('Escape', { keyCode: 27 });
  await new Promise((r) => setTimeout(r, 250));
  const drawerClosed = await page.eval(`document.getElementById('favourites-panel').hidden`);
  check('Escape closes the drawer', drawerClosed);

  // --- persistence across reload ---------------------------------------
  await page.goto(URL_BASE);
  const favAfterReload = await page.eval(`document.getElementById('favourites-count').textContent`);
  check('favourites survive a reload', favAfterReload === '1', favAfterReload);

  // --- recent-name history is written ------------------------------------
  const historyWritten = await page.eval(
    `(() => { const raw = localStorage.getItem('session-zero:recent');
      if (!raw) return 0; return JSON.parse(raw).data.length; })()`);
  check('recent-name history persists', historyWritten > 40, `${historyWritten} names remembered`);

  // --- style and complexity extremes --------------------------------------
  await page.eval(`(() => {
    [...document.querySelectorAll('input[name="style"]')].find(i => i.value === 'wild').click();
    const r = document.getElementById('complexity');
    r.value = '5'; r.dispatchEvent(new Event('input', { bubbles: true }));
    [...document.querySelectorAll('input[name="count"]')].find(i => i.value === '20').click();
  })()`);
  await page.click('#species-button');
  await new Promise((r) => setTimeout(r, 150));
  await page.type('tabaxi');
  await new Promise((r) => setTimeout(r, 180));
  await page.key('Enter', { keyCode: 13 });
  await page.click('#generate');
  await new Promise((r) => setTimeout(r, 350));
  const tabaxi = await page.eval(
    `[...document.querySelectorAll('.card__name')].map(e => e.firstChild.textContent.trim())`);
  check('wild + elaborate tabaxi generates 20', tabaxi.length === 20);
  check('tabaxi names are descriptive phrases', tabaxi.filter(n => n.split(' ').length >= 2).length >= 18,
    `${tabaxi.filter(n => n.split(' ').length >= 2).length}/20 multiword`);
  console.log('      sample:', tabaxi.slice(0, 4).join(' | '));
  const shortNames = await page.eval(`document.querySelectorAll('.card__short').length`);
  check('tabaxi cards show the everyday short name', shortNames >= 15, `${shortNames}/20`);

  await page.screenshot(`${OUT}desktop-tabaxi-wild.png`);

  // --- no horizontal overflow at any width -------------------------------
  for (const [w, h, label] of [[1440, 1000, 'desktop'], [1024, 900, 'laptop'], [768, 1024, 'tablet'], [390, 844, 'phone'], [320, 720, 'small-phone']]) {
    await page.setViewport(w, h);
    await new Promise((r) => setTimeout(r, 220));
    const overflow = await page.eval(
      `Math.max(document.documentElement.scrollWidth - document.documentElement.clientWidth, 0)`);
    check(`no horizontal overflow at ${w}px (${label})`, overflow === 0, `${overflow}px over`);
    if (label === 'phone' || label === 'desktop') {
      await page.screenshot(`${OUT}${label}-layout.png`, { fullPage: label === 'phone' });
    }
  }
  await page.setViewport(1440, 1000);

  // --- keyboard-only walkthrough -----------------------------------------
  await page.goto(URL_BASE);
  const tabbables = await page.eval(`(() => {
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(sel)].filter(el => !el.closest('[hidden]') && el.offsetParent !== null).length;
  })()`);
  check('page exposes a keyboard tab order', tabbables > 10, `${tabbables} tabbable elements`);

  // Walk the tab order with real key presses so :focus-visible engages, and
  // confirm each stop actually paints a ring.
  await page.eval(`document.body.focus(); window.scrollTo(0,0);`);
  const ringReport = [];
  for (let i = 0; i < 12; i++) {
    await page.tab();
    const stop = await page.eval(`(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const ring = s.boxShadow !== 'none' || s.outlineStyle !== 'none';
      return { tag: el.tagName.toLowerCase(), id: el.id || el.className, ring };
    })()`);
    if (stop) ringReport.push(stop);
  }
  const ringless = ringReport.filter((s) => !s.ring);
  check('every keyboard stop paints a focus ring', ringReport.length > 6 && ringless.length === 0,
    `${ringReport.length} stops, ${ringless.length} without a ring${ringless.length ? `: ${ringless.map(s => s.id).join(', ')}` : ''}`);

  // --- accessibility shape -------------------------------------------------
  const a11y = await page.eval(`(() => {
    const out = {};
    out.liveRegion = !!document.querySelector('[role="status"][aria-live="polite"]');
    out.listboxRole = !!document.querySelector('[role="listbox"]');
    out.comboLabelled = !!document.getElementById('species-button')?.getAttribute('aria-labelledby');
    out.unlabelledButtons = [...document.querySelectorAll('button')]
      .filter(b => !b.textContent.trim() && !b.getAttribute('aria-label')).length;
    out.imagesNeedAlt = [...document.querySelectorAll('img')].filter(i => !i.alt).length;
    out.svgsHidden = [...document.querySelectorAll('svg')]
      .filter(s => s.getAttribute('aria-hidden') !== 'true' && !s.getAttribute('aria-label')).length;
    out.langSet = document.documentElement.lang;
    out.skipLink = !!document.querySelector('.skip-link');
    return out;
  })()`);
  check('status live region present', a11y.liveRegion);
  check('listbox role present for combobox', a11y.listboxRole);
  check('combobox trigger is labelled', a11y.comboLabelled);
  check('every button has an accessible name', a11y.unlabelledButtons === 0, `${a11y.unlabelledButtons} unnamed`);
  check('decorative svgs are hidden from AT', a11y.svgsHidden === 0, `${a11y.svgsHidden} exposed`);
  check('document language is set', a11y.langSet === 'en', a11y.langSet);
  check('skip link present', a11y.skipLink);

  // --- storage failure degrades gracefully ---------------------------------
  await page.goto(URL_BASE);
  const survivesNoStorage = await page.eval(`(() => {
    try {
      const proto = Object.getPrototypeOf(window.localStorage);
      const original = proto.setItem;
      proto.setItem = () => { throw new Error('QuotaExceededError'); };
      document.getElementById('generate').click();
      const ok = document.querySelectorAll('#card-list .card').length > 0;
      proto.setItem = original;
      return ok;
    } catch (e) { return 'threw: ' + e.message; }
  })()`);
  check('generation still works when localStorage throws', survivesNoStorage === true, String(survivesNoStorage));

  // --- reduced motion ------------------------------------------------------
  await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page.goto(URL_BASE);
  await page.click('#generate');
  await new Promise((r) => setTimeout(r, 200));
  const animDur = await page.eval(
    `getComputedStyle(document.querySelector('.card')).animationDuration`);
  check('reduced motion collapses card animation', parseFloat(animDur) < 0.01, animDur);
  await page.send('Emulation.setEmulatedMedia', { features: [] });

  // --- console hygiene -------------------------------------------------------
  const errors = page.consoleErrors().filter((e) => !e.includes('favicon'));
  check('no console errors or warnings', errors.length === 0, errors.slice(0, 3).join(' | '));
  check('no uncaught exceptions during the whole run', page.exceptions().length === 0,
    page.exceptions().slice(0, 2).join(' | '));
} finally {
  page.close();
  server.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('FAILED:');
  for (const f of failed) console.log(`  - ${f.name}${f.detail ? ` (${f.detail})` : ''}`);
  process.exit(1);
}
