/**
 * A tiny CDP driver. Playwright is not installed here, so this talks to a
 * cached Chromium directly over the DevTools protocol using node's global
 * WebSocket. Enough to click, type, screenshot and read the DOM.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.SZ_CHROME
  ?? `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

export async function launch({ port = 9333, width = 1440, height = 1000 } = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'sz-chrome-'));
  const child = spawn(CHROME, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--headless=new',
    `--window-size=${width},${height}`,
    '--no-first-run', '--no-default-browser-check', '--disable-gpu',
    '--hide-scrollbars', '--force-device-scale-factor=2',
    'about:blank',
  ], { stdio: 'ignore' });

  // Wait for the debugger to answer.
  let target = null;
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      target = list.find((t) => t.type === 'page');
      if (target) break;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 120));
  }
  if (!target) {
    child.kill();
    throw new Error('Chromium did not expose a page target');
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  const events = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id !== undefined) {
      const entry = pending.get(msg.id);
      if (!entry) return;
      pending.delete(msg.id);
      if (msg.error) entry.reject(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
      else entry.resolve(msg.result);
    } else {
      events.push(msg);
    }
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 2, mobile: false,
  });

  const api = {
    send,
    events,
    consoleErrors() {
      return events
        .filter((e) => e.method === 'Log.entryAdded' && ['error', 'warning'].includes(e.params.entry.level))
        .map((e) => `${e.params.entry.level}: ${e.params.entry.text}`);
    },
    exceptions() {
      return events
        .filter((e) => e.method === 'Runtime.exceptionThrown')
        .map((e) => e.params.exceptionDetails.exception?.description ?? e.params.exceptionDetails.text);
    },
    async goto(url) {
      await send('Page.navigate', { url });
      for (let i = 0; i < 200; i++) {
        const { result } = await send('Runtime.evaluate', { expression: 'document.readyState' });
        if (result.value === 'complete') break;
        await new Promise((r) => setTimeout(r, 60));
      }
      await new Promise((r) => setTimeout(r, 250));
    },
    async eval(expression) {
      const { result, exceptionDetails } = await send('Runtime.evaluate', {
        expression, returnByValue: true, awaitPromise: true,
      });
      if (exceptionDetails) {
        throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
      }
      return result.value;
    },
    async setViewport(w, h) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: w < 600 });
      await new Promise((r) => setTimeout(r, 180));
    },
    async screenshot(path, { fullPage = false } = {}) {
      mkdirSync(join(path, '..'), { recursive: true });
      const params = { format: 'png' };
      if (fullPage) {
        const { cssContentSize } = await send('Page.getLayoutMetrics');
        params.clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 };
        params.captureBeyondViewport = true;
      }
      const { data } = await send('Page.captureScreenshot', params);
      writeFileSync(path, Buffer.from(data, 'base64'));
      return path;
    },
    async click(selector) {
      const box = await api.eval(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return null;
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      })()`);
      if (!box) throw new Error(`click: no element for ${selector}`);
      for (const type of ['mousePressed', 'mouseReleased']) {
        await send('Input.dispatchMouseEvent', {
          type, x: box.x, y: box.y, button: 'left', clickCount: 1,
        });
      }
      await new Promise((r) => setTimeout(r, 140));
    },
    async key(key, { code, keyCode, text } = {}) {
      const base = { key, code: code ?? key, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
      await send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', text, ...base });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
      await new Promise((r) => setTimeout(r, 90));
    },
    async type(text) {
      // insertText is the reliable path; synthesised keyDown events with a
      // `text` field drop characters when a listener re-renders on input.
      await send('Input.insertText', { text });
      await new Promise((r) => setTimeout(r, 160));
    },
    /** Move focus with a real Tab press so :focus-visible actually engages. */
    async tab(times = 1) {
      for (let i = 0; i < times; i++) {
        await send('Input.dispatchKeyEvent', {
          type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9,
        });
        await send('Input.dispatchKeyEvent', {
          type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9,
        });
        await new Promise((r) => setTimeout(r, 60));
      }
    },
    close() {
      try { ws.close(); } catch { /* ignore */ }
      child.kill();
    },
  };
  return api;
}
