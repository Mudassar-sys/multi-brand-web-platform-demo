/**
 * Browser side of the tracking contract.
 *
 * Click IDs and UTM values are read from the landing URL and always placed
 * in the hidden fields of lead forms on that page. They are written to
 * storage (and so survive navigation) only when ad_storage is granted.
 */
import { ATTRIBUTION_KEY, CONSENT_KEY } from './head';

export const ATTRIBUTION_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

interface StoredConsent {
  v: 1;
  ads: 'granted' | 'denied';
  analytics: 'granted' | 'denied';
  at: string;
}

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __platformAttribution?: Attribution;
  }
}

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readConsent(): StoredConsent | null {
  try {
    const raw = storage()?.getItem(CONSENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoredConsent) : null;
    return parsed && parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function adStorageGranted(): boolean {
  return readConsent()?.ads === 'granted';
}

function readStoredAttribution(): Attribution {
  try {
    const raw = storage()?.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { values: Attribution; expires: number };
    if (!parsed.expires || parsed.expires < Date.now()) {
      storage()?.removeItem(ATTRIBUTION_KEY);
      return {};
    }
    return parsed.values ?? {};
  } catch {
    return {};
  }
}

function writeStoredAttribution(values: Attribution): void {
  if (Object.keys(values).length === 0) return;
  storage()?.setItem(ATTRIBUTION_KEY, JSON.stringify({ values, expires: Date.now() + NINETY_DAYS }));
}

export function clearStoredAttribution(): void {
  storage()?.removeItem(ATTRIBUTION_KEY);
}

/** Values present in a URL's query string (click IDs keep their exact case). */
export function attributionFromUrl(url: string): Attribution {
  const params = new URL(url).searchParams;
  const found: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  return found;
}

/**
 * Attribution for this page view. A new click in the URL replaces anything
 * stored (last click wins). Storage is only read or written with consent.
 */
export function captureAttribution(url: string = window.location.href): Attribution {
  const fromUrl = attributionFromUrl(url);
  const granted = adStorageGranted();
  const hasNew = Object.keys(fromUrl).length > 0;
  const current = hasNew ? fromUrl : granted ? readStoredAttribution() : {};
  if (hasNew && granted) writeStoredAttribution(fromUrl);
  window.__platformAttribution = current;
  return current;
}

export function currentAttribution(): Attribution {
  return window.__platformAttribution ?? captureAttribution();
}

/** Copies attribution into hidden inputs named after each key. */
export function fillAttributionFields(root: ParentNode = document): void {
  const values = currentAttribution();
  root.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    for (const key of ATTRIBUTION_KEYS) {
      const input = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${key}"]`);
      if (input) input.value = values[key] ?? '';
    }
  });
}

function gtag(...args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') window.gtag(...args);
  else window.dataLayer.push(args);
}

/** Records the visitor's choice, updates consent mode and storage. */
export function setConsent(choice: 'granted' | 'denied'): void {
  const record: StoredConsent = { v: 1, ads: choice, analytics: choice, at: new Date().toISOString() };
  try {
    storage()?.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* storage blocked: the choice applies to this page only */
  }
  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  if (choice === 'granted') writeStoredAttribution(currentAttribution());
  else clearStoredAttribution();
  window.dispatchEvent(new CustomEvent('platform:consent', { detail: record }));
}

export interface LeadEvent {
  formId: string;
  brand: string;
  provider: string;
  siteEnv: string;
}

/**
 * Pushes generate_lead. Call ONLY after the server confirmed the
 * submission. GTM maps this event to GA4 and, in production only, to the
 * Google Ads conversion tag.
 */
export function trackLead(event: LeadEvent): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'generate_lead',
    form_id: event.formId,
    brand: event.brand,
    lead_provider: event.provider,
    site_env: event.siteEnv,
  });
}
