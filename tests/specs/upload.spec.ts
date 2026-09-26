import { expect, test, type Page } from '@playwright/test';
import { brandOf, brands, expectedSiteEnv } from '../lib/brands';
import { dismissConsent, fillRequired, HUMAN_DELAY_MS } from '../lib/forms';

const MB = 1024 * 1024;

/** A valid-looking PDF of an exact size (header, padding, trailer). */
function pdfOfSize(bytes: number): Buffer {
  const head = Buffer.from('%PDF-1.4\n% upload size test\n');
  const tail = Buffer.from('\n%%EOF\n');
  return Buffer.concat([head, Buffer.alloc(bytes - head.length - tail.length, 0x20), tail]);
}

async function uploadEnabled(page: Page) {
  return !(await page.locator('input[name="attachment"]').isDisabled());
}

test.describe('10 MB file upload (Vercel Blob client upload)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!brands[brandOf(testInfo)].uploads, 'This brand has no upload field');
    test.skip(expectedSiteEnv === 'production', 'Uploads are only exercised on previews');
  });

  test('a 9 MB PDF uploads and its Blob URL lands in the receipt', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(brand.formPath);
    await dismissConsent(page);
    test.skip(!(await uploadEnabled(page)), 'Uploads are switched off on this deployment (HUMAN STEP)');
    const form = await fillRequired(page, brand.formId);
    await form.locator('input[name="attachment"]').setInputFiles({
      name: 'wall-photo-9mb.pdf',
      mimeType: 'application/pdf',
      buffer: pdfOfSize(9 * MB),
    });
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();
    const receipt = page.locator('[data-form-receipt]');
    await expect(receipt).toBeVisible({ timeout: 60_000 });
    await expect(receipt.locator('[data-receipt-row="attachment"]')).toContainText('.blob.vercel-storage.com');
  });

  test('an 11 MB file is refused in the browser', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(brand.formPath);
    await dismissConsent(page);
    test.skip(!(await uploadEnabled(page)), 'Uploads are switched off on this deployment (HUMAN STEP)');
    const form = await fillRequired(page, brand.formId);
    await form.locator('input[name="attachment"]').setInputFiles({
      name: 'too-big-11mb.pdf',
      mimeType: 'application/pdf',
      buffer: pdfOfSize(11 * MB),
    });
    await expect(form.locator('[data-error-for="attachment"]')).toContainText('The limit is 10 MB');
  });

  test('an 11 MB file is also refused by the Blob token when the browser check is skipped', async ({ page }, testInfo) => {
    const brand = brands[brandOf(testInfo)];
    await page.goto(`${brand.formPath}?upload-check=server`);
    await dismissConsent(page);
    test.skip(!(await uploadEnabled(page)), 'Uploads are switched off on this deployment (HUMAN STEP)');
    const form = await fillRequired(page, brand.formId);
    await form.locator('input[name="attachment"]').setInputFiles({
      name: 'too-big-11mb.pdf',
      mimeType: 'application/pdf',
      buffer: pdfOfSize(11 * MB),
    });
    await page.waitForTimeout(HUMAN_DELAY_MS);
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[data-error-for="attachment"]')).toContainText('The upload was refused', { timeout: 60_000 });
    await expect(page.locator('[data-form-receipt]')).toBeHidden();
  });
});
