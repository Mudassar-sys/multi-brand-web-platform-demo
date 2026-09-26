/**
 * Tracking configuration per brand (apps/<brand>/brand.config.ts).
 * The GTM container ID itself is NOT here: it comes from the PUBLIC_GTM_ID
 * environment variable of each Vercel project, so previews and local builds
 * can run without a container.
 */

export type ConsentValue = 'granted' | 'denied';

export interface ConsentState {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
}

export interface RegionDefault {
  /** ISO 3166-2 region codes, for example "DE" or "US-CA". */
  regions: string[];
  state: ConsentState;
}

export interface TrackingConfig {
  /**
   * Host that serves gtm.js. Defaults to Google. A brand that uses
   * first-party serving sets its own host here.
   */
  gtmHost?: string;
  consent: {
    /** Region-specific defaults. The most specific region wins. */
    regionDefaults: RegionDefault[];
    /** Default everywhere else (a consent default call without a region). */
    fallback: ConsentState;
    /** Milliseconds tags wait for a consent update. */
    waitForUpdate: number;
    urlPassthrough: boolean;
    adsDataRedaction: boolean;
  };
}

export const ALL_DENIED: ConsentState = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

/** EEA member states plus the UK and Switzerland. */
export const EEA_UK_CH = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT',
  'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH',
];
