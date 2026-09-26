import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { cta, defineSection, definePageSchema } from '../src/sections';

const hero = defineSection({
  type: 'hero',
  title: 'Hero',
  description: 'Test hero',
  useWhen: 'Tests',
  rendersH1: true,
  schema: z.object({ type: z.literal('hero'), heading: z.string() }).strict(),
  example: { type: 'hero', heading: 'Hello' },
});
const text = defineSection({
  type: 'text',
  title: 'Text',
  description: 'Test text',
  useWhen: 'Tests',
  schema: z.object({ type: z.literal('text'), body: z.string() }).strict(),
  example: { type: 'text', body: 'Hi' },
});
const page = definePageSchema([hero, text]);
const meta = {
  title: 'A valid page title',
  description: 'A description that is long enough to satisfy the fifty character minimum rule.',
};

describe('page schema', () => {
  it('accepts a page that starts with its one H1 section', () => {
    expect(page.safeParse({ ...meta, sections: [hero.example, text.example] }).success).toBe(true);
  });

  it('rejects unknown section types', () => {
    expect(page.safeParse({ ...meta, sections: [hero.example, { type: 'carousel' }] }).success).toBe(false);
  });

  it('rejects a page without an H1 section, or with two', () => {
    expect(page.safeParse({ ...meta, sections: [text.example] }).success).toBe(false);
    expect(page.safeParse({ ...meta, sections: [hero.example, hero.example] }).success).toBe(false);
  });

  it('rejects unknown keys so typos fail the build', () => {
    expect(page.safeParse({ ...meta, sections: [{ ...hero.example, headng: 'typo' }] }).success).toBe(false);
  });
});

describe('links', () => {
  it('allows site paths, anchors, https, mailto and tel only', () => {
    for (const href of ['/contact', '#form', 'https://example.com', 'mailto:a@example.com', 'tel:+1 555 0100']) {
      expect(cta.safeParse({ label: 'Go', href }).success, href).toBe(true);
    }
    for (const href of ['javascript:alert(1)', 'http://insecure.example', 'contact']) {
      expect(cta.safeParse({ label: 'Go', href }).success, href).toBe(false);
    }
  });
});
