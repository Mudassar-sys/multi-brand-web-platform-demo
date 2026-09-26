import { ALL_DENIED, EEA_UK_CH } from '@platform/tracking/config';
import { defineBrand } from '@platform/ui-core/brand';

/**
 * Kestrel Machine Co. is a fictional demo brand.
 * Forms provider: ActiveCampaign. All list, tag and field IDs below are
 * placeholders; the TEST list is used on every non-production deployment.
 */
export default defineBrand({
  id: 'kestrel',
  name: 'Kestrel Machine Co.',
  shortName: 'Kestrel',
  tagline: 'Compact CNC lathes for small machine shops',
  locale: 'en-US',
  themeColor: '#0f1318',
  nav: [
    { label: 'Machines', href: '/machines' },
    { label: 'Specs', href: '/machines#specs' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/contact' },
  ],
  headerCta: { label: 'Book a demo', href: '/contact' },
  footer: {
    blurb:
      'Kestrel Machine Co. is a fictional distributor of compact CNC lathes with showroom demo days, created for this platform demo.',
    address: '100 Example Parkway, Suite B, Springfield, USA (fictional address)',
    email: 'demo@example.com',
  },
  tracking: {
    consent: {
      regionDefaults: [{ regions: EEA_UK_CH, state: ALL_DENIED }],
      fallback: {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      },
      waitForUpdate: 500,
      urlPassthrough: true,
      adsDataRedaction: true,
    },
  },
  forms: {
    provider: 'activecampaign',
    minSubmitMs: 3000,
    activecampaign: {
      apiUrlEnv: 'AC_API_URL',
      apiTokenEnv: 'AC_API_TOKEN',
      lists: { live: 1, test: 2 },
      tags: { live: ['website-lead', 'kestrel'], test: ['website-lead', 'kestrel'] },
      fieldIds: {
        company: 1,
        city: 2,
        interest: 3,
        message: 4,
        page_path: 5,
        form_id: 6,
        gclid: 7,
        gbraid: 8,
        wbraid: 9,
        utm_source: 10,
        utm_medium: 11,
        utm_campaign: 12,
        utm_term: 13,
        utm_content: 14,
      },
    },
  },
});
