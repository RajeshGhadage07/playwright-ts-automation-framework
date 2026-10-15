import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { AUTH_FILE } from './tests/utils/constants';

// Environment-based configuration: values come from .env, with safe defaults.
const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

export default defineConfig({
  fullyParallel: true, // run tests in parallel
  forbidOnly: !!process.env.CI,
  retries: 1, // retry a failed test once to handle flaky failures
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: UI_BASE_URL,
    testIdAttribute: 'data-test', // SauceDemo uses data-test attributes
    trace: 'retain-on-failure', // Trace Viewer for failed tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1) Logs in once and saves the session, so UI tests skip the login step.
    { name: 'setup', testDir: './tests/setup', testMatch: /.*\.setup\.ts/ },

    // 2) UI tests on three browsers (cross-browser testing).
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },

    // 3) API tests (no browser needed).
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: { Accept: 'application/json', 'Content-Type': 'application/json' },
      },
    },
  ],
});
