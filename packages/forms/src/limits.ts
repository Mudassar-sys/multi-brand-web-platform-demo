/** Upload limits shared by the browser check and the Blob token route. */
export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const UPLOAD_CONTENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'] as const;
export const UPLOAD_ACCEPT = UPLOAD_CONTENT_TYPES.join(',');

/** Oldest form we accept, so a stale tab cannot replay an old timestamp. */
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

export function formatMegabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Must match the Blob store's access mode, which is fixed when the store is
 * created. Private: uploaded files need a token to read, so customer
 * photos are never publicly listed.
 */
export const UPLOAD_ACCESS = 'private' as const;
