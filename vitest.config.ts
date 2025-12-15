import { defineConfig } from 'vitest/config';
import unit from './vitest.config.unit';

export default defineConfig({
  test: {
    projects: [{ ...unit }],
    coverage: {
      provider: 'v8', // Use V8 for coverage
      reporter: ['text', 'json-summary', 'html', 'lcov'], // output types
      reportsDirectory: './coverage/unit', // where to store reports
      thresholds: {
        lines: 90,
        functions: 85, // TEMP: set lower for fast dev, raise to 90 before release
        branches: 90, // TEMP: set lower for fast dev, raise to 90 before release
        statements: 90,
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/__mocks__/**',
        '**/__tests__/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/routes/**',
        '**/src/cache/**',
        'src/assets/**',
        'src/tests/**',
        'src/theme/**',
        'commitlint.config.*',
        'stylelint.config.*',
        'eslint.config.*',
        'vite.config.*',
        'vitest.config.*',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/demo.ts',
        '**/*.module.scss',
        '**/index.ts',
        '**/*.types.ts',
      ],
    },
  },
});
