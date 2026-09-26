/**
 * Forms configuration per brand (apps/<brand>/brand.config.ts).
 * Every ID here is a demo placeholder. Real IDs and API keys are set per
 * Vercel project when a brand goes live (see docs/ARCHITECTURE.md).
 */

export type Provider = 'activecampaign' | 'mailerlite';
export type Target = 'live' | 'test';

/** Lead fields that can be mapped to a provider field. */
export type MappableField =
  | 'phone'
  | 'company'
  | 'city'
  | 'interest'
  | 'wall_size'
  | 'surface'
  | 'message'
  | 'attachment_url'
  | 'page_path'
  | 'form_id'
  | 'gclid'
  | 'gbraid'
  | 'wbraid'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_term'
  | 'utm_content';

export interface ActiveCampaignConfig {
  /** Env var holding the account API URL from Settings > Developer. */
  apiUrlEnv: string;
  /** Env var holding the API token (server only). */
  apiTokenEnv: string;
  /** Numeric list IDs. */
  lists: Record<Target, number>;
  /** Tag names. contact/sync creates missing tags. */
  tags: Record<Target, string[]>;
  /** Custom fields are addressed by numeric ID. */
  fieldIds: Partial<Record<MappableField, number>>;
}

export interface MailerLiteConfig {
  /** Env var holding the API token (server only). */
  apiTokenEnv: string;
  /** Group IDs (strings, as in MailerLite's API examples). */
  groups: Record<Target, string[]>;
  /** Custom fields are addressed by field key (name). */
  fieldKeys: Partial<Record<MappableField, string>>;
  /**
   * The subscriber upsert takes groups and fields, not tags, so tags are
   * written into this custom text field.
   */
  tagsFieldKey: string;
  tags: Record<Target, string[]>;
}

export interface UploadConfig {
  enabled: boolean;
}

export interface FormsConfig {
  provider: Provider;
  activecampaign?: ActiveCampaignConfig;
  mailerlite?: MailerLiteConfig;
  /** Submissions faster than this after page load are treated as bots. */
  minSubmitMs: number;
  uploads?: UploadConfig;
}

/** Tag added to every lead that does not come from production. */
export const PREVIEW_TAG = 'preview-test';
