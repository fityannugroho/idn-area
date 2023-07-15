/* eslint-disable @typescript-eslint/ban-ts-comment */
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      '@': './src',
    },
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  plugins: [
    // @ts-ignore
    swc.vite(),
  ],
});
