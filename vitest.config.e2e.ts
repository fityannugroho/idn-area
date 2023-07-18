/* eslint-disable @typescript-eslint/ban-ts-comment */
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    alias: {
      '@': './src',
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
