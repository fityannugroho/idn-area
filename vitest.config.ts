import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      '@': './src',
      '@common': './common',
    },
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@common': './common',
    },
  },
  plugins: [swc.vite()],
});
