import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0' },
  test: { include: ['tests/unit/**/*.test.js'], environment: 'node', testTimeout: 15000 },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        worldbox: 'worldbox.html',
        activitiesSandbox: 'activities-sandbox.html',
        reportsSandbox: 'reports-sandbox.html',
      },
    },
  },
});
