import { defineConfig } from '@playwright/test';

const port = process.env.PLAYWRIGHT_PORT || '5177';
const url = `http://127.0.0.1:${port}`;

export default defineConfig({
  timeout: 60000,
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  outputDir: 'artifacts/test-results',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'artifacts/playwright-report' }]],
  use: { baseURL: url, viewport: { width: 390, height: 844 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev:sdp', url, reuseExistingServer: true },
});
