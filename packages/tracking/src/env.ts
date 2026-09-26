export type SiteEnv = 'production' | 'preview' | 'development';

/**
 * Environment of this build. Vercel exposes VERCEL_ENV to Astro builds as
 * PUBLIC_VERCEL_ENV (framework environment variables). Anything else,
 * including a local build, is "development".
 */
export function getSiteEnv(): SiteEnv {
  const value = import.meta.env.PUBLIC_VERCEL_ENV;
  return value === 'production' || value === 'preview' ? value : 'development';
}

export function getGtmId(): string | undefined {
  const id = import.meta.env.PUBLIC_GTM_ID;
  return typeof id === 'string' && /^GTM-[A-Z0-9]+$/.test(id) ? id : undefined;
}
