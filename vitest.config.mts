import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    globals: true, // describe, it, expect 등을 import 없이 사용
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});