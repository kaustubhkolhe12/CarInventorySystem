import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    threads: false,
    globals: true,
    env: {
      NODE_ENV: 'test',
    },
  },
});
