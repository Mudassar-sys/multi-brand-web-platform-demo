---
name: new-section
description: Add a new section type to one brand's section library (schema, component, catalog entry and test). The only skill that edits code; the resulting PR needs developer review.
argument-hint: <brand> "<SectionName>" [what it should show]
disable-model-invocation: true
---

# New section

Arguments: `$ARGUMENTS`

- Brand: `$0`. Section name: `$1` in PascalCase (for example `LogoWall`, `VideoFeature`).
  The `type` value is the camelCase form (`logoWall`).
- Description: everything after the name.

Hard limits:

- Edit files **only inside `packages/brand-$0/`**. The single exception is running
  `pnpm sections`, which regenerates `apps/$0/SECTIONS.md`.
- Never touch `packages/tracking/`, `packages/forms/`, `packages/ui-core/`, `.github/` or
  another brand. If the section needs a change there, stop and say a developer must do it.
- No social proof: if the section is for quotes or logos, its schema must force a visible
  placeholder label until real, approved content exists.

Steps:

1. Read `packages/brand-$0/src/schemas.ts`, `packages/brand-$0/src/registry.ts` and two
   existing components in `packages/brand-$0/src/sections/` to match structure and tokens.
2. Branch: if on `main`, `git switch -c section/<type>`; otherwise stay on the current branch.
3. **Schema.** In `schemas.ts`, add `export const <type> = defineSection({...})` with `type`,
   `title`, `description`, `useWhen`, a `.strict()` Zod object using the shared helpers
   (`text`, `cta`, `icon`, `anchor`) with sensible limits, and a complete `example`. Add it
   to `sectionDefinitions`.
4. **Component.** Create `packages/brand-$0/src/sections/$1.astro`. Build it from
   `@platform/ui-core` primitives (`Section`, `Container`, `Heading` level 2, `Button`, `Icon`)
   and the brand's semantic tokens. Accessible: semantic HTML, alt text or `aria-hidden` on
   decoration, visible focus, `aria-labelledby` on the section.
5. **Register** it in `registry.ts`.
6. **Test.** Create `packages/brand-$0/test/<type>.test.ts` with at least one valid case (the
   example) and one invalid case the schema must reject.
7. Run `pnpm sections` (updates `apps/$0/SECTIONS.md`), then `pnpm verify $0`.
8. Commit, push and open the PR as in `/new-landing-page` step 9. Title:
   `$0: new section $1 (needs developer review)`.
