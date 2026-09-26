import type { ConsentState, TrackingConfig } from './config';
import type { SiteEnv } from './env';

/** localStorage keys shared by the head script and the browser client. */
export const CONSENT_KEY = 'platform_consent';
export const ATTRIBUTION_KEY = 'platform_attribution';

const DEFAULT_GTM_HOST = 'https://www.googletagmanager.com';

function stateLiteral(state: ConsentState, extra: Record<string, unknown> = {}): string {
  return JSON.stringify({ ...state, ...extra });
}

/**
 * Inline script that must run first in <head>, in this order:
 *   1. dataLayer init with site_env and brand
 *   2. consent defaults (region-specific first, then the fallback)
 *   3. url_passthrough / ads_data_redaction
 *   4. re-apply a stored choice, because consent mode does not persist it
 * The GTM snippet (buildGtmSnippet) is rendered right after this script.
 */
export function buildHeadScript(input: { brand: string; siteEnv: SiteEnv; config: TrackingConfig }): string {
  const { brand, siteEnv, config } = input;
  const { consent } = config;
  const lines = [
    'window.dataLayer = window.dataLayer || [];',
    `window.dataLayer.push(${JSON.stringify({ site_env: siteEnv, brand })});`,
    'function gtag(){dataLayer.push(arguments);}',
  ];
  for (const regional of consent.regionDefaults) {
    lines.push(
      `gtag('consent', 'default', ${stateLiteral(regional.state, {
        region: regional.regions,
        wait_for_update: consent.waitForUpdate,
      })});`,
    );
  }
  lines.push(
    `gtag('consent', 'default', ${stateLiteral(consent.fallback, { wait_for_update: consent.waitForUpdate })});`,
  );
  if (consent.urlPassthrough) lines.push("gtag('set', 'url_passthrough', true);");
  if (consent.adsDataRedaction) lines.push("gtag('set', 'ads_data_redaction', true);");
  lines.push(
    `try { var c = JSON.parse(localStorage.getItem('${CONSENT_KEY}') || 'null');` +
      " if (c && c.v === 1) { gtag('consent', 'update', { ad_storage: c.ads, ad_user_data: c.ads," +
      ' ad_personalization: c.ads, analytics_storage: c.analytics }); } } catch (e) {}',
  );
  return lines.join('\n');
}

/** Standard GTM head snippet, with an optional first-party loader host. */
export function buildGtmSnippet(gtmId: string, host: string = DEFAULT_GTM_HOST): string {
  const base = host.replace(/\/+$/, '');
  return (
    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':" +
    "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0]," +
    "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=" +
    `'${base}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
    `})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
  );
}

export function buildGtmNoscriptSrc(gtmId: string, host: string = DEFAULT_GTM_HOST): string {
  return `${host.replace(/\/+$/, '')}/ns.html?id=${encodeURIComponent(gtmId)}`;
}
