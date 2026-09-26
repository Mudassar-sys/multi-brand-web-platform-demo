import { describe, expect, it } from 'vitest';
import { pageSchema, sectionDefinitions } from '../src/schemas';

describe('section library', () => {
  it('has at least 8 sections with unique types', () => {
    const types = sectionDefinitions.map((d) => d.type);
    expect(types.length).toBeGreaterThanOrEqual(8);
    expect(new Set(types).size).toBe(types.length);
  });

  for (const definition of sectionDefinitions) {
    it(`${definition.type}: the documented example is valid`, () => {
      const result = definition.schema.safeParse(definition.example);
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    });
  }

  it('a page built from every example is valid', () => {
    const h1 = sectionDefinitions.find((d) => d.rendersH1)!;
    const rest = sectionDefinitions.filter((d) => !d.rendersH1);
    const result = pageSchema.safeParse({
      title: 'Every section on one page',
      description: 'A test page that uses the example of every section in this brand library.',
      sections: [h1.example, ...rest.map((d) => d.example)],
    });
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  it('rejects a section type from another brand', () => {
    const h1 = sectionDefinitions.find((d) => d.rendersH1)!;
    const result = pageSchema.safeParse({
      title: 'Wrong section type',
      description: 'A test page that uses a section type this brand does not register at all.',
      sections: [h1.example, { type: 'notARealSection' }],
    });
    expect(result.success).toBe(false);
  });
});
