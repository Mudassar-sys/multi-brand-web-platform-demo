import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { type Brand, repoRoot } from './brands';

/*
 * Google endpoints the tracking tests match. Each one is listed in docs/SOURCES.md
 * ("Google endpoints matched by the tracking tests") with its official URL.
 */

/** GA4 sends its hits to *.google-analytics.com (Google's CSP guide, Google Analytics). */
export const GA4_HIT = /^https:\/\/([a-z0-9-]+\.)*google-analytics\.com\//;

/** Hosts whose request URLs may carry the GA4 Measurement ID: gtag.js and the GA4 hits. */
export const GOOGLE_TAG_REQUEST =
  /^https:\/\/(www\.googletagmanager\.com|([a-z0-9-]+\.)*google-analytics\.com)\//;

export interface ExpectedTags {
  gtmId: string;
  ga4MeasurementId: string;
  /** Google Ads conversion ID of the lead conversion tag (public, part of every Ads hit URL). */
  adsConversionId: string;
}

/**
 * IDs the brand's deployments must load, from tests/tracking-expectations.json.
 * EXPECTED_GTM_ID and EXPECTED_GA4_ID override the file for a one-off run.
 */
export function expectedTags(brand: Brand): ExpectedTags {
  const file = JSON.parse(readFileSync(join(repoRoot, 'tests', 'tracking-expectations.json'), 'utf8'));
  return {
    gtmId: process.env.EXPECTED_GTM_ID || file[brand]?.gtmId || '',
    ga4MeasurementId: process.env.EXPECTED_GA4_ID || file[brand]?.ga4MeasurementId || '',
    adsConversionId: file[brand]?.adsConversionId || '',
  };
}

/**
 * The GTM snippet rendered in a page's <head>: its container ID and the gtm.js URL it
 * loads (<host>/gtm.js?id=<container ID>). Null when the page renders no snippet.
 */
export function renderedGtm(html: string): { id: string; scriptUrl: string } | null {
  const head = html.slice(0, html.indexOf('</head>'));
  const at = head.indexOf('data-tracking="gtm"');
  if (at === -1) return null;
  const script = head.slice(at, head.indexOf('</script>', at));
  const id = script.match(/"(GTM-[A-Z0-9]+)"\)/)?.[1] ?? '';
  const host = script.match(/'(https:\/\/[^']+)\/gtm\.js\?id='/)?.[1] ?? '';
  return { id, scriptUrl: `${host}/gtm.js?id=${id}` };
}
