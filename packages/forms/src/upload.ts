/**
 * Blob client-upload token route. Vercel Functions cap request bodies at
 * 4.5 MB, so the browser uploads the file straight to Vercel Blob and this
 * route only issues a short-lived token. It applies the same honeypot and
 * time checks as the lead endpoint, and the token itself enforces the
 * 10 MB limit and the allowed content types.
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { FormsConfig } from './config';
import { checkGuards } from './guards';
import type { HandlerDeps } from './handler';
import { UPLOAD_CONTENT_TYPES, UPLOAD_MAX_BYTES } from './limits';

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export function uploadsAvailable(forms: FormsConfig, env: HandlerDeps['env']): boolean {
  return Boolean(forms.uploads?.enabled && env('BLOB_READ_WRITE_TOKEN'));
}

export function createUploadHandler(brand: string, forms: FormsConfig, deps: HandlerDeps) {
  const now = deps.now ?? Date.now;

  return async ({ request }: { request: Request }): Promise<Response> => {
    if (!uploadsAvailable(forms, deps.env)) {
      return json(503, { error: 'File uploads are not switched on for this deployment yet.' });
    }
    let body: HandleUploadBody;
    try {
      body = (await request.json()) as HandleUploadBody;
    } catch {
      return json(400, { error: 'We could not read that upload request.' });
    }

    try {
      const result = await handleUpload({
        body,
        request,
        token: deps.env('BLOB_READ_WRITE_TOKEN'),
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          let payload: Record<string, unknown> = {};
          try {
            payload = JSON.parse(clientPayload ?? '{}') as Record<string, unknown>;
          } catch {
            /* treated as missing guard fields below */
          }
          const guard = checkGuards(payload, forms.minSubmitMs, now());
          if (guard) throw new Error(guard.message);
          if (!/^leads\/[a-z0-9-]+\/[A-Za-z0-9._-]{1,120}$/.test(pathname)) {
            throw new Error('Please rename the file using letters and numbers only.');
          }
          return {
            allowedContentTypes: [...UPLOAD_CONTENT_TYPES],
            maximumSizeInBytes: UPLOAD_MAX_BYTES,
            addRandomSuffix: true,
            tokenPayload: JSON.stringify({ brand }),
          };
        },
        onUploadCompleted: async () => {
          // The blob URL travels with the lead submission (attachment_url),
          // so nothing else is stored here.
        },
      });
      return json(200, result);
    } catch (error) {
      return json(400, { error: error instanceof Error ? error.message : 'Upload refused.' });
    }
  };
}
