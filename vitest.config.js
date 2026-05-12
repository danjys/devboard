import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',           // reducer tests don't need a DOM
    include:     ['src/**/*.test.{js,jsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      include:  ['src/**/*.{js,jsx}'],
      exclude:  ['src/main/**'],   // Electron main process excluded from coverage
    },
  },
});
