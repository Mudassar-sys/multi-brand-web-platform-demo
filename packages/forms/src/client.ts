/**
 * Browser side of lead forms: spam-guard timestamp, optional Blob upload,
 * JSON submission, field errors, the demo receipt, and the lead event
 * (fired only after the server confirms).
 */
import { upload } from '@vercel/blob/client';
import { ATTRIBUTION_KEYS, currentAttribution, trackLead } from '@platform/tracking/client';
import { formatMegabytes, UPLOAD_CONTENT_TYPES, UPLOAD_MAX_BYTES } from './limits';
import type { Receipt } from './receipt';

type Json = Record<string, unknown>;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}

export function fileProblem(file: File, skipSizeCheck = false): string | null {
  if (!skipSizeCheck && file.size > UPLOAD_MAX_BYTES) {
    return `This file is ${formatMegabytes(file.size)}. The limit is ${formatMegabytes(UPLOAD_MAX_BYTES).replace('.0', '')}.`;
  }
  if (!(UPLOAD_CONTENT_TYPES as readonly string[]).includes(file.type)) {
    return 'Please upload a PDF, PNG or JPEG file.';
  }
  return null;
}

function safeFileName(name: string): string {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(-100);
  return cleaned || 'attachment';
}

function renderReceipt(container: HTMLElement, receipt: Receipt): void {
  container.replaceChildren();
  container.dataset.receiptProvider = receipt.provider;
  container.dataset.receiptTarget = receipt.target;
  container.dataset.receiptEnvironment = receipt.environment;
  container.dataset.receiptMode = receipt.mode;

  const title = el('p', { class: 'receipt-eyebrow' }, 'Demo receipt');
  const lede = el(
    'p',
    { class: 'receipt-lede' },
    receipt.mode === 'dry-run'
      ? `Dry-run: nothing was sent to ${receipt.provider}. Below is the exact request this site would send.`
      : `Sent to ${receipt.provider} (status ${receipt.providerStatus}).`,
  );
  const rows: Array<[string, string, string]> = [
    ['Provider', receipt.provider, 'provider'],
    ['Environment', receipt.environment, 'environment'],
    ['Destination', `${receipt.destination.label} (${receipt.destination.kind} ${receipt.destination.ids.join(', ')})`, 'destination'],
    ['Tags', receipt.tags.join(', ') || 'none', 'tags'],
    [
      'Click IDs and UTMs',
      Object.entries(receipt.clickIds)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ') || 'none captured on this visit',
      'click-ids',
    ],
  ];
  if (receipt.attachmentUrl) rows.push(['Attachment', receipt.attachmentUrl, 'attachment']);

  const list = el('dl', { class: 'receipt-list' });
  for (const [label, value, key] of rows) {
    const row = el('div', { 'data-receipt-row': key });
    row.append(el('dt', {}, label), el('dd', {}, value));
    list.append(row);
  }
  const details = el('details', { class: 'receipt-details' });
  details.append(
    el('summary', {}, 'Show the request (secrets redacted)'),
    el('pre', { 'data-receipt-request': '' }, JSON.stringify(receipt.requests, null, 2)),
  );
  container.append(title, lede, list, details);
  container.hidden = false;
}

function setFieldError(form: HTMLFormElement, name: string, message: string | null): void {
  const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
  const control = form.querySelector<HTMLElement>(`[name="${name}"]`);
  if (slot) {
    slot.textContent = message ?? '';
    slot.classList.toggle('hidden', !message);
    if (message && control) {
      slot.id ||= `${control.id || name}-error`;
      control.setAttribute('aria-describedby', [control.getAttribute('aria-describedby'), slot.id].filter(Boolean).join(' '));
    }
  }
  if (control) {
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  }
}

async function submit(form: HTMLFormElement): Promise<void> {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submitButton = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const shell = form.closest<HTMLElement>('[data-lead-form-shell]');
  const receiptBox = shell?.querySelector<HTMLElement>('[data-form-receipt]');
  const successBox = shell?.querySelector<HTMLElement>('[data-form-success]');
  const say = (message: string, tone: 'info' | 'error') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
  };

  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((slot) => setFieldError(form, slot.dataset.errorFor!, null));

  const data: Json = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string' && value.trim() !== '') data[key] = value.trim();
  });
  // Honeypot and timestamp are always sent, even when empty.
  data.website = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
  data.page_path = window.location.pathname;
  const attribution = currentAttribution();
  for (const key of ATTRIBUTION_KEYS) if (attribution[key]) data[key] = attribution[key];

  submitButton?.setAttribute('disabled', '');
  form.setAttribute('aria-busy', 'true');
  try {
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"][name="attachment"]');
    const file = fileInput?.files?.[0];
    if (file) {
      const skipSizeCheck = new URLSearchParams(window.location.search).get('upload-check') === 'server';
      const problem = fileProblem(file, skipSizeCheck);
      if (problem) {
        setFieldError(form, 'attachment', problem);
        say(problem, 'error');
        return;
      }
      say('Uploading your file...', 'info');
      const progress = form.querySelector<HTMLProgressElement>('[data-upload-progress]');
      if (progress) progress.hidden = false;
      try {
        const blob = await upload(`leads/${String(data.form_id)}/${safeFileName(file.name)}`, file, {
          access: 'public',
          handleUploadUrl: form.dataset.uploadEndpoint ?? '/api/upload',
          clientPayload: JSON.stringify({ started_at: data.started_at, website: data.website, form_id: data.form_id }),
          onUploadProgress: ({ percentage }) => {
            if (progress) progress.value = percentage;
          },
        });
        data.attachment_url = blob.url;
      } catch (error) {
        const reason = error instanceof Error ? error.message.replace(/^Vercel Blob: /, '') : 'unknown error';
        const message = `The upload was refused: ${reason}`;
        setFieldError(form, 'attachment', message);
        say(message, 'error');
        return;
      } finally {
        if (progress) progress.hidden = true;
      }
    }
    delete data.attachment;

    say('Sending...', 'info');
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
      code?: string;
      fieldErrors?: Record<string, string>;
      receipt?: Receipt;
    };
    form.dataset.lastResult = result.ok ? 'ok' : (result.code ?? 'error');

    if (!response.ok || !result.ok || !result.receipt) {
      for (const [name, message] of Object.entries(result.fieldErrors ?? {})) setFieldError(form, name, message);
      say(result.message ?? 'Something went wrong. Please try again.', 'error');
      return;
    }

    // Server confirmed: only now is the lead event pushed.
    trackLead({
      formId: String(data.form_id),
      brand: document.body.dataset.brand ?? '',
      provider: result.receipt.provider,
      siteEnv: result.receipt.environment,
    });
    say('', 'info');
    form.hidden = true;
    if (successBox) {
      successBox.hidden = false;
      successBox.focus();
    }
    if (receiptBox) renderReceipt(receiptBox, result.receipt);
  } catch {
    say('We could not reach the server. Check your connection and try again.', 'error');
  } finally {
    submitButton?.removeAttribute('disabled');
    form.removeAttribute('aria-busy');
  }
}

export function enhanceLeadForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    if (form.dataset.enhanced) return;
    form.dataset.enhanced = 'true';
    const started = form.querySelector<HTMLInputElement>('input[name="started_at"]');
    if (started) started.value = String(Date.now());

    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"][name="attachment"]');
    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      const skipSizeCheck = new URLSearchParams(window.location.search).get('upload-check') === 'server';
      setFieldError(form, 'attachment', file ? fileProblem(file, skipSizeCheck) : null);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      void submit(form);
    });
  });
}
