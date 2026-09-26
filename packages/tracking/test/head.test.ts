import { describe, expect, it } from 'vitest';
import { attributionFromUrl } from '../src/client';
import { ALL_DENIED, type TrackingConfig } from '../src/config';
import { buildGtmNoscriptSrc, buildGtmSnippet, buildHeadScript } from '../src/head';

const config: TrackingConfig = {
  consent: {
    regionDefaults: [{ regions: ['DE', 'GB'], state: ALL_DENIED }],
    fallback: { ...ALL_DENIED, analytics_storage: 'granted' },
    waitForUpdate: 500,
    urlPassthrough: true,
    adsDataRedaction: true,
  },
};

describe('head script contract', () => {
  const script = buildHeadScript({ brand: 'kestrel', siteEnv: 'preview', config });

  it('initialises dataLayer with site_env and brand before any consent command', () => {
    const init = script.indexOf('window.dataLayer.push({"site_env":"preview","brand":"kestrel"})');
    const firstConsent = script.indexOf("gtag('consent', 'default'");
    expect(init).toBeGreaterThan(-1);
    expect(firstConsent).toBeGreaterThan(init);
  });

  it('sets a default for all four consent mode v2 parameters, region first, then the fallback', () => {
    const defaults = script.split('\n').filter((line) => line.startsWith("gtag('consent', 'default'"));
    expect(defaults).toHaveLength(2);
    for (const line of defaults) {
      for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage', 'wait_for_update']) {
        expect(line).toContain(`"${key}"`);
      }
    }
    expect(defaults[0]).toContain('"region":["DE","GB"]');
    expect(defaults[1]).not.toContain('region');
  });

  it('sets url_passthrough and ads_data_redaction after the defaults', () => {
    expect(script.indexOf("gtag('set', 'url_passthrough', true)")).toBeGreaterThan(
      script.lastIndexOf("gtag('consent', 'default'"),
    );
    expect(script).toContain("gtag('set', 'ads_data_redaction', true)");
  });

  it('re-applies a stored choice with a consent update', () => {
    expect(script).toContain("gtag('consent', 'update'");
  });
});

describe('GTM snippet', () => {
  it('uses Google by default and a custom loader host when configured', () => {
    expect(buildGtmSnippet('GTM-ABC123')).toContain("'https://www.googletagmanager.com/gtm.js?id='");
    expect(buildGtmSnippet('GTM-ABC123', 'https://load.example.com/')).toContain("'https://load.example.com/gtm.js?id='");
    expect(buildGtmNoscriptSrc('GTM-ABC123')).toBe('https://www.googletagmanager.com/ns.html?id=GTM-ABC123');
  });
});

describe('click ID capture', () => {
  it('reads gclid, gbraid, wbraid and UTM values and keeps their case', () => {
    const values = attributionFromUrl(
      'https://example.com/lp?gclid=AbC-123_x&gbraid=GbR&utm_source=google&utm_medium=cpc&utm_campaign=Spring&other=1',
    );
    expect(values).toEqual({
      gclid: 'AbC-123_x',
      gbraid: 'GbR',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'Spring',
    });
  });
});
