import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
  test: { include: ['tests/unit/**/*.test.js'], environment: 'node' },
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
