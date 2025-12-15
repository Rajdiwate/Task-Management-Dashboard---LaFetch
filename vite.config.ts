/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import istanbul from 'vite-plugin-istanbul';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'cypress/', 'test/'],
      extension: ['.js', '.ts', '.vue', '.jsx', '.tsx'],
      requireEnv: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/abstract/mixins";
          @use "@/styles/abstract/functions";
          @use "@/styles/base/base";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
