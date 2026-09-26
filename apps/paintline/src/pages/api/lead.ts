import { createLeadHandler } from '@platform/forms/handler';
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import brand from '../../../brand.config';

// Runs as a Vercel Function. Provider, lists and tags come from brand.config.ts.
export const prerender = false;

export const POST = createLeadHandler(brand.id, brand.forms, {
  env: (name) => getSecret(name),
}) satisfies APIRoute;
