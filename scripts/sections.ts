/**
 * Generates apps/<brand>/SECTIONS.md from packages/brand-<brand>/src/schemas.ts.
 * SECTIONS.md is the catalog the /new-page and /new-landing-page skills read.
 *
 *   pnpm sections          regenerate every brand's catalog
 *   pnpm sections --check  fail if any catalog is stale (used in CI)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { stringify } from 'yaml';

type Json = Record<string, any>;

const root = process.cwd();
const check = process.argv.includes('--check');
const brands = readdirSync(join(root, 'apps')).filter((name) =>
  existsSync(join(root, 'packages', `brand-${name}`, 'src', 'schemas.ts')),
);

function describeType(schema: Json): string {
  if (schema.const !== undefined) return `always "${schema.const}"`;
  if (schema.enum) return `one of: ${schema.enum.join(', ')}`;
  if (schema.anyOf || schema.oneOf) {
    return (schema.anyOf ?? schema.oneOf).map((s: Json) => describeType(s)).join(' or ');
  }
  if (schema.type === 'array') return `list of ${describeType(schema.items ?? {})}`;
  if (schema.type === 'object') return 'object';
  if (schema.type === 'string') return 'text';
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type === 'boolean') return 'true or false';
  return 'value';
}

function rules(schema: Json): string {
  const out: string[] = [];
  if (schema.minLength !== undefined || schema.maxLength !== undefined) {
    out.push(`${schema.minLength ?? 0} to ${schema.maxLength ?? 'any'} characters`);
  }
  if (schema.minItems !== undefined || schema.maxItems !== undefined) {
    out.push(`${schema.minItems ?? 0} to ${schema.maxItems ?? 'any'} items`);
  }
  if (schema.pattern) {
    out.push(
      String(schema.pattern).includes('https')
        ? 'a link (see the link rule above)'
        : 'lowercase letters, numbers and hyphens',
    );
  }
  if (schema.default !== undefined) out.push(`default: ${JSON.stringify(schema.default)}`);
  return out.join('; ');
}

function rows(schema: Json, prefix = ''): string[] {
  const required = new Set<string>(schema.required ?? []);
  const lines: string[] = [];
  for (const [key, raw] of Object.entries<Json>(schema.properties ?? {})) {
    if (key === 'type' && !prefix) continue;
    const field = `${prefix}${key}`;
    lines.push(`| \`${field}\` | ${describeType(raw)} | ${required.has(key) ? 'yes' : 'no'} | ${rules(raw)} |`);
    if (raw.type === 'object') lines.push(...rows(raw, `${field}.`));
    if (raw.type === 'array' && raw.items?.type === 'object') lines.push(...rows(raw.items, `${field}[].`));
  }
  return lines;
}

async function render(brand: string): Promise<string> {
  const schemasUrl = pathToFileURL(join(root, 'packages', `brand-${brand}`, 'src', 'schemas.ts')).href;
  const coreUrl = pathToFileURL(join(root, 'packages', 'ui-core', 'src', 'sections.ts')).href;
  const { sectionDefinitions } = await import(schemasUrl);
  const { sectionJsonSchema } = await import(coreUrl);
  const h1Types = sectionDefinitions.filter((d: Json) => d.rendersH1).map((d: Json) => `\`${d.type}\``);

  const parts = [
    `# ${brand[0].toUpperCase()}${brand.slice(1)} section catalog`,
    '',
    `Generated from \`packages/brand-${brand}/src/schemas.ts\` by \`pnpm sections\`. Do not edit by hand.`,
    '',
    'Rules for every page in `src/content/pages/`:',
    '',
    `- Use only the section types listed below. Anything else fails the build.`,
    `- The first section must be one of ${h1Types.join(' or ')}, and a page has exactly one of them (it holds the H1).`,
    '- Page fields: `title` (10 to 70 characters), `description` (50 to 165 characters), optional `kind` (`page` or `landing`) and `noindex` (true or false).',
    '- Links (`href`) start with `/`, `#`, `https://`, `mailto:` or `tel:`.',
    '',
    '## Sections',
    '',
    ...sectionDefinitions.map((d: Json) => `- [\`${d.type}\`](#${d.type.toLowerCase()}): ${d.title}`),
    '',
  ];

  for (const definition of sectionDefinitions) {
    const schema = sectionJsonSchema(definition);
    parts.push(
      `### ${definition.type}`,
      '',
      `**${definition.title}.** ${definition.description}`,
      '',
      `Use when: ${definition.useWhen}${definition.rendersH1 ? ' Renders the page H1.' : ''}`,
      '',
      '| Field | Type | Required | Rules |',
      '| --- | --- | --- | --- |',
      ...rows(schema),
      '',
      'Example:',
      '',
      '```yaml',
      stringify([definition.example], { lineWidth: 0 }).trim(),
      '```',
      '',
    );
  }
  return parts.join('\n');
}

let stale = false;
for (const brand of brands) {
  const target = join(root, 'apps', brand, 'SECTIONS.md');
  const next = await render(brand);
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (check) {
    if (current !== next) {
      stale = true;
      console.error(`apps/${brand}/SECTIONS.md is out of date. Run "pnpm sections" and commit the result.`);
    } else {
      console.log(`apps/${brand}/SECTIONS.md is up to date.`);
    }
  } else if (current !== next) {
    writeFileSync(target, next);
    console.log(`Wrote apps/${brand}/SECTIONS.md`);
  } else {
    console.log(`apps/${brand}/SECTIONS.md unchanged.`);
  }
}
if (stale) process.exit(1);
