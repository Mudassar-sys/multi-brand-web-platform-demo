import { pageSchema } from '@platform/brand-paintline/schemas';
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';

// Every page is one YAML file in src/content/pages. The file path is the
// URL: index.yaml is "/", lp/spring-demo.yaml is "/lp/spring-demo".
// Data that does not match the brand's section schemas fails the build.
export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
    schema: pageSchema,
  }),
};
