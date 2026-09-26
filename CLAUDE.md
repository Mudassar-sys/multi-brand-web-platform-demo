# Multi-brand web platform (demo)

One GitHub repo, one Astro site per brand, one Vercel project per brand. The owners
change pages and launch landing pages; shared tracking, forms and CI are developer-owned.

## Repo map

- `apps/<brand>/` one site per brand (`kestrel`, `paintline`)
  - `src/content/pages/**/*.yaml` one file per page. The file path is the URL:
    `index.yaml` is `/`, `lp/spring-demo.yaml` is `/lp/spring-demo`.
  - `SECTIONS.md` the only sections a page may use, with every field (generated, read it first)
  - `CLAUDE.md` brand voice, audience and page conventions
  - `brand.config.ts` nav, consent regions, forms provider (developer review)
  - `redirects.csv` legacy URLs in Webflow export format (301s)
- `packages/brand-<brand>/` that brand's sections (Zod schema + component) and design tokens
- `packages/ui-core/` primitives, page renderer, base layout
- `packages/tracking/` and `packages/forms/` PROTECTED: GTM, consent, click IDs, lead endpoint, uploads
- `packages/config/` shared config and the redirects converter (converter is PROTECTED)
- `tests/` Playwright checks that run against every Vercel preview
- `docs/OWNER-RUNBOOK.md` plain-language guide for the owners

## Golden rules

1. Change a page by editing its YAML. Never edit components to change copy.
2. Use only section types and fields listed in that brand's `SECTIONS.md`. If a request needs a
   new section, use `/new-section` and say it needs developer review.
3. Never edit `packages/tracking/`, `packages/forms/`, `.github/`, `.claude/settings.json`,
   `.claude/hooks/` or `packages/config/src/redirects.mjs`. They are blocked. If a request needs
   them, stop and tell the owner a developer must make that change.
4. Never write API keys, tokens or passwords into files, commits, PRs or chat.
5. Never invent testimonials, reviews, client logos, ratings or statistics. If copy needs one,
   write `[Placeholder: ...]` so it is obvious.
6. Work on a branch, never on `main`. Run `pnpm verify <brand>` before every push.
7. No em dashes in copy. Use a hyphen or rewrite the sentence.

## Owner workflow

1. `/new-landing-page <brand> "<title>" [copy]` or `/new-page ...` or plain requests like
   "change the hero heading on the kestrel contact page".
2. The skill writes the YAML, runs `pnpm verify <brand>`, commits, pushes and opens a PR.
3. Vercel posts a preview link on the PR. `preview-checks/<brand>` runs Playwright on it.
4. When `ci` and both `preview-checks/*` are green, the owner merges. Production builds and
   Vercel Deployment Checks test it before the live domain moves.
5. `/check <brand>` explains any failing check in plain language. `/ship` pushes and opens
   the PR for changes made by hand.

## Rolling back

Vercel dashboard > the brand's project > Deployments > the previous production deployment >
menu > **Instant Rollback**. The old version is live within seconds.

After a rollback, new merges to `main` do **not** go live automatically. Fix the problem with a
normal PR, merge it, then undo the rollback: Overview > yellow "To undo the rollback" bar >
**Manage** > select the deployment to promote > **Confirm** (or promote the new deployment). Until then the
rolled-back version stays live. See `docs/OWNER-RUNBOOK.md`.

## Commands

- `pnpm install` once per checkout
- `pnpm dev:kestrel` / `pnpm dev:paintline` local preview at http://localhost:4321
- `pnpm verify <brand>` everything CI runs for one brand (catalog, build, types, unit tests)
- `pnpm sections` regenerate every `SECTIONS.md` after a section schema change
- `BASE_URL=<preview url> pnpm e2e -- --project=<brand>` Playwright against a deployment
