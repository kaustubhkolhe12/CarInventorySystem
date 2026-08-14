import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    setupFiles: [],
    clearMocks: true,
    threads: false,
    globals: true,
    env: {
      NODE_ENV: 'test',
    },
  },
});
