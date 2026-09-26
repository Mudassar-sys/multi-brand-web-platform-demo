// @ts-check
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { loadRedirects } from '@platform/config/redirects';
import { productionSite } from '@platform/config/site';
import { sitemapOptions } from '@platform/config/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// Pages are static. Only src/pages/api/* run as Vercel Functions
// (prerender = false). The adapter is installed even so, because it is what
// turns `redirects` into real 301 responses.
export default defineConfig({
  site: productionSite(),
  trailingSlash: 'never',
  adapter: vercel(),
  redirects: loadRedirects(new URL('./redirects.csv', import.meta.url)),
  integrations: [sitemap(sitemapOptions(fileURLToPath(new URL('./src/content/pages', import.meta.url))))],
  vite: {
    plugins: [tailwindcss()],
    // Font packages ship CSS, so they must be bundled rather than loaded by Node in dev.
    ssr: { noExternal: ['@fontsource-variable/archivo', '@fontsource-variable/jetbrains-mono', '@fontsource-variable/fraunces', '@fontsource-variable/manrope'] },
  },
});
