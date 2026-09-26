import { expect, test } from '@playwright/test';
import { ADS_REQUEST, brandOf, brands, expectedSiteEnv } from '../lib/brands';
import { dismissConsent, fillRequired, HUMAN_DELAY_MS } from '../lib/forms';

test.describe('tracking contract', () => {
  test('head order: dataLayer init, then consent default, then GTM (when configured)', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const head = html.slice(0, html.indexOf('</head>'));
    const firstScript = head.indexOf('<script');
    const init = head.indexOf('window.dataLayer.push({"site_env"');
    const consent = head.indexOf("gtag('consent', 'default'");
    const gtm = head.indexOf('data-tracking="gtm"');

    expect(init, 'dataLayer init present').toBeGreaterThan(-1);
    expect(head.lastIndexOf('<script', init), 'dataLayer init is in the first script of <head>').toBe(firstScript);
    expect(consent, 'consent default after dataLayer init').toBeGreaterThan(init);
    if (gtm > -1) {
      expect(gtm, 'GTM snippet after the consent default').toBeGreaterThan(consent);
    } else {
      test.info().annotations.push({ type: 'note', description: 'PUBLIC_GTM_ID not set on this deployment: GTM not rendered' });
    }
    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage', 'wait_for_update']) {
      expect(head).toContain(`"${key}"`);
    }
    expect(head).toContain("gtag('set', 'url_passthrough', true)");
  });

  test('site_env matches the deployment', async ({ page }, testInfo) => {
    await page.goto('/');
    const first = await page.evaluate(() => (window as any).dataLayer[0]);
    expect(first).toEqual({ site_env: expectedSiteEnv, brand: brandOf(testInfo) });
  });

  test('click IDs reach the form without consent but are not stored', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(`${brand.formPath}?gclid=Test-GCLID_123&gbraid=GbrTest&utm_source=google&utm_medium=cpc&utm_campaign=demo`);
    const form = page.locator(`form[data-form-id="${brand.formId}"]`);
    await expect(form.locator('input[name="gclid"]')).toHaveValue('Test-GCLID_123');
    await expect(form.locator('input[name="gbraid"]')).toHaveValue('GbrTest');
    await expect(form.locator('input[name="utm_campaign"]')).toHaveValue('demo');
    expect(await page.evaluate(() => localStorage.getItem('platform_attribution'))).toBeNull();

    await page.goto(brand.formPath);
    await expect(form.locator('input[name="gclid"]')).toHaveValue('');
  });

  test('click IDs persist across pages only after ad_storage is granted', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(`/?gclid=Consented-GCLID&utm_source=google`);
    await dismissConsent(page, 'granted');
    const stored = await page.evaluate(() => localStorage.getItem('platform_attribution'));
    expect(stored).toContain('Consented-GCLID');

    await page.goto(brand.formPath);
    const form = page.locator(`form[data-form-id="${brand.formId}"]`);
    await expect(form.locator('input[name="gclid"]')).toHaveValue('Consented-GCLID');

    // Revoking consent clears what was stored.
    await page.locator('[data-consent-open]').first().click();
    await dismissConsent(page, 'denied');
    expect(await page.evaluate(() => localStorage.getItem('platform_attribution'))).toBeNull();
  });

  test('no Google Ads requests while browsing and converting', async ({ page }, testInfo) => {
    test.skip(expectedSiteEnv === 'production', 'This check is for previews');
    const brand = brands[brandOf(testInfo)];
    const adsRequests: string[] = [];
    page.on('request', (req) => {
      if (ADS_REQUEST.test(req.url())) adsRequests.push(req.url());
    });

    await page.goto(`/?gclid=Ads-Check&utm_source=google&utm_medium=cpc`);
    await dismissConsent(page, 'granted');
    await page.goto(`${brand.formPath}?gclid=Ads-Check`);
    const form = await fillRequired(page, brand.formId);
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();
    await expect(page.locator('[data-form-receipt]')).toBeVisible();
    await page.waitForLoadState('networkidle');

    expect(adsRequests, 'Google Ads requests seen on a preview').toEqual([]);
  });
});
