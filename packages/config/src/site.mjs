// @ts-check
/**
 * Production origin used for canonical URLs and the sitemap. Vercel sets
 * VERCEL_PROJECT_PRODUCTION_URL (without https://) on production AND
 * preview builds, so previews still point canonicals at the live site.
 */
export function productionSite(fallback = 'http://localhost:4321') {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : fallback;
}
