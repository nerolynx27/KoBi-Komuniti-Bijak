import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  outputDir: 'artifacts/test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'artifacts/playwright-report' }]],
  use: { baseURL: 'http://127.0.0.1:5173', viewport: { width: 390, height: 844 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --port 5173 --strictPort', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
});
