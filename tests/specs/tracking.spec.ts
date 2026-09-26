import { expect, test } from '@playwright/test';
import { ADS_REQUEST, brandOf, brands, expectedSiteEnv } from '../lib/brands';
import { dataLayerEvents, dismissConsent, fillRequired, HUMAN_DELAY_MS } from '../lib/forms';
import { expectedTags, GA4_HIT, GOOGLE_TAG_REQUEST, renderedGtm } from '../lib/google-tags';

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

  test('GTM and GA4 load once a container is set or expected', async ({ page, request }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    const expected = expectedTags(brandOf(testInfo));
    const gtm = renderedGtm(await (await request.get('/')).text());
    test.skip(!gtm && !expected.gtmId, 'No GTM snippet on this deployment and no container expected in tests/tracking-expectations.json');

    // Strict from here: every missing piece fails the check.
    expect(gtm, 'GTM snippet rendered in <head>').not.toBeNull();
    expect(gtm!.id, 'container ID in the GTM snippet').toMatch(/^GTM-[A-Z0-9]+$/);
    if (expected.gtmId) expect(gtm!.id, 'container ID matches the expected one').toBe(expected.gtmId);

    const requests: string[] = [];
    page.on('request', (req) => {
      if (GOOGLE_TAG_REQUEST.test(req.url())) requests.push(req.url());
    });
    // Wait for the request, not the response: Chromium can block a failed script response
    // (net::ERR_BLOCKED_BY_ORB for a 404), and then no response event ever fires.
    const gtmRequest = page.waitForRequest((req) => req.url().startsWith(gtm!.scriptUrl));
    await page.goto('/');
    const gtmScript = await gtmRequest;
    const gtmResponse = await gtmScript.response();
    expect(
      gtmResponse?.status(),
      `${gtm!.scriptUrl} status (request failure: ${gtmScript.failure()?.errorText ?? 'none'})`,
    ).toBe(200);

    expect(expected.ga4MeasurementId, 'GA4 Measurement ID set in tests/tracking-expectations.json').toMatch(/^G-[A-Z0-9]+$/);
    await dismissConsent(page, 'granted');
    await page.goto(brand.formPath);
    // Observed live: GA4 hits carry the Measurement ID in their query (docs/SOURCES.md).
    await expect
      .poll(() => requests.filter((url) => GA4_HIT.test(url) && url.includes(expected.ga4MeasurementId)).length, {
        message: `GA4 request to *.google-analytics.com carrying ${expected.ga4MeasurementId} after Accept all`,
        timeout: 15_000,
      })
      .toBeGreaterThan(0);
  });

  test('no Google Ads conversion requests while browsing and converting', async ({ page }, testInfo) => {
    test.skip(expectedSiteEnv === 'production', 'This check is for previews');
    const brand = brands[brandOf(testInfo)];
    const { adsConversionId } = expectedTags(brandOf(testInfo));
    const adsRequests: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (ADS_REQUEST.test(url) || (adsConversionId && url.includes(adsConversionId))) adsRequests.push(url);
    });

    await page.goto(`/?gclid=Ads-Check&utm_source=google&utm_medium=cpc`);
    await dismissConsent(page, 'granted');
    await page.goto(`${brand.formPath}?gclid=Ads-Check`);
    const form = await fillRequired(page, brand.formId);
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();
    await expect(page.locator('[data-form-receipt]')).toBeVisible();
    expect(await dataLayerEvents(page), 'the lead event fired').toContain('generate_lead');
    await page.waitForLoadState('networkidle');
    // On production the Ads tag sent its hits within 3 s of generate_lead (proof/13-tracking-network.txt).
    await page.waitForTimeout(5_000);

    expect(adsRequests, 'Google Ads conversion requests seen on a preview').toEqual([]);
  });
});
