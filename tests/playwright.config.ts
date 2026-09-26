import { defineConfig } from '@playwright/test';

/**
 * One project per brand. CI runs a single brand against the deployment
 * that just finished:
 *   BASE_URL=https://<preview> EXPECTED_SITE_ENV=preview pnpm e2e --project=kestrel
 * Locally, point BASE_URL at a dev server or any deployment.
 */
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: './specs',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Protected previews: CI sends the Protection Bypass for Automation secret.
    extraHTTPHeaders: bypass
      ? { 'x-vercel-protection-bypass': bypass, 'x-vercel-set-bypass-cookie': 'true' }
      : undefined,
  },
  projects: [
    { name: 'kestrel', use: { browserName: 'chromium' } },
    { name: 'paintline', use: { browserName: 'chromium' } },
  ],
});
