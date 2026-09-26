/**
 * Lead endpoint factory. Each brand mounts it at src/pages/api/lead.ts with
 * `prerender = false`, so it runs as a Vercel Function.
 *
 * Environment routing: when VERCEL_ENV is not "production" the lead goes to
 * the TEST list or group and is tagged preview-test. FORMS_MODE=live sends
 * the request to the provider; anything else (the default) is dry-run: the
 * exact request is built, secrets are redacted, and it is returned as a
 * receipt without calling the provider.
 */
import { AC_PLACEHOLDER_URL, AC_SECRET_HEADERS, acTags, buildActiveCampaignSync } from './adapters/activecampaign';
import { buildMailerLiteUpsert, ML_SECRET_HEADERS, mlTags } from './adapters/mailerlite';
import type { FormsConfig, Target } from './config';
import { checkGuards } from './guards';
import { RateLimitedError, redact, sendWithRetry, type ProviderRequest } from './http';
import type { Receipt } from './receipt';
import { CLICK_ID_KEYS, leadSchema, type Lead } from './schema';

export interface HandlerDeps {
  /** Reads an environment variable at request time. */
  env: (name: string) => string | undefined;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export function resolveEnvironment(env: HandlerDeps['env']): Receipt['environment'] {
  const value = env('VERCEL_ENV');
  return value === 'production' || value === 'preview' ? value : 'development';
}

export function buildProviderRequest(
  lead: Lead,
  forms: FormsConfig,
  target: Target,
  env: HandlerDeps['env'],
): { request: ProviderRequest; secretHeaders: string[]; destination: Receipt['destination']; tags: string[] } {
  if (forms.provider === 'activecampaign') {
    const config = forms.activecampaign;
    if (!config) throw new Error('activecampaign config missing');
    return {
      request: buildActiveCampaignSync(
        lead,
        config,
        target,
        env(config.apiUrlEnv) || AC_PLACEHOLDER_URL,
        env(config.apiTokenEnv) ?? '',
      ),
      secretHeaders: AC_SECRET_HEADERS,
      destination: {
        kind: 'list',
        ids: [String(config.lists[target])],
        label: target === 'live' ? 'LIVE list' : 'TEST list',
      },
      tags: acTags(config, target),
    };
  }
  const config = forms.mailerlite;
  if (!config) throw new Error('mailerlite config missing');
  return {
    request: buildMailerLiteUpsert(lead, config, target, env(config.apiTokenEnv) ?? ''),
    secretHeaders: ML_SECRET_HEADERS,
    destination: {
      kind: 'group',
      ids: [...config.groups[target]],
      label: target === 'live' ? 'LIVE group' : 'TEST group',
    },
    tags: mlTags(config, target),
  };
}

export function createLeadHandler(brand: string, forms: FormsConfig, deps: HandlerDeps) {
  const now = deps.now ?? Date.now;

  return async ({ request }: { request: Request }): Promise<Response> => {
    if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
      return json(415, { ok: false, message: 'Please submit the form from the website.' });
    }

    let raw: Record<string, unknown>;
    try {
      raw = (await request.json()) as Record<string, unknown>;
    } catch {
      return json(400, { ok: false, message: 'We could not read that submission. Please try again.' });
    }

    const guard = checkGuards(raw, forms.minSubmitMs, now());
    if (guard) return json(400, { ok: false, code: guard.code, message: guard.message });

    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        fieldErrors[key] ??= issue.message;
      }
      return json(422, {
        ok: false,
        code: 'invalid',
        message: 'Please check the highlighted fields.',
        fieldErrors,
      });
    }
    const lead = parsed.data;

    const environment = resolveEnvironment(deps.env);
    const target: Target = environment === 'production' ? 'live' : 'test';
    const mode = deps.env('FORMS_MODE') === 'live' ? 'live' : 'dry-run';
    const built = buildProviderRequest(lead, forms, target, deps.env);

    const clickIds: Record<string, string> = {};
    for (const key of CLICK_ID_KEYS) if (lead[key]) clickIds[key] = lead[key] as string;

    const receipt: Receipt = {
      mode,
      brand,
      provider: forms.provider,
      environment,
      target,
      destination: built.destination,
      tags: built.tags,
      clickIds,
      ...(lead.attachment_url ? { attachmentUrl: lead.attachment_url } : {}),
      requests: [redact(built.request, built.secretHeaders)],
      receivedAt: new Date(now()).toISOString(),
    };

    if (mode === 'live') {
      try {
        const response = await sendWithRetry(built.request, { fetchImpl: deps.fetchImpl });
        receipt.providerStatus = response.status;
        if (!response.ok) {
          return json(502, {
            ok: false,
            code: 'provider',
            message: 'Our email system did not accept this right now. Please try again in a minute.',
          });
        }
      } catch (error) {
        const message =
          error instanceof RateLimitedError
            ? 'We are receiving a lot of messages. Please try again in a minute.'
            : 'Our email system is not reachable right now. Please try again in a minute.';
        return json(503, { ok: false, code: 'provider', message });
      }
    }

    return json(200, { ok: true, receipt });
  };
}
