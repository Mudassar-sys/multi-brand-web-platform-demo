# Multi-brand web platform demo

**What this demo proves:** two non-developers can edit pages and launch new landing pages
through an AI coding session, with preview links and one-click rollback, on one Astro
monorepo that serves several brands from separate Vercel projects, with shared tracking,
shared forms and automated checks on every pull request.

Both brands are fictional and marked "Demo brand" in their footers.

| | Link |
| --- | --- |
| Kestrel Machine Co. (live) | https://kestrel-demo-pi.vercel.app |
| Paintline Murals (live) | https://paintline-demo.vercel.app |
| Sample landing page PR made by `/new-landing-page` | [PR 5](../../pull/5) (live page: https://kestrel-demo-pi.vercel.app/lp/open-house-demo-day) |
| Tracking proof (previews) | [proof/14-preview-tracking-checks.txt](./proof/14-preview-tracking-checks.txt) |
| Proof screenshots | [proof/](./proof) |
| Owner guide | [docs/OWNER-RUNBOOK.md](./docs/OWNER-RUNBOOK.md) |

## The owner loop in 7 steps

1. **Ask.** In a coding session on this repo, type
   `/new-landing-page kestrel "Open House Demo Day"` and paste the copy.
2. **Built from blocks.** The page is written as YAML using only that brand's approved
   sections ([apps/kestrel/SECTIONS.md](./apps/kestrel/SECTIONS.md)). Invalid data fails the build.
3. **Pull request.** The assistant runs `pnpm verify kestrel`, pushes a branch and opens a PR.
4. **Preview.** Vercel posts a preview link on the PR. Forms there go to the TEST list and
   show a demo receipt. Every preview check asserts that no Google Ads conversion request is
   sent ([proof](./proof/14-preview-tracking-checks.txt)).
5. **Checks.** `ci` (build, page rules, unit tests, link check) and `preview-checks/<brand>`
   (Playwright on the real preview) must pass. A brand the PR does not touch is reported
   "not affected" automatically.
6. **Merge.** Merging publishes the page. Vercel Deployment Checks test the production build
   before the live domain moves to it.
7. **Roll back.** One click on **Instant Rollback** in Vercel; **Undo Rollback** after the fix.

## Architecture in one screen

```
apps/kestrel, apps/paintline         Astro 7 sites, pages as YAML, one Vercel project each
packages/ui-core                     primitives, page renderer, base layout
packages/brand-kestrel|paintline     design tokens (@theme) + section library (Zod + component)
packages/tracking   (protected)      dataLayer + site_env, consent mode v2 defaults, GTM,
                                     click-ID and UTM capture, generate_lead after server OK
packages/forms      (protected)      lead endpoint (Vercel Function), honeypot + time trap,
                                     ActiveCampaign / MailerLite adapters, dry-run receipts,
                                     test lists on previews, 10 MB Blob client uploads
packages/config                      redirects converter (Webflow CSV to 301s), sitemap, tsconfig
tests/                               Playwright: tracking, forms, uploads, redirects, SEO
.github/workflows                    ci, preview-checks, production-checks
```

GA4 and Google Ads tags load through a GTM container once its ID is set on each Vercel project
([docs/GTM-SETUP.md](./docs/GTM-SETUP.md)). No container is connected in this demo yet, so the
sites currently send no Google tag requests at all.

Details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md). Tag setup for a real container:
[docs/GTM-SETUP.md](./docs/GTM-SETUP.md). Every technical claim and its official source:
[docs/SOURCES.md](./docs/SOURCES.md).

## Run it locally

Requirements: Node 24 (`.nvmrc`) and pnpm 10 (pinned in `package.json`).

```sh
pnpm install
pnpm dev:kestrel            # http://localhost:4321
pnpm dev:paintline
pnpm verify kestrel         # what CI runs for one brand
pnpm sections               # regenerate SECTIONS.md after a schema change
BASE_URL=https://kestrel-demo-pi.vercel.app EXPECTED_SITE_ENV=production pnpm e2e -- --project=kestrel
```

Forms run in dry-run mode by default: the endpoint returns the exact provider request, with
secrets redacted, instead of sending it. Set `FORMS_MODE=live` and the provider secrets on a
Vercel project to send for real.
