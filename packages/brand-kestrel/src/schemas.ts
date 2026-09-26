import { z } from 'astro/zod';
import {
  anchor,
  cta,
  defineSection,
  definePageSchema,
  icon,
  text,
} from '@platform/ui-core/sections';

/**
 * Kestrel section library. Every section is a Zod schema plus metadata.
 * SECTIONS.md in apps/kestrel is generated from this file (pnpm sections).
 * To add a section, use the /new-section skill.
 */

export const hero = defineSection({
  type: 'hero',
  title: 'Hero',
  description: 'Full-width opening block with the page H1, a short pitch, up to two buttons and a technical drawing.',
  useWhen: 'First section of the home page or a landing page. Exactly one H1 section per page.',
  rendersH1: true,
  schema: z
    .object({
      type: z.literal('hero'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(8, 90),
      subheading: text(20, 260),
      primaryCta: cta,
      secondaryCta: cta.optional(),
      highlights: z
        .array(z.object({ label: text(2, 24), value: text(1, 24) }).strict())
        .max(4)
        .default([]),
      visual: z.enum(['lathe', 'chuck', 'none']).default('lathe'),
    })
    .strict(),
  example: {
    type: 'hero',
    eyebrow: 'Compact CNC lathes',
    heading: 'Production-grade turning for a two-bay shop',
    subheading: 'Bench-to-floor lathes sized for small machine shops, with training and setup included.',
    primaryCta: { label: 'Book a demo', href: '/contact' },
    highlights: [{ label: 'Swing', value: '250 mm' }],
    visual: 'lathe',
  },
});

export const pageHeader = defineSection({
  type: 'pageHeader',
  title: 'Page header',
  description: 'Compact title block with the page H1 and an optional intro line.',
  useWhen: 'First section of inner pages such as Contact or a content page.',
  rendersH1: true,
  schema: z
    .object({
      type: z.literal('pageHeader'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(4, 90),
      intro: text(20, 280).optional(),
    })
    .strict(),
  example: {
    type: 'pageHeader',
    eyebrow: 'Contact',
    heading: 'Talk to an applications engineer',
    intro: 'Tell us what you turn today and we will suggest a machine and tooling package.',
  },
});

export const featureGrid = defineSection({
  type: 'featureGrid',
  title: 'Feature grid',
  description: 'Grid of 2 to 8 short features, each with an icon, a title and one or two sentences.',
  useWhen: 'Explaining benefits or what is included. Keep each body under 200 characters.',
  schema: z
    .object({
      type: z.literal('featureGrid'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
      features: z
        .array(z.object({ icon, title: text(3, 60), body: text(10, 200) }).strict())
        .min(2)
        .max(8),
    })
    .strict(),
  example: {
    type: 'featureGrid',
    heading: 'Built for short runs and fast changeovers',
    columns: 3,
    features: [
      { icon: 'gauge', title: 'Rigid cast bed', body: 'Meehanite-style cast iron damps chatter on interrupted cuts.' },
      { icon: 'cpu', title: 'Conversational control', body: 'Program simple parts at the machine without CAM.' },
    ],
  },
});

export const specTable = defineSection({
  type: 'specTable',
  title: 'Spec table',
  description: 'Side-by-side specification table for 1 to 4 machine models.',
  useWhen: 'Comparing models or listing technical specs. Each row needs one value per model.',
  schema: z
    .object({
      type: z.literal('specTable'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      models: z.array(text(2, 24)).min(1).max(4),
      rows: z
        .array(z.object({ label: text(2, 40), values: z.array(text(1, 40)) }).strict())
        .min(2)
        .max(16),
      footnote: text(10, 200).optional(),
    })
    .strict()
    .refine((s) => s.rows.every((row) => row.values.length === s.models.length), {
      message: 'Every spec row needs exactly one value per model',
      path: ['rows'],
    }),
  example: {
    type: 'specTable',
    heading: 'Specifications',
    models: ['KL-160', 'KL-250'],
    rows: [
      { label: 'Swing over bed', values: ['160 mm', '250 mm'] },
      { label: 'Spindle speed', values: ['4,500 rpm', '4,000 rpm'] },
    ],
  },
});

export const processSteps = defineSection({
  type: 'processSteps',
  title: 'Process steps',
  description: 'Numbered steps in a row (stacked on mobile), each with a title, body and optional duration.',
  useWhen: 'Explaining how buying, installing or training works.',
  schema: z
    .object({
      type: z.literal('processSteps'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      steps: z
        .array(z.object({ title: text(3, 60), body: text(10, 220), duration: text(2, 24).optional() }).strict())
        .min(2)
        .max(6),
    })
    .strict(),
  example: {
    type: 'processSteps',
    heading: 'From first call to first chip',
    steps: [
      { title: 'Part review', body: 'Send a drawing and we confirm fit.', duration: 'Day 1' },
      { title: 'Install', body: 'Rigging, levelling and a test cut.', duration: 'Week 3' },
    ],
  },
});

export const comparisonTable = defineSection({
  type: 'comparisonTable',
  title: 'Comparison table',
  description: 'Two-column comparison with check marks or short text per row.',
  useWhen: 'Contrasting the Kestrel approach with an alternative, such as a used import or a full-size lathe.',
  schema: z
    .object({
      type: z.literal('comparisonTable'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      columns: z.object({ ours: text(2, 32), other: text(2, 32) }).strict(),
      rows: z
        .array(
          z
            .object({
              label: text(2, 60),
              ours: z.union([z.boolean(), text(1, 40)]),
              other: z.union([z.boolean(), text(1, 40)]),
            })
            .strict(),
        )
        .min(2)
        .max(10),
    })
    .strict(),
  example: {
    type: 'comparisonTable',
    heading: 'Why not a used full-size lathe?',
    columns: { ours: 'Kestrel KL-250', other: 'Used full-size lathe' },
    rows: [
      { label: 'Fits a 3 m bay', ours: true, other: false },
      { label: 'Setup and training', ours: 'Included', other: 'Extra' },
    ],
  },
});

export const eventDetails = defineSection({
  type: 'eventDetails',
  title: 'Event details',
  description: 'Date, time, location and agenda block for a showroom event, with an optional button.',
  useWhen: 'Landing pages for demo days and open houses.',
  schema: z
    .object({
      type: z.literal('eventDetails'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      date: text(4, 48),
      time: text(4, 48),
      location: z.object({ name: text(2, 60), address: text(4, 120) }).strict(),
      agenda: z
        .array(z.object({ time: text(2, 16), title: text(3, 80), body: text(10, 200).optional() }).strict())
        .min(1)
        .max(8),
      cta: cta.optional(),
      note: text(10, 200).optional(),
    })
    .strict(),
  example: {
    type: 'eventDetails',
    heading: 'Showroom demo day',
    date: 'Saturday, 14 November',
    time: '9:00 am to 2:00 pm',
    location: { name: 'Kestrel showroom', address: '100 Example Parkway, Suite B' },
    agenda: [{ time: '9:00', title: 'Doors open' }],
  },
});

export const faq = defineSection({
  type: 'faq',
  title: 'FAQ',
  description: 'Accessible accordion of questions and answers (native details elements).',
  useWhen: 'Answering objections near the bottom of a page. 2 to 12 questions.',
  schema: z
    .object({
      type: z.literal('faq'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(4, 90),
      intro: text(20, 260).optional(),
      items: z
        .array(z.object({ question: text(6, 140), answer: text(10, 600) }).strict())
        .min(2)
        .max(12),
    })
    .strict(),
  example: {
    type: 'faq',
    heading: 'Questions',
    items: [
      { question: 'What power supply do I need?', answer: 'Single-phase 230 V on the KL-160, three-phase on the KL-250.' },
      { question: 'Do you ship outside the US?', answer: 'Not yet. Demo showroom deliveries are US-only.' },
    ],
  },
});

export const ctaBand = defineSection({
  type: 'ctaBand',
  title: 'CTA band',
  description: 'Full-width call-to-action strip with a heading, one line of copy and up to two buttons.',
  useWhen: 'Closing a page or splitting a long page with a clear next step.',
  schema: z
    .object({
      type: z.literal('ctaBand'),
      id: anchor,
      heading: text(6, 90),
      body: text(10, 220).optional(),
      primaryCta: cta,
      secondaryCta: cta.optional(),
      tone: z.enum(['accent', 'inverse']).default('inverse'),
    })
    .strict(),
  example: {
    type: 'ctaBand',
    heading: 'See the KL-250 cut your part',
    primaryCta: { label: 'Book a demo', href: '/contact' },
    tone: 'accent',
  },
});

export const leadFormFields = ['lastName', 'phone', 'company', 'city', 'interest', 'message'] as const;

export const leadForm = defineSection({
  type: 'leadForm',
  title: 'Lead form',
  description:
    'Lead form posting to the shared forms package (provider set in brand.config.ts). First name and email are always included; choose the rest.',
  useWhen: 'Contact pages and landing pages. Use a unique formId per form so tracking can tell forms apart.',
  schema: z
    .object({
      type: z.literal('leadForm'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      formId: z.string().regex(/^[a-z0-9-]{3,40}$/, { message: 'formId uses lowercase letters, numbers and hyphens' }),
      fields: z.array(z.enum(leadFormFields)).default(['lastName', 'company', 'message']),
      interestLabel: text(3, 60).default('What are you interested in?'),
      interestOptions: z.array(text(2, 60)).max(8).default([]),
      submitLabel: text(2, 32).default('Send'),
      successMessage: text(10, 200),
      points: z.array(text(4, 120)).max(5).default([]),
    })
    .strict()
    .refine((s) => !s.fields.includes('interest') || s.interestOptions.length >= 2, {
      message: 'Add at least two interestOptions when the interest field is used',
      path: ['interestOptions'],
    }),
  example: {
    type: 'leadForm',
    id: 'book',
    heading: 'Book a showroom demo',
    formId: 'contact-demo',
    fields: ['lastName', 'company', 'interest', 'message'],
    interestOptions: ['KL-160', 'KL-250', 'Not sure yet'],
    successMessage: 'Thanks. An applications engineer will reply within one business day.',
  },
});

export const richText = defineSection({
  type: 'richText',
  title: 'Rich text',
  description: 'Readable text column with optional aside list. Supports **bold** and [links](/path) only.',
  useWhen: 'Long-form content such as a showroom guide or buying advice.',
  schema: z
    .object({
      type: z.literal('richText'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(4, 90),
      paragraphs: z.array(text(20, 900)).min(1).max(12),
      aside: z
        .object({ title: text(3, 60), items: z.array(text(3, 120)).min(1).max(8) })
        .strict()
        .optional(),
    })
    .strict(),
  example: {
    type: 'richText',
    heading: 'Choosing a first CNC lathe',
    paragraphs: ['Start with the largest part you turn today and add **20 percent** headroom.'],
  },
});

export const sectionDefinitions = [
  hero,
  pageHeader,
  featureGrid,
  specTable,
  processSteps,
  comparisonTable,
  eventDetails,
  faq,
  ctaBand,
  leadForm,
  richText,
] as const;

export const pageSchema = definePageSchema(sectionDefinitions);
