import { redirectExpectations } from '@platform/config/redirects';
import { expect, test } from '@playwright/test';
import { brandOf, brandPages, redirectsCsv } from '../lib/brands';

test.describe('migration parity', () => {
  test('every legacy path returns a 301 to its new path', async ({ request }, testInfo) => {
    const pairs = redirectExpectations(redirectsCsv(brandOf(testInfo)));
    expect(pairs.length).toBeGreaterThan(0);
    for (const { from, to } of pairs) {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status(), `${from} status`).toBe(301);
      const location = new URL(response.headers()['location'], 'https://placeholder.invalid');
      expect(location.pathname, `${from} location`).toBe(to);
    }
  });

  test('every page has a title, description, canonical and exactly one H1', async ({ page }, testInfo) => {
    for (const entry of brandPages(brandOf(testInfo))) {
      const response = await page.goto(entry.path);
      expect(response?.status(), `${entry.path} status`).toBe(200);
      await expect(page, `${entry.path} title`).toHaveTitle(/\S/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0, `${entry.path} description`).toBeGreaterThanOrEqual(50);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical, `${entry.path} canonical`).toMatch(/^https:\/\//);
      expect(new URL(canonical!).pathname, `${entry.path} canonical path`).toBe(entry.path);
      await expect(page.locator('h1'), `${entry.path} H1 count`).toHaveCount(1);
      if (entry.noindex) {
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      }
    }
  });

  test('a sitemap lists every indexable page and no noindex page', async ({ request }, testInfo) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.status()).toBe(200);
    const sitemapUrl = (await index.text()).match(/<loc>([^<]+)<\/loc>/)?.[1];
    expect(sitemapUrl).toBeTruthy();
    const sitemap = await (await request.get(new URL(sitemapUrl!).pathname)).text();
    const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
    for (const entry of brandPages(brandOf(testInfo))) {
      if (entry.noindex) expect(listed, entry.path).not.toContain(entry.path);
      else expect(listed, entry.path).toContain(entry.path);
    }
  });

  test('trailing slashes: the slash URL 308-redirects to the no-slash URL', async ({ request }) => {
    // Recorded behaviour on Vercel with trailingSlash: 'never' (see docs/ARCHITECTURE.md).
    const slash = await request.get('/contact/', { maxRedirects: 0 });
    expect(slash.status()).toBe(308);
    expect(new URL(slash.headers()['location'], 'https://placeholder.invalid').pathname).toBe('/contact');
    const clean = await request.get('/contact', { maxRedirects: 0 });
    expect(clean.status()).toBe(200);
  });
});
