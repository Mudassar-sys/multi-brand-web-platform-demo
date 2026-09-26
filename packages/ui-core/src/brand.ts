import type { TrackingConfig } from '@platform/tracking/config';
import type { FormsConfig } from '@platform/forms/config';

export interface NavLink {
  label: string;
  href: string;
}

/**
 * Everything that differs between brands at the platform level lives in
 * apps/<brand>/brand.config.ts and follows this shape.
 */
export interface BrandConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  locale: string;
  themeColor: string;
  nav: NavLink[];
  headerCta: NavLink;
  footer: {
    blurb: string;
    address: string;
    email: string;
  };
  tracking: TrackingConfig;
  forms: FormsConfig;
}

export function defineBrand<const T extends BrandConfig>(config: T): T {
  return config;
}
