import { expect, test } from '@playwright/test';
import { brandOf, brands, expectedSiteEnv } from '../lib/brands';
import { dataLayerEvents, dismissConsent, fillRequired, HUMAN_DELAY_MS } from '../lib/forms';

const target = expectedSiteEnv === 'production' ? 'live' : 'test';

test.describe('lead forms', () => {
  test('a real submission shows the demo receipt with the right destination', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(`${brand.formPath}?gclid=Receipt-GCLID&utm_source=google`);
    await dismissConsent(page);
    const form = await fillRequired(page, brand.formId);
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();

    const receipt = page.locator('[data-form-receipt]');
    await expect(receipt).toBeVisible();
    await expect(receipt).toHaveAttribute('data-receipt-provider', brand.provider);
    await expect(receipt).toHaveAttribute('data-receipt-target', target);
    await expect(receipt).toHaveAttribute('data-receipt-environment', expectedSiteEnv);
    await expect(receipt.locator('[data-receipt-row="destination"]')).toContainText(brand.destination[target]);
    if (target === 'test') await expect(receipt.locator('[data-receipt-row="tags"]')).toContainText('preview-test');
    await expect(receipt.locator('[data-receipt-row="click-ids"]')).toContainText('gclid=Receipt-GCLID');
    await expect(receipt.locator('[data-receipt-request]')).toContainText('[redacted]');

    // The lead event is pushed only after the server confirmed the submission.
    expect(await dataLayerEvents(page)).toContain('generate_lead');
  });

  test('a filled honeypot is rejected and no lead event fires', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(brand.formPath);
    await dismissConsent(page);
    const form = await fillRequired(page, brand.formId);
    await form.locator('input[name="website"]').evaluate((el: HTMLInputElement) => (el.value = 'https://spam.example'));
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();

    await expect(form).toHaveAttribute('data-last-result', 'honeypot');
    await expect(form.locator('[data-form-status]')).toContainText('could not accept');
    expect(await dataLayerEvents(page)).not.toContain('generate_lead');
  });

  test('a too-fast submission is rejected', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(brand.formPath);
    await dismissConsent(page);
    const form = await fillRequired(page, brand.formId);
    await form.locator('[type="submit"]').click();

    await expect(form).toHaveAttribute('data-last-result', 'too_fast');
    await expect(form.locator('[data-form-status]')).toContainText('quicker than a person');
  });

  test('the endpoint validates, guards and routes by environment', async ({ request }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    const base = {
      form_id: brand.formId,
      page_path: brand.formPath,
      first_name: 'Api',
      email: 'api-check@example.com',
      website: '',
      started_at: Date.now() - 10_000,
    };
    const ok = await request.post('/api/lead', { data: base });
    expect(ok.status()).toBe(200);
    expect((await ok.json()).receipt).toMatchObject({ provider: brand.provider, target, mode: 'dry-run' });

    const honeypot = await request.post('/api/lead', { data: { ...base, website: 'x' } });
    expect(honeypot.status()).toBe(400);
    expect((await honeypot.json()).code).toBe('honeypot');

    const fast = await request.post('/api/lead', { data: { ...base, started_at: Date.now() } });
    expect(fast.status()).toBe(400);
    expect((await fast.json()).code).toBe('too_fast');

    const invalid = await request.post('/api/lead', { data: { ...base, email: 'nope' } });
    expect(invalid.status()).toBe(422);
    expect((await invalid.json()).fieldErrors.email).toBeTruthy();
  });
});
