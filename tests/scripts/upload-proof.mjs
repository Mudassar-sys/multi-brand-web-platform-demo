// Screenshot proof for the 10 MB upload limit on a Paintline preview.
//   node tests/scripts/upload-proof.mjs <preview-url> <out-dir>
// Uses Playwright's Chromium. The 9 MB success case is covered by preview-checks.
import { chromium } from '@playwright/test';

const [base, out] = process.argv.slice(2);
const MB = 1024 * 1024;
const pdf = (bytes) => {
  const head = Buffer.from('%PDF-1.4\n% upload size test\n');
  const tail = Buffer.from('\n%%EOF\n');
  return Buffer.concat([head, Buffer.alloc(bytes - head.length - tail.length, 0x20), tail]);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function open(query = '') {
  await page.goto(`${base}/contact${query}`);
  const reject = page.locator('[data-consent-choice="denied"]');
  if (await reject.isVisible()) await reject.click();
  const form = page.locator('form[data-form-id="quote-main"]');
  await form.locator('[name="first_name"]').fill('Preview');
  await form.locator('[name="email"]').fill('upload-check@example.com');
  await form.locator('input[name="attachment"]').setInputFiles({
    name: 'too-big-11mb.pdf',
    mimeType: 'application/pdf',
    buffer: pdf(11 * MB),
  });
  return form;
}

// 1. The browser refuses the file as soon as it is chosen.
let form = await open();
await form.locator('[data-error-for="attachment"]').waitFor({ state: 'visible' });
await form.locator('[data-upload-field]').scrollIntoViewIfNeeded();
console.log('browser check:', await form.locator('[data-error-for="attachment"]').innerText());
await page.screenshot({ path: `${out}/12b-upload-11mb-refused-in-browser.png` });

// 2. With the browser check skipped, the Blob token itself refuses it.
form = await open('?upload-check=server');
await page.waitForTimeout(3500);
await form.locator('[type="submit"]').click();
await form.locator('[data-error-for="attachment"]').filter({ hasText: 'refused' }).waitFor({ timeout: 60_000 });
await form.locator('[data-upload-field]').scrollIntoViewIfNeeded();
console.log('blob token:', await form.locator('[data-error-for="attachment"]').innerText());
console.log('receipt shown:', await page.locator('[data-form-receipt]').isVisible());
await page.screenshot({ path: `${out}/12c-upload-11mb-refused-by-blob-token.png` });

await browser.close();
