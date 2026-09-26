// @ts-check
/**
 * Sitemap helper: pages whose YAML entry says `noindex: true` (usually ad
 * landing pages) are left out of the sitemap.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { parse } from 'yaml';

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.yaml') ? [join(dir, entry.name)] : [],
  );
}

/** URL paths of pages marked noindex in a brand's content folder. */
export function noindexPaths(pagesDir) {
  return walk(pagesDir)
    .filter((file) => parse(readFileSync(file, 'utf8'))?.noindex === true)
    .map((file) => {
      const id = relative(pagesDir, file).split(sep).join('/').replace(/\.yaml$/, '');
      return id === 'index' ? '/' : `/${id}`;
    });
}

/** Options for @astrojs/sitemap. */
export function sitemapOptions(pagesDir) {
  const excluded = new Set(noindexPaths(pagesDir));
  return {
    filter: (/** @type {string} */ page) => !excluded.has(new URL(page).pathname.replace(/\/+$/, '') || '/'),
  };
}
