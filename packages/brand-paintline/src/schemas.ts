import { z } from 'astro/zod';
import {
  anchor,
  cta,
  defineSection,
  definePageSchema,
  icon,
  text,
} from '@platform/ui-core/sections';
import { artVariants } from './art/variants';

/**
 * Paintline section library. SECTIONS.md in apps/paintline is generated
 * from this file (pnpm sections). To add a section, use /new-section.
 */

const art = z.enum(artVariants);

export const hero = defineSection({
  type: 'hero',
  title: 'Hero',
  description: 'Opening block with the page H1, a pitch, up to two buttons, badges and a large mural concept on a wall.',
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
      badges: z.array(text(2, 32)).max(3).default([]),
      art: art.default('sunrise'),
    })
    .strict(),
  example: {
    type: 'hero',
    eyebrow: 'Direct-to-wall mural printing',
    heading: 'Big, bright walls printed in a day',
    subheading: 'We print your artwork straight onto brick, drywall or concrete, on site, with no vinyl and no seams.',
    primaryCta: { label: 'Get a quote', href: '/contact' },
    badges: ['Printed on site'],
    art: 'sunrise',
  },
});

export const pageHeader = defineSection({
  type: 'pageHeader',
  title: 'Page header',
  description: 'Compact title block with the page H1, an intro line and an optional small artwork.',
  useWhen: 'First section of inner pages such as the quote page or a content page.',
  rendersH1: true,
  schema: z
    .object({
      type: z.literal('pageHeader'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(4, 90),
      intro: text(20, 280).optional(),
      art: art.optional(),
    })
    .strict(),
  example: {
    type: 'pageHeader',
    eyebrow: 'Quote',
    heading: 'Tell us about your wall',
    intro: 'Send a photo and rough measurements. We reply with a price range within one business day.',
    art: 'geo',
  },
});

export const serviceCards = defineSection({
  type: 'serviceCards',
  title: 'Service cards',
  description: 'Rounded cards with an icon, title, short body and optional link, 2 to 6 cards.',
  useWhen: 'Listing services or wall types. Keep each body under 200 characters.',
  schema: z
    .object({
      type: z.literal('serviceCards'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      cards: z
        .array(z.object({ icon, title: text(3, 60), body: text(10, 200), link: cta.optional() }).strict())
        .min(2)
        .max(6),
    })
    .strict(),
  example: {
    type: 'serviceCards',
    heading: 'Walls we print',
    cards: [
      { icon: 'coffee', title: 'Cafes and restaurants', body: 'Feature walls that make the room.' },
      { icon: 'building', title: 'Offices', body: 'Brand walls and wayfinding.' },
    ],
  },
});

export const processSteps = defineSection({
  type: 'processSteps',
  title: 'Process steps',
  description: 'Numbered steps with big serif numerals, 3 to 6 steps.',
  useWhen: 'Explaining how a project runs from quote to reveal.',
  schema: z
    .object({
      type: z.literal('processSteps'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      steps: z
        .array(z.object({ title: text(3, 60), body: text(10, 220) }).strict())
        .min(3)
        .max(6),
    })
    .strict(),
  example: {
    type: 'processSteps',
    heading: 'How a wall comes together',
    steps: [
      { title: 'Send a photo', body: 'A phone photo and rough size is enough to start.' },
      { title: 'Approve the proof', body: 'We mock the design onto your wall.' },
      { title: 'Print day', body: 'Most walls are printed in a single day.' },
    ],
  },
});

export const gallery = defineSection({
  type: 'gallery',
  title: 'Gallery',
  description: 'Grid of mural concepts, each with a title, caption and space type. Uses generated artwork, labelled as illustrative.',
  useWhen: 'Showing styles and ideas. Never present these as real client work.',
  schema: z
    .object({
      type: z.literal('gallery'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      items: z
        .array(z.object({ art, title: text(3, 48), caption: text(10, 140), space: text(3, 40) }).strict())
        .min(3)
        .max(9),
      note: text(10, 160).default('Illustrative concepts created for this demo, not client projects.'),
    })
    .strict(),
  example: {
    type: 'gallery',
    heading: 'Style ideas',
    items: [
      { art: 'botanical', title: 'Greenhouse', caption: 'Oversized leaves for a plant-filled cafe.', space: 'Cafe' },
      { art: 'geo', title: 'Blocks', caption: 'Bold shapes for a studio lobby.', space: 'Office' },
      { art: 'wave', title: 'Tide', caption: 'Calm waves for a treatment room.', space: 'Clinic' },
    ],
  },
});

export const surfaceGuide = defineSection({
  type: 'surfaceGuide',
  title: 'Surface guide',
  description: 'Table of wall surfaces with a suitability rating (great, good, ask) and a note.',
  useWhen: 'Answering "can you print on my wall?" before someone asks.',
  schema: z
    .object({
      type: z.literal('surfaceGuide'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      surfaces: z
        .array(z.object({ name: text(2, 40), rating: z.enum(['great', 'good', 'ask']), note: text(6, 140) }).strict())
        .min(3)
        .max(10),
    })
    .strict(),
  example: {
    type: 'surfaceGuide',
    heading: 'Will it work on my wall?',
    surfaces: [
      { name: 'Painted drywall', rating: 'great', note: 'Our most common surface.' },
      { name: 'Brick', rating: 'good', note: 'Texture shows through, which many people love.' },
      { name: 'Glass', rating: 'ask', note: 'Possible with a primer coat.' },
    ],
  },
});

export const packages = defineSection({
  type: 'packages',
  title: 'Packages',
  description: 'One to three price cards with an includes list; one can be highlighted. Requires a footnote.',
  useWhen: 'Showing starting prices. Prices on this demo brand are illustrative.',
  schema: z
    .object({
      type: z.literal('packages'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      tiers: z
        .array(
          z
            .object({
              name: text(2, 32),
              price: text(2, 32),
              summary: text(10, 160),
              includes: z.array(text(3, 80)).min(1).max(8),
              highlighted: z.boolean().default(false),
              cta: cta.optional(),
            })
            .strict(),
        )
        .min(1)
        .max(3),
      footnote: text(10, 200),
    })
    .strict(),
  example: {
    type: 'packages',
    heading: 'Starting prices',
    tiers: [
      { name: 'Feature wall', price: 'From $900', summary: 'One wall up to 10 m2.', includes: ['Design proof'] },
    ],
    footnote: 'Illustrative demo pricing.',
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
      { question: 'How long does printing take?', answer: 'Most walls take one day on site.' },
      { question: 'Is the ink safe indoors?', answer: 'We use low-odour, water-based inks.' },
    ],
  },
});

export const ctaBand = defineSection({
  type: 'ctaBand',
  title: 'CTA band',
  description: 'Rounded call-to-action panel with a heading, one line of copy, up to two buttons and an optional artwork.',
  useWhen: 'Closing a page with a clear next step.',
  schema: z
    .object({
      type: z.literal('ctaBand'),
      id: anchor,
      heading: text(6, 90),
      body: text(10, 220).optional(),
      primaryCta: cta,
      secondaryCta: cta.optional(),
      art: art.optional(),
    })
    .strict(),
  example: {
    type: 'ctaBand',
    heading: 'Ready for a wall people talk about?',
    primaryCta: { label: 'Get a quote', href: '/contact' },
    art: 'abstract',
  },
});

export const quoteFormFields = ['lastName', 'phone', 'company', 'city', 'wallSize', 'surface', 'message', 'attachment'] as const;

export const quoteForm = defineSection({
  type: 'quoteForm',
  title: 'Quote form',
  description:
    'Quote request form posting to the shared forms package (provider set in brand.config.ts). First name and email are always included. The optional attachment uploads up to 10 MB straight to Vercel Blob.',
  useWhen: 'Quote page and landing pages. Use a unique formId per form.',
  schema: z
    .object({
      type: z.literal('quoteForm'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(6, 90),
      intro: text(20, 260).optional(),
      formId: z.string().regex(/^[a-z0-9-]{3,40}$/, { message: 'formId uses lowercase letters, numbers and hyphens' }),
      fields: z.array(z.enum(quoteFormFields)).default(['wallSize', 'message', 'attachment']),
      surfaceOptions: z.array(text(2, 40)).max(8).default([]),
      submitLabel: text(2, 32).default('Request a quote'),
      successMessage: text(10, 200),
      aside: z
        .object({ title: text(3, 60), points: z.array(text(4, 120)).min(1).max(5) })
        .strict()
        .optional(),
    })
    .strict()
    .refine((s) => !s.fields.includes('surface') || s.surfaceOptions.length >= 2, {
      message: 'Add at least two surfaceOptions when the surface field is used',
      path: ['surfaceOptions'],
    }),
  example: {
    type: 'quoteForm',
    id: 'quote',
    heading: 'Request a quote',
    formId: 'quote-main',
    fields: ['wallSize', 'surface', 'message', 'attachment'],
    surfaceOptions: ['Painted drywall', 'Brick', 'Not sure'],
    successMessage: 'Thanks. We will reply with a price range within one business day.',
  },
});

export const richText = defineSection({
  type: 'richText',
  title: 'Rich text',
  description: 'Readable text column with an optional pull quote from the brand itself. Supports **bold** and [links](/path).',
  useWhen: 'Long-form content such as care guides or how the printing works.',
  schema: z
    .object({
      type: z.literal('richText'),
      id: anchor,
      eyebrow: text(2, 48).optional(),
      heading: text(4, 90),
      paragraphs: z.array(text(20, 900)).min(1).max(12),
      pullQuote: text(10, 160).optional(),
    })
    .strict(),
  example: {
    type: 'richText',
    heading: 'Why direct-to-wall',
    paragraphs: ['Printing straight onto the wall means **no seams** and no peeling edges.'],
  },
});

export const sectionDefinitions = [
  hero,
  pageHeader,
  serviceCards,
  processSteps,
  gallery,
  surfaceGuide,
  packages,
  faq,
  ctaBand,
  quoteForm,
  richText,
] as const;

export const pageSchema = definePageSchema(sectionDefinitions);
