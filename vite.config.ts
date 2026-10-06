import { defineConfig } from 'vite';

// GitHub Pages serves this project from https://jtbartee.github.io/session-zero/
// so production assets must resolve against the /session-zero/ sub-path.
// Local dev and `vite preview` keep the root base for convenience.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/session-zero/' : '/',
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssMinify: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
}));
