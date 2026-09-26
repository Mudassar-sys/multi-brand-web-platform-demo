import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildActiveCampaignSync } from '../src/adapters/activecampaign';
import { buildMailerLiteUpsert } from '../src/adapters/mailerlite';
import type { ActiveCampaignConfig, MailerLiteConfig } from '../src/config';
import { leadSchema } from '../src/schema';

const fixture = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'));

const base = { form_id: 'contact-demo', page_path: '/contact' };

describe('ActiveCampaign contact/sync payload', () => {
  const config: ActiveCampaignConfig = {
    apiUrlEnv: 'AC_API_URL',
    apiTokenEnv: 'AC_API_TOKEN',
    lists: { live: 3, test: 9 },
    tags: { live: ['customer', 'newsletter'], test: ['customer', 'newsletter'] },
    fieldIds: { message: 1 },
  };
  const lead = leadSchema.parse({
    ...base,
    email: 'jondoe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '7223224241',
    message: 'The Value for First Field',
  });

  it('matches the documented example request body exactly', () => {
    const request = buildActiveCampaignSync(lead, config, 'live', 'https://acct.api-us1.com', 'secret');
    expect(request.body).toEqual(fixture('activecampaign-contact-sync.json'));
  });

  it('uses the account API URL and the Api-Token header', () => {
    const request = buildActiveCampaignSync(lead, config, 'live', 'https://acct.api-us1.com/', 'secret');
    expect(request.url).toBe('https://acct.api-us1.com/api/3/contact/sync');
    expect(request.headers['Api-Token']).toBe('secret');
  });

  it('routes non-production leads to the TEST list with the preview-test tag', () => {
    const request = buildActiveCampaignSync(lead, config, 'test');
    const body = request.body as { contact: { lists: Array<{ list: number }>; tags: string[] } };
    expect(body.contact.lists).toEqual([{ list: 9 }]);
    expect(body.contact.tags).toContain('preview-test');
  });

  it('addresses custom fields by numeric ID and skips empty values', () => {
    const request = buildActiveCampaignSync(
      leadSchema.parse({ ...base, email: 'a@example.com', first_name: 'A', gclid: 'XyZ', company: '' }),
      { ...config, fieldIds: { gclid: 7, company: 1 } },
      'live',
    );
    const body = request.body as { contact: { fieldValues: unknown[] } };
    expect(body.contact.fieldValues).toEqual([{ field: '7', value: 'XyZ' }]);
  });
});

describe('MailerLite subscriber upsert payload', () => {
  const config: MailerLiteConfig = {
    apiTokenEnv: 'MAILERLITE_API_TOKEN',
    groups: { live: ['4243829086487936', '14133878422767533'], test: ['999'] },
    fieldKeys: {},
    tagsFieldKey: 'lead_tags',
    tags: { live: [], test: [] },
  };
  const lead = leadSchema.parse({ ...base, email: 'dummy@example.com', first_name: 'Dummy', last_name: 'Testerson' });

  it('matches the documented example request body exactly', () => {
    const request = buildMailerLiteUpsert(lead, config, 'live', 'secret');
    expect(request.body).toEqual(fixture('mailerlite-create-subscriber.json'));
    expect(request.url).toBe('https://connect.mailerlite.com/api/subscribers');
    expect(request.headers.Authorization).toBe('Bearer secret');
  });

  it('routes non-production leads to the TEST group and records the preview-test tag', () => {
    const request = buildMailerLiteUpsert(lead, config, 'test');
    const body = request.body as { groups: string[]; fields: Record<string, string> };
    expect(body.groups).toEqual(['999']);
    expect(body.fields.lead_tags).toBe('preview-test');
  });
});
