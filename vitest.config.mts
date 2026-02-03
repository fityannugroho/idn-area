import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['dist/**', 'node_modules/**', 'coverage/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        '**/*.module.ts', // Module files usually don't need testing
        '**/*.dto.ts',
        'src/main.ts', // Application bootstrap
        'prisma/**', // Database scripts
        '**/*.config.*',
        'test/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [swc.vite()],
});
