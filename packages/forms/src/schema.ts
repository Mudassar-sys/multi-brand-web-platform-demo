import { z } from 'astro/zod';

const optional = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional(),
  );

/** Server-side validation for every lead form on every brand. */
export const leadSchema = z.object({
  form_id: z.string().regex(/^[a-z0-9-]{3,40}$/, { message: 'Unknown form' }),
  page_path: z.string().max(200).regex(/^\//, { message: 'Unknown page' }),
  first_name: z.string().trim().min(1, { message: 'Please enter your first name.' }).max(60),
  last_name: optional(60),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .email({ message: 'Please enter a valid email address.' }),
  phone: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z
      .string()
      .trim()
      .max(30)
      .regex(/^[+0-9 ().-]{7,30}$/, { message: 'Please enter a valid phone number.' })
      .optional(),
  ),
  company: optional(120),
  city: optional(80),
  interest: optional(80),
  wall_size: optional(60),
  surface: optional(60),
  message: optional(2000),
  attachment_url: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z
      .string()
      .url()
      .max(500)
      .refine((value) => new URL(value).hostname.endsWith('.blob.vercel-storage.com'), {
        message: 'Attachments must be uploaded through this form.',
      })
      .optional(),
  ),
  gclid: optional(200),
  gbraid: optional(200),
  wbraid: optional(200),
  utm_source: optional(200),
  utm_medium: optional(200),
  utm_campaign: optional(200),
  utm_term: optional(200),
  utm_content: optional(200),
});

export type Lead = z.infer<typeof leadSchema>;

export const CLICK_ID_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;
