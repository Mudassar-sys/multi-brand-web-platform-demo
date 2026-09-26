import { z } from 'astro/zod';
import { iconNames } from './primitives/icons';

/**
 * Shared building blocks for section schemas. Brand packages combine these
 * into their own section definitions; the page schema is then a
 * discriminated union on `type`, so a typo or a missing field fails the build.
 */

export const text = (min: number, max: number) => z.string().trim().min(min).max(max);

export const href = z
  .string()
  .regex(/^(\/[a-z0-9\-/#?=&.]*|#[a-z0-9-]+|https:\/\/\S+|mailto:\S+|tel:\+?[0-9 ()-]+)$/i, {
    message: 'Links must start with "/", "#", "https://", "mailto:" or "tel:"',
  });

export const cta = z
  .object({
    label: text(2, 40),
    href,
  })
  .strict();

export const icon = z.enum(iconNames);

/** Optional anchor id so other sections can link to `#id`. */
export const anchor = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/, { message: 'Anchor ids use lowercase letters, numbers and hyphens' })
  .optional();

export interface SectionDefinition {
  /** Value of the `type` field in page data. */
  type: string;
  /** Human name shown in SECTIONS.md. */
  title: string;
  /** One sentence: what the section looks like. */
  description: string;
  /** One sentence: when an owner should pick it. */
  useWhen: string;
  /** True for the one section per page that renders the H1. */
  rendersH1?: boolean;
  schema: z.ZodObject<any>;
  /** A complete, valid example used in SECTIONS.md and in tests. */
  example: Record<string, unknown>;
}

export function defineSection<const T extends SectionDefinition>(definition: T): T {
  return definition;
}

/**
 * Builds the page schema for one brand from its section definitions.
 * Rules enforced at build time:
 * - every section is one of the brand's registered types, with valid props
 * - exactly one H1 section per page, and it comes first
 */
export function definePageSchema(definitions: readonly SectionDefinition[]) {
  const schemas = definitions.map((d) => d.schema) as unknown as [
    z.ZodObject<any>,
    z.ZodObject<any>,
    ...z.ZodObject<any>[],
  ];
  const union = z.discriminatedUnion('type', schemas);
  const h1Types = new Set(definitions.filter((d) => d.rendersH1).map((d) => d.type));

  return z
    .object({
      title: text(10, 70),
      description: text(50, 165),
      kind: z.enum(['page', 'landing']).default('page'),
      noindex: z.boolean().default(false),
      sections: z.array(union).min(1),
    })
    .strict()
    .superRefine((page, ctx) => {
      const types = page.sections.map((s: { type: string }) => s.type);
      const h1Count = types.filter((t: string) => h1Types.has(t)).length;
      if (h1Count !== 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['sections'],
          message: `A page needs exactly one of [${[...h1Types].join(', ')}] and it must come first. Found ${h1Count}.`,
        });
      } else if (!h1Types.has(types[0])) {
        ctx.addIssue({
          code: 'custom',
          path: ['sections', 0],
          message: `The first section must be one of [${[...h1Types].join(', ')}], because it holds the page H1.`,
        });
      }
    });
}
