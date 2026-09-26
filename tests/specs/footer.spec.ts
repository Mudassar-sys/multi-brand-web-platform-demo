import { expect, test } from '@playwright/test';
import { brandOf, brandPages } from '../lib/brands';

test.describe('footer', () => {
  test('the copyright line reads cleanly on every page', async ({ page }, testInfo) => {
    for (const entry of brandPages(brandOf(testInfo))) {
      await page.goto(entry.path);
      const legal = page.locator('[data-footer-legal]');
      // "© 2026 Brand Name." then the demo brand sentence.
      await expect(legal, `${entry.path} copyright`).toHaveText(/^© \d{4} \S.*Demo brand: /);
      await expect(legal, `${entry.path} double period`).not.toHaveText(/\.\./);
      await expect(legal, `${entry.path} year glued to the name`).not.toHaveText(/\d{4}[^\s\d]/);
    }
  });
});
