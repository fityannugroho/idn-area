import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    alias: {
      '@': './src',
      '@common': './common',
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
