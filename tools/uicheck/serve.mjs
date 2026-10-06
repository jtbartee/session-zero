/**
 * Static file server for the production build, used by the UI checks.
 * Serves under /session-zero/ so the GitHub Pages base path is exercised
 * exactly as it will be in production.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PORT = Number(process.env.SZ_PORT ?? 8747);
const ROOT = new URL('../../dist/', import.meta.url).pathname;
const BASE = '/session-zero';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json',
};

export function serve() {
  const server = createServer(async (req, res) => {
    let path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    if (path.startsWith(BASE)) path = path.slice(BASE.length) || '/';
    if (path === '/') path = '/index.html';
    const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
        // Identify this server so a stray process on the port is obvious.
        'X-Served-By': 'session-zero-uicheck',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
    }
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve({ server, port: PORT, base: BASE })));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  serve().then(({ port }) => console.log(`serving dist at http://127.0.0.1:${port}/session-zero/`));
}
