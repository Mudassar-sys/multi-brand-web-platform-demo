export interface ProviderRequest {
  method: 'POST';
  url: string;
  headers: Record<string, string>;
  body: unknown;
}

export const REDACTED = '[redacted]';

/** Copy of a request that is safe to show in a receipt. */
export function redact(request: ProviderRequest, secretHeaders: string[]): ProviderRequest {
  const headers = { ...request.headers };
  for (const name of secretHeaders) {
    if (name in headers) headers[name] = name === 'Authorization' ? `Bearer ${REDACTED}` : REDACTED;
  }
  return { ...request, headers };
}

export class RateLimitedError extends Error {
  constructor(public retryAfterMs: number) {
    super(`Provider rate limit hit; retry after ${retryAfterMs} ms`);
  }
}

/**
 * Sends a provider request. On 429 it honours Retry-After (seconds) and
 * retries, but never waits longer than maxWaitMs in total, so a Function
 * cannot hang on a long provider back-off.
 */
export async function sendWithRetry(
  request: ProviderRequest,
  options: {
    fetchImpl?: typeof fetch;
    sleep?: (ms: number) => Promise<void>;
    maxRetries?: number;
    maxWaitMs?: number;
  } = {},
): Promise<Response> {
  const {
    fetchImpl = fetch,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    maxRetries = 2,
    maxWaitMs = 5000,
  } = options;
  let waited = 0;
  for (let attempt = 0; ; attempt++) {
    const response = await fetchImpl(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(request.body),
    });
    if (response.status !== 429) return response;
    const header = Number(response.headers.get('Retry-After'));
    const waitMs = Number.isFinite(header) && header >= 0 ? header * 1000 : 1000 * (attempt + 1);
    if (attempt >= maxRetries || waited + waitMs > maxWaitMs) throw new RateLimitedError(waitMs);
    waited += waitMs;
    await sleep(waitMs);
  }
}
