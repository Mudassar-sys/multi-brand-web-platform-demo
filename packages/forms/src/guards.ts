import { MAX_FORM_AGE_MS } from './limits';

export type GuardFailure = { code: 'honeypot' | 'too_fast' | 'stale'; message: string };

/**
 * Spam guards shared by the lead endpoint and the upload token route.
 * - honeypot: a visually hidden field real people never fill in
 * - time trap: the form must have been open for at least minSubmitMs
 */
export function checkGuards(
  input: { website?: unknown; started_at?: unknown },
  minSubmitMs: number,
  now: number = Date.now(),
): GuardFailure | null {
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return { code: 'honeypot', message: 'Sorry, we could not accept this submission. Please try again.' };
  }
  const started = Number(input.started_at);
  const elapsed = now - started;
  if (!Number.isFinite(started) || elapsed < minSubmitMs) {
    return {
      code: 'too_fast',
      message: 'That was quicker than a person can type. Please wait a few seconds and send again.',
    };
  }
  if (elapsed > MAX_FORM_AGE_MS) {
    return { code: 'stale', message: 'This page has been open for a long time. Please reload it and try again.' };
  }
  return null;
}
