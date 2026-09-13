import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for the Metro UI showcase.
 *
 * The showcase dev server is expected to be running at `baseURL` (default
 * http://localhost:5173). Tests are written to be resilient to the animated
 * components (tiles, app bar) that never reach a "stable" state — see the
 * helper functions in `e2e/helpers.ts`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});