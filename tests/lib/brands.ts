import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TestInfo } from '@playwright/test';
import { parse } from 'yaml';

export type Brand = 'kestrel' | 'paintline';

interface BrandInfo {
  provider: 'activecampaign' | 'mailerlite';
  /** Page and form used by the form and tracking tests. */
  formPath: string;
  formId: string;
  destination: { test: string; live: string };
  uploads: boolean;
}

export const brands: Record<Brand, BrandInfo> = {
  kestrel: {
    provider: 'activecampaign',
    formPath: '/contact',
    formId: 'contact-demo',
    destination: { test: 'TEST list', live: 'LIVE list' },
    uploads: false,
  },
  paintline: {
    provider: 'mailerlite',
    formPath: '/contact',
    formId: 'quote-main',
    destination: { test: 'TEST group', live: 'LIVE group' },
    uploads: true,
  },
};

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export function brandOf(testInfo: TestInfo): Brand {
  return testInfo.project.name as Brand;
}

/** production on production deployments, preview everywhere else in CI. */
export const expectedSiteEnv = (process.env.EXPECTED_SITE_ENV ?? 'preview') as 'preview' | 'production' | 'development';

/** Every page of a brand, read from its content folder (the source of truth). */
export function brandPages(brand: Brand): Array<{ path: string; noindex: boolean; title: string }> {
  const dir = join(repoRoot, 'apps', brand, 'src', 'content', 'pages');
  const walk = (d: string): string[] =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.yaml') ? [join(d, e.name)] : [],
    );
  return walk(dir).map((file) => {
    const id = relative(dir, file).split(sep).join('/').replace(/\.yaml$/, '');
    const data = parse(readFileSync(file, 'utf8'));
    return { path: id === 'index' ? '/' : `/${id}`, noindex: data.noindex === true, title: data.title };
  });
}

export function redirectsCsv(brand: Brand): string {
  return readFileSync(join(repoRoot, 'apps', brand, 'redirects.csv'), 'utf8');
}

/**
 * URLs that would mean a Google Ads conversion or remarketing hit. Each pattern is listed in
 * docs/SOURCES.md ("Google endpoints matched by the tracking tests") with its source.
 * Whole Ads hosts are not matched: after a gclid landing the Conversion Linker also calls
 * www.googleadservices.com (pagead/set_partitioned_cookie), and that is not a conversion.
 */
export const ADS_REQUEST = /\/pagead\/(conversion|viewthroughconversion|1p-conversion)\/|google\.com\/ads\/ga-audiences/;
