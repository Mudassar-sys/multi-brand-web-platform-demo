import { expect, type Page } from '@playwright/test';

/** The server rejects forms submitted less than 3 seconds after page load. */
export const HUMAN_DELAY_MS = 3500;

export async function fillRequired(page: Page, formId: string, email = 'preview-check@example.com') {
  const form = page.locator(`form[data-form-id="${formId}"]`);
  await expect(form).toBeVisible();
  await form.locator('[name="first_name"]').fill('Preview');
  await form.locator('[name="email"]').fill(email);
  return form;
}

export async function dataLayerEvents(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    (window.dataLayer as Array<Record<string, unknown>>)
      .map((entry) => (entry && typeof entry === 'object' && 'event' in entry ? String(entry.event) : ''))
      .filter(Boolean),
  );
}

export async function dismissConsent(page: Page, choice: 'granted' | 'denied' = 'denied') {
  const button = page.locator(`[data-consent-choice="${choice}"]`);
  if (await button.isVisible()) await button.click();
}
