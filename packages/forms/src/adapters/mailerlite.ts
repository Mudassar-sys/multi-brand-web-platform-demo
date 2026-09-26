/**
 * MailerLite adapter: POST https://connect.mailerlite.com/api/subscribers
 * upserts a subscriber (201 when new, 200 when the email already exists).
 * Groups are group IDs; fields are addressed by field key. The upsert never
 * removes existing fields or groups. `resubscribe` is deliberately not sent.
 */
import type { MailerLiteConfig, MappableField, Target } from '../config';
import { PREVIEW_TAG } from '../config';
import type { ProviderRequest } from '../http';
import type { Lead } from '../schema';

export const ML_ENDPOINT = 'https://connect.mailerlite.com/api/subscribers';

export interface MlSubscriberBody {
  email: string;
  fields: Record<string, string>;
  groups: string[];
}

export function mlTags(config: MailerLiteConfig, target: Target): string[] {
  const tags = [...config.tags[target]];
  if (target === 'test' && !tags.includes(PREVIEW_TAG)) tags.push(PREVIEW_TAG);
  return tags;
}

export function buildMailerLiteUpsert(
  lead: Lead,
  config: MailerLiteConfig,
  target: Target,
  apiToken = '',
): ProviderRequest {
  const fields: Record<string, string> = { name: lead.first_name };
  if (lead.last_name) fields.last_name = lead.last_name;
  for (const [key, fieldKey] of Object.entries(config.fieldKeys) as Array<[MappableField, string]>) {
    const value = lead[key];
    if (value !== undefined && value !== '') fields[fieldKey] = String(value);
  }
  const tags = mlTags(config, target);
  if (tags.length > 0) fields[config.tagsFieldKey] = tags.join(',');

  return {
    method: 'POST',
    url: ML_ENDPOINT,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: { email: lead.email, fields, groups: [...config.groups[target]] } satisfies MlSubscriberBody,
  };
}

export const ML_SECRET_HEADERS = ['Authorization'];
