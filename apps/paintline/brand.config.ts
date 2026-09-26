import { ALL_DENIED, EEA_UK_CH } from '@platform/tracking/config';
import { defineBrand } from '@platform/ui-core/brand';

/**
 * Paintline Murals is a fictional demo brand.
 * Forms provider: MailerLite. All group IDs and field keys below are
 * placeholders; the TEST group is used on every non-production deployment.
 */
export default defineBrand({
  id: 'paintline',
  name: 'Paintline Murals',
  shortName: 'Paintline',
  tagline: 'Direct-to-wall mural printing',
  locale: 'en-US',
  themeColor: '#fbf6ee',
  nav: [
    { label: 'Ideas', href: '/#gallery' },
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Pricing', href: '/how-it-works#pricing' },
    { label: 'Get a quote', href: '/contact' },
  ],
  headerCta: { label: 'Get a quote', href: '/contact' },
  footer: {
    blurb:
      'Paintline Murals is a fictional direct-to-wall mural printing studio, created for this platform demo.',
    address: '200 Sample Street, Unit 4, Riverside, USA (fictional address)',
    email: 'studio@example.com',
  },
  tracking: {
    consent: {
      regionDefaults: [
        { regions: EEA_UK_CH, state: ALL_DENIED },
        { regions: ['US-CA'], state: ALL_DENIED },
      ],
      fallback: ALL_DENIED,
      waitForUpdate: 500,
      urlPassthrough: true,
      adsDataRedaction: true,
    },
  },
  forms: {
    provider: 'mailerlite',
    minSubmitMs: 3000,
    uploads: { enabled: true },
    mailerlite: {
      apiTokenEnv: 'MAILERLITE_API_TOKEN',
      groups: { live: ['100000000000000001'], test: ['100000000000000002'] },
      fieldKeys: {
        phone: 'phone',
        company: 'company',
        city: 'city',
        wall_size: 'wall_size',
        surface: 'wall_surface',
        message: 'project_notes',
        attachment_url: 'attachment_url',
        page_path: 'landing_page',
        form_id: 'form_id',
        gclid: 'gclid',
        gbraid: 'gbraid',
        wbraid: 'wbraid',
        utm_source: 'utm_source',
        utm_medium: 'utm_medium',
        utm_campaign: 'utm_campaign',
        utm_term: 'utm_term',
        utm_content: 'utm_content',
      },
      tagsFieldKey: 'lead_tags',
      tags: { live: ['website-lead'], test: ['website-lead'] },
    },
  },
});
