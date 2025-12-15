import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// More info at: https://vitest.dev/config/
export default defineConfig({
  plugins: [svgr()],
  test: {
    name: 'unit',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/tests/setupTests.ts', './src/tests/mockSvg.tsx'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
