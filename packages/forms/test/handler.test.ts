import { describe, expect, it, vi } from 'vitest';
import type { FormsConfig } from '../src/config';
import { createLeadHandler } from '../src/handler';
import { sendWithRetry } from '../src/http';

const forms: FormsConfig = {
  provider: 'activecampaign',
  minSubmitMs: 3000,
  activecampaign: {
    apiUrlEnv: 'AC_API_URL',
    apiTokenEnv: 'AC_API_TOKEN',
    lists: { live: 1, test: 2 },
    tags: { live: ['web'], test: ['web'] },
    fieldIds: { gclid: 7 },
  },
};

const NOW = 1_800_000_000_000;
const valid = {
  form_id: 'contact-demo',
  page_path: '/contact',
  first_name: 'Ada',
  email: 'ada@example.com',
  website: '',
  started_at: NOW - 10_000,
  gclid: 'Test-GCLID',
};

function call(body: unknown, env: Record<string, string> = {}, fetchImpl?: typeof fetch) {
  const handler = createLeadHandler('kestrel', forms, { env: (name) => env[name], now: () => NOW, fetchImpl });
  return handler({
    request: new Request('https://example.com/api/lead', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  });
}

describe('lead endpoint', () => {
  it('returns a dry-run receipt with the TEST list on previews, secrets redacted', async () => {
    const response = await call(valid, { VERCEL_ENV: 'preview', AC_API_TOKEN: 'real-token-value' });
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.receipt).toMatchObject({
      mode: 'dry-run',
      provider: 'activecampaign',
      environment: 'preview',
      target: 'test',
      destination: { kind: 'list', ids: ['2'], label: 'TEST list' },
      clickIds: { gclid: 'Test-GCLID' },
    });
    expect(json.receipt.tags).toContain('preview-test');
    expect(JSON.stringify(json)).not.toContain('real-token-value');
  });

  it('uses the LIVE list only in production', async () => {
    const json = await (await call(valid, { VERCEL_ENV: 'production' })).json();
    expect(json.receipt.target).toBe('live');
    expect(json.receipt.destination.ids).toEqual(['1']);
    expect(json.receipt.tags).not.toContain('preview-test');
  });

  it('rejects a filled honeypot', async () => {
    const response = await call({ ...valid, website: 'https://spam.example' });
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe('honeypot');
  });

  it('rejects a submission faster than the minimum time', async () => {
    const response = await call({ ...valid, started_at: NOW - 500 });
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe('too_fast');
  });

  it('returns friendly field errors for invalid data', async () => {
    const response = await call({ ...valid, email: 'not-an-email' });
    expect(response.status).toBe(422);
    expect((await response.json()).fieldErrors.email).toMatch(/valid email/);
  });

  it('calls the provider only in live mode', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 201 }));
    await call(valid, { VERCEL_ENV: 'preview' }, fetchImpl as unknown as typeof fetch);
    expect(fetchImpl).not.toHaveBeenCalled();
    const response = await call(valid, { VERCEL_ENV: 'preview', FORMS_MODE: 'live' }, fetchImpl as unknown as typeof fetch);
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect((await response.json()).receipt.providerStatus).toBe(201);
  });
});

describe('429 handling', () => {
  it('honours Retry-After and retries', async () => {
    const responses = [
      new Response('{"message":"Too Many Attempts."}', { status: 429, headers: { 'Retry-After': '1' } }),
      new Response('{}', { status: 201 }),
    ];
    const fetchImpl = vi.fn(async () => responses.shift()!);
    const sleep = vi.fn(async () => {});
    const response = await sendWithRetry(
      { method: 'POST', url: 'https://example.com', headers: {}, body: {} },
      { fetchImpl: fetchImpl as unknown as typeof fetch, sleep },
    );
    expect(response.status).toBe(201);
    expect(sleep).toHaveBeenCalledWith(1000);
  });

  it('gives up when Retry-After exceeds the time budget', async () => {
    const fetchImpl = vi.fn(async () => new Response('', { status: 429, headers: { 'Retry-After': '119' } }));
    await expect(
      sendWithRetry(
        { method: 'POST', url: 'https://example.com', headers: {}, body: {} },
        { fetchImpl: fetchImpl as unknown as typeof fetch, sleep: async () => {} },
      ),
    ).rejects.toThrow(/rate limit/);
  });
});
