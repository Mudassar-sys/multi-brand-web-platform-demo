import { createUploadHandler } from '@platform/forms/upload';
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import brand from '../../../brand.config';

// Issues Vercel Blob client-upload tokens (10 MB max, PDF/PNG/JPEG).
export const prerender = false;

export const POST = createUploadHandler(brand.id, brand.forms, {
  env: (name) => getSecret(name),
}) satisfies APIRoute;
