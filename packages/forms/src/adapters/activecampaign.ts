/**
 * ActiveCampaign adapter: one POST /api/3/contact/sync call that creates or
 * updates the contact and carries custom field values, list membership and
 * tags. Custom fields are addressed by numeric ID; the account API URL comes
 * from the account's Settings > Developer tab.
 *
 * Note for the client: naming a list in contact/sync makes that membership
 * active even if the contact unsubscribed earlier. A fresh form submission
 * is treated as a fresh opt-in; confirm this matches your consent policy.
 */
import type { ActiveCampaignConfig, MappableField, Target } from '../config';
import { PREVIEW_TAG } from '../config';
import type { ProviderRequest } from '../http';
import type { Lead } from '../schema';

export const AC_PLACEHOLDER_URL = 'https://your-account.api-us1.com';

export interface AcSyncBody {
  contact: {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    fieldValues: Array<{ field: string; value: string }>;
    tags: string[];
    lists: Array<{ list: number }>;
  };
}

export function acTags(config: ActiveCampaignConfig, target: Target): string[] {
  const tags = [...config.tags[target]];
  if (target === 'test' && !tags.includes(PREVIEW_TAG)) tags.push(PREVIEW_TAG);
  return tags;
}

export function buildActiveCampaignSync(
  lead: Lead,
  config: ActiveCampaignConfig,
  target: Target,
  apiUrl: string = AC_PLACEHOLDER_URL,
  apiToken = '',
): ProviderRequest {
  const fieldValues = (Object.entries(config.fieldIds) as Array<[MappableField, number]>)
    .filter(([key]) => lead[key] !== undefined && lead[key] !== '')
    .map(([key, id]) => ({ field: String(id), value: String(lead[key]) }));

  const contact: AcSyncBody['contact'] = {
    email: lead.email,
    firstName: lead.first_name,
    ...(lead.last_name ? { lastName: lead.last_name } : {}),
    ...(lead.phone ? { phone: lead.phone } : {}),
    fieldValues,
    tags: acTags(config, target),
    lists: [{ list: config.lists[target] }],
  };

  return {
    method: 'POST',
    url: `${apiUrl.replace(/\/+$/, '')}/api/3/contact/sync`,
    headers: {
      'Api-Token': apiToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: { contact } satisfies AcSyncBody,
  };
}

export const AC_SECRET_HEADERS = ['Api-Token'];
