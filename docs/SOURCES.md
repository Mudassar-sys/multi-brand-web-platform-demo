# Sources

Every technical decision in this repository was checked against official vendor documentation
on **26 Sep 2026**, each page opened in its own new Chrome tab. Rows are
`claim | official URL | date checked`. Official domains used: docs.astro.build,
github.com/withastro, tailwindcss.com, pnpm.io, turborepo.dev, vercel.com/docs,
code.claude.com/docs, docs.github.com, playwright.dev, developers.google.com,
support.google.com, developers.activecampaign.com, developers.mailerlite.com,
help.webflow.com, github.com/lycheeverse, plus the vendors' own GitHub repositories where the
documentation links to them (github.com/vercel, github.com/actions, github.com/pnpm).

The last section lists behaviour observed on the live deployments during the build. Those are
measurements with their evidence, not documentation claims.

## Checked during the build

| Claim | Official URL | Checked |
| --- | --- | --- |
| Since v10, pnpm does not run dependency lifecycle scripts unless they are allowed | https://pnpm.io/10.x/settings | 2026-09-26 |
| allowBuilds (added in pnpm v10.26.0) replaces onlyBuiltDependencies and ignoredBuiltDependencies, which are deprecated | https://pnpm.io/10.x/settings | 2026-09-26 |
| allowBuilds is a map of package matchers to true or false in pnpm-workspace.yaml | https://pnpm.io/10.x/settings | 2026-09-26 |
| The repository-dispatch status action sets a commit status for the ref of the deployment that sent the event | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| repository_dispatch events always run with GITHUB_SHA set to the last commit on the default branch, so checkout must use the deployment SHA | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| The status action has inputs name (optional) and github_token (defaults to the workflow token) and runs main and post steps on node24 | https://raw.githubusercontent.com/vercel/repository-dispatch/main/actions/status/action.yaml | 2026-09-26 |
| vercel.deployment.ready means the deployment finished building but was not promoted to production | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| The dispatch payload carries environment, git.ref, git.sha, id, project.name, state and url | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| Latest release of actions/upload-artifact is v7.0.1 | https://github.com/actions/upload-artifact/releases | 2026-09-26 |
| Latest release of actions/checkout is v7.0.1 | https://github.com/actions/checkout/releases | 2026-09-26 |
| Latest release of actions/setup-node is v7.0.0 | https://github.com/actions/setup-node/releases | 2026-09-26 |
| Latest release of pnpm/action-setup is v6.1.0 | https://github.com/pnpm/action-setup/releases | 2026-09-26 |
| Latest release of lycheeverse/lychee-action is v2.9.0 | https://github.com/lycheeverse/lychee-action/releases | 2026-09-26 |
| Turborepo reads TURBO_SCM_BASE to override the base ref used by --affected | https://turborepo.dev/docs/reference/run | 2026-09-26 |
| locator.innerText() returns the element innerText, and the docs recommend expect(locator).toHaveText() for asserting text | https://playwright.dev/docs/api/class-locator | 2026-09-26 |
| toHaveText and toContainText accept a string or a RegExp as the expected value | https://playwright.dev/docs/api/class-locatorassertions | 2026-09-26 |
| expect(locator).not makes an assertion check for the opposite condition | https://playwright.dev/docs/api/class-locatorassertions | 2026-09-26 |
| Rebase and merge adds each commit of the head branch onto the base branch individually, without a merge commit | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github | 2026-09-26 |
| test.skip(condition, description) marks the test skipped when the condition is true; Playwright aborts it at that call, and the docs recommend passing a description | https://playwright.dev/docs/api/class-test | 2026-09-26 |
| page.waitForRequest and page.waitForResponse take a URL, RegExp or predicate, and wait 30 seconds by default | https://playwright.dev/docs/api/class-page | 2026-09-26 |
| request.response() resolves to null when no response was received due to an error; request.failure() is null unless the request failed (the requestfailed event) | https://playwright.dev/docs/api/class-request | 2026-09-26 |
| HTTP error responses such as 404 still complete with requestfinished; only network-level failures emit requestfailed | https://playwright.dev/docs/api/class-request | 2026-09-26 |
| response.status() returns the HTTP status code of the response, and response.url() its URL | https://playwright.dev/docs/api/class-response | 2026-09-26 |
| expect.poll turns a synchronous expect into a polling one, with an optional message and a timeout that defaults to 5 seconds | https://playwright.dev/docs/test-assertions | 2026-09-26 |
| The conversion linker tag detects ad click information in landing page URLs and stores it in first-party cookies and local storage on your domain | https://support.google.com/tagmanager/answer/7549390 | 2026-09-26 |
| Google's CSP guide lists the same Google Ads hosts for "a Google Ads Conversion, Remarketing, or Conversion Linker tag" | https://developers.google.com/tag-platform/security/guides/csp | 2026-09-26 |
| GTM containers can be exported as JSON, stored in version control and imported back into Tag Manager | https://support.google.com/tagmanager/answer/6106997 | 2026-09-26 |
| Import is under Admin > Import Container: choose the file, a new or existing workspace, then Overwrite or Merge; Overwrite replaces all tags, triggers and variables | https://support.google.com/tagmanager/answer/6106997 | 2026-09-26 |

## Google endpoints matched by the tracking tests

Every URL pattern in `tests/lib/google-tags.ts` and `ADS_REQUEST` in `tests/lib/brands.ts`.
`www.google.com` is deliberately not matched: Google's CSP guide lists it for Tag Manager and
for Google Ads alike, so it cannot tell an Ads hit from GTM traffic.

| Endpoint the test matches | Where | Source | Checked |
| --- | --- | --- | --- |
| `<GTM host>/gtm.js?id=<container ID>`, default host `https://www.googletagmanager.com` | Strict GTM check: waits for this response and requires status 200 | https://support.google.com/tagmanager/answer/14847097 (install snippet) | 2026-09-26 |
| Any `https://*.google-analytics.com/` URL (`GA4_HIT`) | Strict GA4 check: at least one request after Accept all | https://developers.google.com/tag-platform/security/guides/csp (Google Analytics section: img-src and connect-src must allow `https://*.google-analytics.com`) | 2026-09-26 |
| `https://www.googletagmanager.com/gtag/js?id=<tag ID>` (part of `GOOGLE_TAG_REQUEST`) | Strict GA4 check: one of the URLs searched for the Measurement ID | https://developers.google.com/tag-platform/gtagjs/install (install snippet loads `gtag/js?id=TAG_ID`) | 2026-09-26 |
| `www.googleadservices.com` (host) | **No longer matched by host alone** (decision below). Its conversion path `/pagead/conversion/<id>/` is matched | https://developers.google.com/tag-platform/security/guides/csp (the Google Ads section lists `https://www.googleadservices.com` for "a Google Ads Conversion, Remarketing, or Conversion Linker tag", so the host is not conversion-only) | 2026-09-26 |
| `googleads.g.doubleclick.net` (host) | No longer matched by host alone. Its path `/pagead/viewthroughconversion/<id>/` is matched | https://developers.google.com/tag-platform/security/guides/csp (Google Ads section lists `https://googleads.g.doubleclick.net`) | 2026-09-26 |
| `/pagead/conversion/`, `/pagead/viewthroughconversion/` and `/pagead/1p-conversion/` paths (`ADS_REQUEST`) | Preview check: no Google Ads conversion requests | **Not in official docs.** Live observation: after `generate_lead` with `site_env` production (a local production-mode build), the Ads tag sent `www.googleadservices.com/pagead/conversion/16832482446/`, `googleads.g.doubleclick.net/pagead/viewthroughconversion/16832482446/` and `www.google.com/pagead/1p-conversion/16832482446/` ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)) | 2026-09-26 |
| Any request URL that contains the Ads Conversion ID (`adsConversionId` in `tests/tracking-expectations.json`) | Preview check: no Google Ads requests | **Not in official docs.** Live observation: every Ads request seen carried the ID, including `www.google.com/pagead/1p-conversion/<id>/` and the loader `www.googletagmanager.com/gtag/destination?id=AW-<id>`, which the host patterns above do not match ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)) | 2026-09-26 |
| Not matched: `www.googleadservices.com/pagead/set_partitioned_cookie` | Decision: not an Ads conversion request, so the preview check was narrowed from whole Ads hosts to conversion paths (this request failed the first run of PR #9 on both previews) | **Not in official docs.** Live observation: sent right after Accept all on a landing page that has a `gclid`, before any lead, with the click ID in its query and no Conversion ID or label ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)). The Conversion Linker stores ad click information from landing page URLs (https://support.google.com/tagmanager/answer/7549390), and the CSP guide lists this host for Conversion Linker tags too (https://developers.google.com/tag-platform/security/guides/csp) | 2026-09-26 |
| Not matched: `/ccm/collect` on `pagead2.googlesyndication.com`, `www.google.com` and `ad.doubleclick.net` | Decision: not an Ads conversion request | **Not in official docs.** Live observation: the Google tag sends these on page load and after Accept all, before any lead, on previews and on a local production-mode build alike, with no Conversion ID or label in the URL ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)). The CSP guide lists these hosts for GA4 advertising features and Google Ads in general | 2026-09-26 |
| `google.com/ads/ga-audiences` | Preview check: no Google Ads requests | **Not in official docs.** Live observation: not sent on any run with the container connected (a local production-mode build and both previews), so the check was left as it is ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)) | 2026-09-26 |
| The GA4 Measurement ID inside the GA4 hit URL | Strict GA4 check: a `*.google-analytics.com` request must contain the ID | **Not in official docs** for a GTM setup (the gtag.js page documents the `id` parameter only for a direct install). Live observation: GTM loaded `www.googletagmanager.com/gtag/js?id=G-RJ492TFLKD`, and every `www.google-analytics.com/g/collect` hit carried the ID in its `tid` parameter ([proof/13-tracking-network.txt](../proof/13-tracking-network.txt)) | 2026-09-26 |
| `gtm.js` returns 404 for a container ID that does not exist | Why a status 200 check proves the container is real | **Not in official docs.** Live observation: `GTM-ZZZZZZZ` returned 404, and the strict check failed on it ([proof/15-strict-tracking-check.txt](../proof/15-strict-tracking-check.txt)) | 2026-09-26 |
| In Chromium that 404 script response is blocked as `net::ERR_BLOCKED_BY_ORB`, so the page gets no response event, only requestfailed | Why the strict check waits for the gtm.js request and reads `request.response()` and `request.failure()` | **Not in official docs.** Live observation: Playwright Chromium against a local build with `PUBLIC_GTM_ID=GTM-ZZZZZZZ` ([proof/15-strict-tracking-check.txt](../proof/15-strict-tracking-check.txt)) | 2026-09-26 |

## Observed on the live deployments (evidence, not documentation)

| Observation | Evidence | Date |
| --- | --- | --- |
| With the Vercel adapter, Astro `redirects` are emitted as routes with status 301 | `apps/*/.vercel/output/config.json` after `astro build`; `curl -I https://kestrel-demo-pi.vercel.app/en/contact` returns 301 | 2026-09-26 |
| `trailingSlash: 'never'` on Vercel: `/contact/` returns 308 to `/contact`; `/contact` returns 200 | adapter route `^/(.*)/$` status 308 in config.json; live curl; `tests/specs/seo-redirects.spec.ts` on every preview | 2026-09-26 |
| New Vercel projects had "Skip deployments when there are no changes to the root directory or its dependencies" enabled | Project Settings > Build and Deployment > Root Directory, both projects | 2026-09-26 |
| A paintline-only PR produced no Kestrel build: the Kestrel check read "Skipped - Not affected" | PR #1 checks, `proof/02-paintline-only-pr-kestrel-skipped.jpg` | 2026-09-26 |
| A shared-package PR built and tested both brands | PR #2 checks, `proof/11b-shared-package-pr-both-brands-checked.jpg` | 2026-09-26 |
| New Hobby projects had Vercel Authentication (Standard Protection) on for previews; it was switched off for this demo | Project Settings > Deployment Protection | 2026-09-26 |
| Vercel names GitHub deployment environments as Preview or Production, a dash and the project name (not documented by Vercel, so the workflow matches the project name) | PR #2 timeline and the `deployment_status` payload in the preview-checks run log | 2026-09-26 |
| `.vercel.app` subdomains are unique across Vercel: `kestrel-demo.vercel.app` was already in use, so Vercel assigned `kestrel-demo-pi.vercel.app` to the project | `vercel alias ls` | 2026-09-26 |
| The Deployment Checks section (with Add Checks) is present in the project settings on the Hobby plan | Project Settings > Build and Deployment > Deployment Checks | 2026-09-26 |
| A private Blob client upload of 9 MB succeeded and 11 MB was refused both by the browser check and by the Blob token | `preview-checks/paintline` runs on PR #2 (tests `upload.spec.ts`) | 2026-09-26 |
| A fresh cloud session on this repository loaded `/new-landing-page` from `.claude/skills`, wrote the page, passed `pnpm verify kestrel`, pushed its session branch and opened PR #5 | `proof/04a-cloud-session-runs-new-landing-page.jpg`, PR #5 | 2026-09-26 |
| In a cloud session the committed deny rule `Edit(/packages/tracking/**)` blocked an edit with "File is in a directory that is denied by your permission settings." | `proof/guardrail-block.txt`, `proof/06-guardrail-block.jpg` | 2026-09-26 |
| The PreToolUse hook from `.claude/settings.json` runs in cloud sessions | cloud session transcript for PR #5 | 2026-09-26 |
| The production deployment of the landing page reported one Deployment Check passed before and after the rollback test | `proof/09b-undo-rollback-landing-deploy-production-checks-passed.jpg` | 2026-09-26 |
| On the Hobby plan the Instant Rollback dialog only offers the previous production deployment ("Upgrade to Pro to roll back to an earlier deployment") | `proof/08a-instant-rollback-dialog.jpg` | 2026-09-26 |
| The rollback confirmation states that production deployments are not automatically promoted until the rollback is removed | `proof/08b-rollback-confirm-no-auto-promote-note.jpg` | 2026-09-26 |
| The dashboard undoes a rollback from Overview > "To undo the rollback" > Manage > Manage Rollback > Confirm (promotes the selected deployment) | `proof/09a-undo-rollback-dialog.jpg` | 2026-09-26 |
| After Instant Rollback the landing page returned 404 in production within seconds, and 200 again after the undo | `proof/08d-after-rollback-landing-page-404.jpg`, `proof/09c-after-undo-landing-page-back.jpg` | 2026-09-26 |

## Astro, Tailwind CSS, pnpm and Turborepo


### Versions

| Claim | Official URL | Checked |
| --- | --- | --- |
| The latest astro release on GitHub is astro@7.3.5 and it carries the Latest label | https://github.com/withastro/astro/releases | 2026-09-26 |
| packages/astro/package.json on main declares version 7.3.5 | https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json | 2026-09-26 |
| astro 7.3.5 declares engines node >=22.12.0, npm >=9.6.5 and pnpm >=7.1.0 | https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json | 2026-09-26 |
| astro 7.3.5 depends on vite ^8.0.13 and zod ^4.5.4 | https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json | 2026-09-26 |
| astro 7.3.5 exports the subpaths ./zod, ./loaders and ./config | https://raw.githubusercontent.com/withastro/astro/main/packages/astro/package.json | 2026-09-26 |
| The latest @astrojs/vercel release on GitHub is 11.0.11 | https://github.com/withastro/astro/releases | 2026-09-26 |
| @astrojs/vercel 11.0.11 has peerDependency astro ^7.0.0 | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/package.json | 2026-09-26 |
| The @astrojs/vercel docs page header shows v11.0.11 | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| @astrojs/sitemap on main is version 3.7.4 | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/sitemap/package.json | 2026-09-26 |
| The @astrojs/sitemap docs page header shows v3.7.4 | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| @astrojs/check on main is version 0.9.10 with bin astro-check | https://raw.githubusercontent.com/withastro/astro/main/packages/language-tools/astro-check/package.json | 2026-09-26 |
| @astrojs/check 0.9.10 has peerDependency typescript ^5.0.0 or ^6.0.0 | https://raw.githubusercontent.com/withastro/astro/main/packages/language-tools/astro-check/package.json | 2026-09-26 |
| The astro@7.3.4 release notes say astro check does not currently support TypeScript 7 | https://github.com/withastro/astro/releases | 2026-09-26 |
| The latest Tailwind CSS release on GitHub is v4.3.3, dated Jul 16 2026 (final URL releases/tag/v4.3.3) | https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.3.3 | 2026-09-26 |
| The Tailwind docs site shows version v4.3 | https://tailwindcss.com/docs/installation/framework-guides/astro | 2026-09-26 |
| The pnpm docs are versioned 12.x | https://pnpm.io/installation | 2026-09-26 |
| pnpm docs state pnpm 12 is the current release line and the npm latest tag points at it | https://pnpm.io/installation | 2026-09-26 |
| On the pnpm GitHub releases page the Latest label is on pnpm 12.6 (Sep 22 2026) | https://github.com/pnpm/pnpm/releases | 2026-09-26 |
| A pnpm 12.7 release exists dated Sep 25 2026 | https://github.com/pnpm/pnpm/releases/tag/v12.7.0 | 2026-09-26 |
| A pnpm 11.28 release (tag v11.28.0) is listed on the releases and tags pages | https://github.com/pnpm/pnpm/tags | 2026-09-26 |
| A pnpm 10.34.5 release exists dated Jul 10 2026 | https://github.com/pnpm/pnpm/releases/tag/v10.34.5 | 2026-09-26 |
| (probe) The release tags v10.34.6 and v10.35.0 return GitHub 404, so 10.34.5 is the newest 10.x found | https://github.com/pnpm/pnpm/releases/tag/v10.35.0 | 2026-09-26 |
| The latest Turborepo release is v2.11.4 with the Latest label, dated Sep 25 2026 | https://github.com/vercel/turborepo/releases | 2026-09-26 |

### Astro install and Node

| Claim | Official URL | Checked |
| --- | --- | --- |
| Astro requires Node.js v22.12.0 or higher | https://docs.astro.build/en/install-and-setup/ | 2026-09-26 |
| Odd-numbered Node.js versions such as v23 are not supported by Astro | https://docs.astro.build/en/install-and-setup/ | 2026-09-26 |
| Astro must be installed locally in the project, not globally | https://docs.astro.build/en/install-and-setup/ | 2026-09-26 |
| The Astro config file astro.config.mjs exports defineConfig imported from astro/config | https://docs.astro.build/en/install-and-setup/ | 2026-09-26 |

### Astro configuration reference

| Claim | Official URL | Checked |
| --- | --- | --- |
| site is the full deployed URL and Astro uses it to generate the sitemap and canonical URLs | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| trailingSlash accepts always, never or ignore and defaults to ignore | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| trailingSlash only governs the dev server and on-demand rendered pages | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| Trailing-slash redirects in production are 301 for GET requests and 308 for all other methods | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| Trailing slashes on prerendered pages are handled by the hosting platform, not by Astro redirects | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| redirects can map static and dynamic routes but only to the same kind of route | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| A dynamic redirect is written as '/blog/[...slug]': '/articles/[...slug]' | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| A redirect value can be an object with status and destination to set a custom status code | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| A static site with no adapter gets meta refresh redirects that do not support status codes | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| With SSR or a static adapter in output static mode, redirected GET requests get 301 and other methods 308 | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| output accepts static or server and defaults to static | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| build.format accepts file, directory or preserve, defaults to directory, and may be set by an adapter | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| The docs recommend trailingSlash always with build.format directory and never with file | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| build.redirects defaults to true, applies only to static output, and is mainly for adapters | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| security.checkOrigin defaults to true and returns 403 on origin mismatch for on-demand POST, PATCH, DELETE and PUT form content types | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| compressHTML defaults to 'jsx' since Astro v7.0 | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |
| session can be set to false since Astro v7.2.0 to drop the session runtime from the SSR bundle | https://docs.astro.build/en/reference/configuration-reference/ | 2026-09-26 |

### Vercel adapter (docs)

| Claim | Official URL | Checked |
| --- | --- | --- |
| The Vercel adapter is imported as import vercel from '@astrojs/vercel' and used as adapter: vercel() | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| A static Astro site only needs the Vercel adapter when using extra Vercel services such as Web Analytics or Image Optimization | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| The adapter option skewProtection was added in @astrojs/vercel 7.6.0 and needs a Vercel Pro or Enterprise account | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| ISR function requests do not include search params | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| The adapter option maxDuration sets the serverless function timeout in seconds | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| The adapter option middlewareMode 'edge' deploys Astro middleware as an edge function | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| The adapter docs defer Node.js version support to the Vercel project settings Node.js Version section | https://docs.astro.build/en/guides/integrations-guide/vercel/ | 2026-09-26 |
| The Astro Vercel deployment guide says a static Astro site needs no extra configuration and Vercel auto-detects Astro | https://docs.astro.build/en/guides/deploy/vercel/ | 2026-09-26 |

### Vercel adapter (source code, main branch)

| Claim | Official URL | Checked |
| --- | --- | --- |
| (source code) The adapter calls updateConfig with build.format 'directory' and build.redirects false | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter maps Astro trailingSlash always to Vercel true, never to false, and ignore to unset in .vercel/output/config.json | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter writes Astro redirects into the Vercel config.json routes through getRedirects | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter logs an error when vercel.json trailingSlash conflicts with the Astro trailingSlash setting in server output | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter lists Node 20 and 22 as available, 24 as default and 18 as deprecated, and falls back to nodejs24.x for an unlisted local major | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The function runtime is derived from the Node major version running the build | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter declares envGetSecret and hybridOutput as stable features | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) skewProtection defaults to true when VERCEL_SKEW_PROTECTION_ENABLED equals '1' | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |
| (source code) The adapter emits cache-control public, max-age=31536000, immutable for the /_astro/ assets folder | https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/vercel/src/index.ts | 2026-09-26 |

### Content collections

| Claim | Official URL | Checked |
| --- | --- | --- |
| Build-time collections are defined in src/content.config.ts, and .js and .mjs are also supported | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| defineCollection is imported from astro:content | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| The glob and file loaders are imported from astro/loaders | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| z is imported from astro/zod, a re-export supporting all features of Zod 4 | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| The documented named imports from astro:content do not include z | https://docs.astro.build/en/reference/modules/astro-content/ | 2026-09-26 |
| The glob() loader supports Markdown, MDX, Markdoc, JSON, YAML and TOML files | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| glob() accepts pattern, base, generateId, retainBody and deferRender | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| The glob pattern is a string or string array relative to the base directory | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| The glob base is a relative path or URL and defaults to "." | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| The default generateId uses github-slugger to produce kebab-cased ids | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| A slug property in frontmatter or a JSON data object overrides the generated id and may contain slashes | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| Default glob ids convert uppercase letters to lowercase | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| A glob entry id includes the full nested path, so id.startsWith('en/') filters a subdirectory | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| Ids containing a slash need a rest parameter route such as [...id].astro | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| The file() loader fileName is relative to the project root directory | https://docs.astro.build/en/reference/content-loader-reference/ | 2026-09-26 |
| A collection schema is a ZodType or a function receiving SchemaContext that includes image() | https://docs.astro.build/en/reference/modules/astro-content/ | 2026-09-26 |
| If any file violates its collection schema Astro reports an error | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| The error reference entry "Content entry data does not match schema" names the file and failing fields | https://docs.astro.build/en/reference/errors/invalid-content-entry-data-error/ | 2026-09-26 |
| getCollection sort order is non-deterministic, so entries must be sorted manually | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| getEntry returns a Promise of the entry or undefined | https://docs.astro.build/en/reference/modules/astro-content/ | 2026-09-26 |
| render() is imported from astro:content and returns Content, headings and remarkPluginFrontmatter | https://docs.astro.build/en/reference/modules/astro-content/ | 2026-09-26 |
| Astro writes JSON Schema files per collection to .astro/collections/ | https://docs.astro.build/en/guides/content-collections/ | 2026-09-26 |
| Zod documents z.discriminatedUnion with a discriminator key and an array of z.object schemas | https://zod.dev/api#discriminated-unions | 2026-09-26 |

### Endpoints and on-demand rendering

| Claim | Official URL | Checked |
| --- | --- | --- |
| The APIRoute type is imported from "astro" and used with satisfies APIRoute | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| An endpoint exports a function named after the HTTP method, such as POST, and ALL as a fallback | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| In static mode each server endpoint must opt out with export const prerender = false | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| In static mode a prerendered endpoint only has access to request.url | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| The POST example checks Content-Type then calls await request.json() | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| A request with no matching method export redirects to the site 404 page | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| If GET is defined but HEAD is not, Astro answers HEAD by calling GET and stripping the body | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| Endpoints whose URL has a file extension are only reachable without a trailing slash | https://docs.astro.build/en/guides/endpoints/ | 2026-09-26 |
| The forms-with-API-routes recipe reads the body with await request.formData() and data.get('name') | https://docs.astro.build/en/recipes/build-forms-api/ | 2026-09-26 |
| On-demand rendering in static output needs an adapter plus export const prerender = false on the route | https://docs.astro.build/en/guides/on-demand-rendering/ | 2026-09-26 |
| output 'server' only flips the default and pages can opt back in with prerender = true | https://docs.astro.build/en/guides/on-demand-rendering/ | 2026-09-26 |

### Environment variables

| Claim | Official URL | Checked |
| --- | --- | --- |
| Vite environment variables are statically replaced at build time | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| Only variables prefixed PUBLIC_ are available in client-side code | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| .env files are not loaded inside configuration files; use process.env or Vite loadEnv there | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| pnpm projects must install vite directly to use loadEnv | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| With SSR most adapters expose runtime variables through process.env | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| env.schema uses envField.string, number, boolean or enum with context client or server and access public or secret | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| Schema variables are imported from astro:env/client or astro:env/server | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| context client with access secret is not supported | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| Secrets are validated whenever anything is imported from astro:env/server, so builds may need dummy values | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| validateSecrets: true validates secrets on start | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| astro:env cannot be used in astro.config.mjs or in client scripts | https://docs.astro.build/en/guides/environment-variables/ | 2026-09-26 |
| getSecret() from astro:env/server is implemented by the adapter and defaults to process.env in dev and build | https://docs.astro.build/en/reference/modules/astro-env/ | 2026-09-26 |

### Sitemap

| Claim | Official URL | Checked |
| --- | --- | --- |
| The sitemap integration is import sitemap from '@astrojs/sitemap' with integrations: [sitemap()] | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| The sitemap integration requires site to be set and to begin with http:// or https:// | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| The build outputs sitemap-index.xml and sitemap-0.xml | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| filter receives the full page URL including the site domain and returns true to include | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| The sitemap cannot generate entries for dynamic routes in SSR mode | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |
| entryLimit defaults to 45000 and filenameBase defaults to sitemap | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | 2026-09-26 |

### CLI and type checking

| Claim | Official URL | Checked |
| --- | --- | --- |
| astro check exits with code 1 when errors are found and is intended for CI | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| astro check runs astro sync first unless --noSync is passed | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| astro check --minimumFailingSeverity defaults to error | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| astro sync writes .astro/types.d.ts and defines astro:content, astro:env and astro:actions | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| astro dev, astro build and astro check all run sync | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| The ASTRO_TELEMETRY_DISABLED environment variable disables telemetry in CI | https://docs.astro.build/en/reference/cli-reference/ | 2026-09-26 |
| astro build does not type check and the docs suggest "astro check && astro build" | https://docs.astro.build/en/guides/typescript/ | 2026-09-26 |
| The recommended tsconfig includes .astro/types.d.ts and **/* and excludes dist | https://docs.astro.build/en/guides/typescript/ | 2026-09-26 |

### Tailwind CSS v4

| Claim | Official URL | Checked |
| --- | --- | --- |
| Tailwind with Astro is installed as tailwindcss plus @tailwindcss/vite | https://tailwindcss.com/docs/installation/framework-guides/astro | 2026-09-26 |
| The Vite plugin is added in astro.config.mjs as vite: { plugins: [tailwindcss()] } | https://tailwindcss.com/docs/installation/framework-guides/astro | 2026-09-26 |
| The stylesheet src/styles/global.css contains @import "tailwindcss" and is imported in page frontmatter | https://tailwindcss.com/docs/installation/framework-guides/astro | 2026-09-26 |
| Tailwind scans all files except .gitignore entries, node_modules, binaries, CSS files and lock files | https://tailwindcss.com/docs/detecting-classes-in-source-files | 2026-09-26 |
| @source paths are relative to the stylesheet | https://tailwindcss.com/docs/detecting-classes-in-source-files | 2026-09-26 |
| Source detection starts from the current working directory unless source("../src") is set on the import | https://tailwindcss.com/docs/detecting-classes-in-source-files | 2026-09-26 |
| @source not ignores paths, source(none) disables auto detection, and @source inline() safelists classes | https://tailwindcss.com/docs/detecting-classes-in-source-files | 2026-09-26 |
| Theme namespaces include --color-*, --font-*, --text-*, --font-weight-*, --radius-*, --shadow-*, --spacing-*, --breakpoint-* and --container-* | https://tailwindcss.com/docs/theme | 2026-09-26 |
| @theme variables must be top-level and not nested under selectors or media queries | https://tailwindcss.com/docs/theme | 2026-09-26 |
| Setting a namespace such as --color-*: initial removes all default values in it | https://tailwindcss.com/docs/theme | 2026-09-26 |
| @theme inline is required when a theme variable references another variable | https://tailwindcss.com/docs/theme | 2026-09-26 |

### pnpm

| Claim | Official URL | Checked |
| --- | --- | --- |
| A pnpm workspace must have pnpm-workspace.yaml in its root | https://pnpm.io/workspaces | 2026-09-26 |
| "workspace:*" references a local workspace package and is replaced with the real version on publish | https://pnpm.io/workspaces | 2026-09-26 |
| The workspace: protocol refuses to resolve to anything other than a local workspace package | https://pnpm.io/workspaces | 2026-09-26 |
| pnpm-workspace.yaml packages takes globs with ! exclusions and the root package is always included | https://pnpm.io/settings | 2026-09-26 |
| pnpm reads the workspace list from pnpm-workspace.yaml, not from package.json workspaces | https://pnpm.io/settings | 2026-09-26 |
| Only auth and registry settings are read from .npmrc; other settings go in pnpm-workspace.yaml | https://pnpm.io/settings | 2026-09-26 |
| Since v11 pnpm no longer reads settings from the pnpm field of package.json | https://pnpm.io/package_json | 2026-09-26 |
| pnpm 12 installed via npm requires Node.js 22.13 or newer | https://pnpm.io/installation | 2026-09-26 |
| The compatibility table shows pnpm 11 unsupported on Node 18 and 20, and pnpm 10 supported on Node 18 to 26 | https://pnpm.io/installation | 2026-09-26 |
| During local development pnpm always fails if its version does not match engines.pnpm | https://pnpm.io/package_json | 2026-09-26 |
| devEngines.packageManager was added in v11.0.0 and accepts version ranges | https://pnpm.io/package_json | 2026-09-26 |
| pmOnFail (v11.0.0) defaults to download and accepts download, error, warn or ignore | https://pnpm.io/settings/cli | 2026-09-26 |
| pmOnFail replaced managePackageManagerVersions, packageManagerStrict and packageManagerStrictVersion | https://pnpm.io/settings/cli | 2026-09-26 |
| A project whose own engines field is incompatible always fails install regardless of engineStrict | https://pnpm.io/settings/cli | 2026-09-26 |
| strictDepBuilds (added v10.3.0) defaults to true and fails install on unreviewed dependency build scripts | https://pnpm.io/settings/build | 2026-09-26 |
| allowBuilds (added v10.26.0) maps package names to true or false and unlisted packages are disallowed | https://pnpm.io/settings/build | 2026-09-26 |
| onlyBuiltDependencies, neverBuiltDependencies and ignoredBuiltDependencies were removed in v11 in favour of allowBuilds | https://pnpm.io/settings/build | 2026-09-26 |

### Turborepo

| Claim | Official URL | Checked |
| --- | --- | --- |
| turbo-ignore is deprecated and turbo query affected is its replacement | https://turborepo.dev/docs/reference/turbo-ignore | 2026-09-26 |
| npx turbo-ignore my-app maps to turbo query affected --packages my-app, and --fallback main maps to --base main | https://turborepo.dev/docs/reference/query | 2026-09-26 |
| turbo query affected --exit-code exits 0 when nothing is affected, 1 when affected, 2 on error | https://turborepo.dev/docs/reference/query | 2026-09-26 |
| A too-shallow checkout makes turbo treat all packages as changed | https://turborepo.dev/docs/reference/query | 2026-09-26 |
| Strict Mode is the default environment mode and filters task env to env and globalEnv entries | https://turborepo.dev/docs/crafting-your-repository/using-environment-variables | 2026-09-26 |
| globalEnv changes every task hash while env changes only the listed task hash | https://turborepo.dev/docs/crafting-your-repository/using-environment-variables | 2026-09-26 |
| passThroughEnv and globalPassThroughEnv make variables available without adding them to the hash | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| Framework inference adds PUBLIC_* for Astro packages, applied per package | https://turborepo.dev/docs/crafting-your-repository/using-environment-variables | 2026-09-26 |
| On Vercel, Turborepo checks project env vars against turbo.json and warns; TURBO_PLATFORM_ENV_DISABLED=true turns it off | https://turborepo.dev/docs/crafting-your-repository/using-environment-variables | 2026-09-26 |
| Turborepo does not load .env files, so they should be added to task inputs | https://turborepo.dev/docs/crafting-your-repository/using-environment-variables | 2026-09-26 |
| turbo.json uses a tasks object with dependsOn, outputs, inputs, env, cache and persistent keys | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| A ^ prefix in dependsOn waits for the same task in dependency packages | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| outputs globs are relative to the package and omitting outputs caches only logs | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| Setting inputs drops the default tracked-file behaviour unless $TURBO_DEFAULT$ is included | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| Turborepo requires a package manager declaration and recommends devEngines.packageManager, with packageManager still supported | https://turborepo.dev/docs/reference/configuration | 2026-09-26 |
| --affected is equivalent to --filter=...[main...HEAD] and TURBO_SCM_BASE or TURBO_SCM_HEAD override the refs | https://turborepo.dev/docs/reference/run | 2026-09-26 |
| --filter accepts git ranges such as [a1b2c3d...e4f5g6h] and ...[origin/my-feature] | https://turborepo.dev/docs/reference/run | 2026-09-26 |
| --env-mode=loose makes all machine env vars available to tasks | https://turborepo.dev/docs/reference/run | 2026-09-26 |

## Vercel


### Monorepos, Root Directory, skipping unaffected projects

| Claim | Official URL | Checked |
| --- | --- | --- |
| Each directory of a monorepo is imported as its own Vercel project with its own Root Directory | https://vercel.com/docs/monorepos | 2026-09-26 |
| Every commit deploys all connected projects by default and shows URLs on PRs and commits | https://vercel.com/docs/monorepos | 2026-09-26 |
| The number of Vercel projects connected to the same Git repository is limited by plan | https://vercel.com/docs/monorepos | 2026-09-26 |
| Linking a monorepo with the CLI needs Vercel CLI 20.1.0 or newer, run from the repo root | https://vercel.com/docs/monorepos | 2026-09-26 |
| vercel link --repo links multiple Vercel projects in a monorepo at once | https://vercel.com/docs/monorepos | 2026-09-26 |
| A monorepo project counts as changed if its source, its internal dependencies, or its lockfile-scoped dependencies changed | https://vercel.com/docs/monorepos | 2026-09-26 |
| Vercel automatically skips builds for monorepo projects unchanged by the commit | https://vercel.com/docs/monorepos | 2026-09-26 |
| Skipped unaffected projects do not occupy concurrent build slots, unlike Ignored Build Step | https://vercel.com/docs/monorepos | 2026-09-26 |
| Skipping unaffected projects is only available for projects connected to GitHub repositories | https://vercel.com/docs/monorepos | 2026-09-26 |
| Skipping requires npm, yarn, pnpm or Bun workspaces following JavaScript ecosystem conventions | https://vercel.com/docs/monorepos | 2026-09-26 |
| For pnpm the workspace packages must be listed in pnpm-workspace.yaml | https://vercel.com/docs/monorepos | 2026-09-26 |
| Changes outside the workspace definition are treated as global and deploy all applications | https://vercel.com/docs/monorepos | 2026-09-26 |
| The package manager is detected from the root lockfile or the packageManager field in root package.json | https://vercel.com/docs/monorepos | 2026-09-26 |
| Every workspace package must have a unique name field in its package.json | https://vercel.com/docs/monorepos | 2026-09-26 |
| Dependencies between monorepo packages must be declared explicitly in each package.json | https://vercel.com/docs/monorepos | 2026-09-26 |
| The skip behaviour is toggled with the Skip deployment switch under Root Directory in Build and Deployment settings | https://vercel.com/docs/monorepos | 2026-09-26 |
| Canceled builds from Ignored Build Step count towards deployment and concurrent build limits | https://vercel.com/docs/monorepos | 2026-09-26 |
| Filtered installs can use installCommand "pnpm install --filter web..." in the app vercel.json | https://vercel.com/docs/monorepos | 2026-09-26 |
| Related Projects allow at most 3 linked projects, same repository only, and not CLI deployments | https://vercel.com/docs/monorepos | 2026-09-26 |
| Source files outside the Root Directory need the "Include source files outside of the Root Directory in the Build Step" option | https://vercel.com/docs/monorepos/monorepo-faq | 2026-09-26 |
| That option is enabled by default for projects created after 27 August 2020 23:50 UTC | https://vercel.com/docs/monorepos/monorepo-faq | 2026-09-26 |
| Hobby is limited to 1 concurrent build | https://vercel.com/docs/monorepos/monorepo-faq | 2026-09-26 |
| The CLI accepts VERCEL_ORG_ID and VERCEL_PROJECT_ID instead of project linking, and --project takes precedence | https://vercel.com/docs/monorepos/monorepo-faq | 2026-09-26 |
| Turborepo is available on all plans including Hobby | https://vercel.com/docs/monorepos/monorepo-faq | 2026-09-26 |
| The Configure a Build page says an app with a Root Directory cannot access files outside it or use .. | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| Vercel clones with git clone --depth=10, so only the latest ten commits are available | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| Root Directory changes apply on the next deployment | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| The REST project update field rootDirectory sets the source directory, null means the project root | https://vercel.com/docs/rest-api/projects/update-an-existing-project | 2026-09-26 |
| The REST project update endpoint is PATCH https://api.vercel.com/v9/projects/{idOrName} | https://vercel.com/docs/rest-api/projects/update-an-existing-project | 2026-09-26 |
| The REST field sourceFilesOutsideRootDirectory indicates source files outside the root directory | https://vercel.com/docs/rest-api/projects/update-an-existing-project | 2026-09-26 |
| The REST field enableAffectedProjectsDeployments opts in to skipping deployments with no changes to the root directory and its dependencies | https://vercel.com/docs/rest-api/projects/update-an-existing-project | 2026-09-26 |

### Turborepo

| Claim | Official URL | Checked |
| --- | --- | --- |
| Vercel sets Ignored Build Step to npx turbo-ignore --fallback=HEAD^1 for Turborepo imports | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |
| Vercel sets Root Directory to the app location, for example apps/web | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |
| turbo is installed globally on Vercel and the filter is inferred from the Root Directory | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |
| A custom Ignored Build Step can run turbo query affected --base=$VERCEL_GIT_PREVIOUS_SHA --packages NAME --exit-code | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |
| Build-affecting environment variables must be declared in turbo.json or cache hits can ship the wrong environment | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |
| turbo outputs must match the framework Output Directory or the deploy fails on cache hit | https://vercel.com/docs/monorepos/turborepo | 2026-09-26 |

### Package managers and Node.js

| Claim | Official URL | Checked |
| --- | --- | --- |
| Vercel detects the package manager from the lockfile | https://vercel.com/docs/package-managers | 2026-09-26 |
| If Corepack is used, Vercel uses the packageManager field in package.json instead | https://vercel.com/docs/package-managers | 2026-09-26 |
| Supported pnpm versions are 6, 7, 8, 9 and 10 | https://vercel.com/docs/package-managers | 2026-09-26 |
| pnpm-lock.yaml lockfileVersion 9.0 maps to pnpm 9 or 10 | https://vercel.com/docs/package-managers | 2026-09-26 |
| For lockfileVersion 9.0 newer projects prefer pnpm 10 and older ones pnpm 9; check the build log | https://vercel.com/docs/package-managers | 2026-09-26 |
| lockfileVersion 7.0 maps to pnpm 9, 6.0/6.1 to pnpm 8, 5.3/5.4 to pnpm 7, otherwise pnpm 6 | https://vercel.com/docs/package-managers | 2026-09-26 |
| With no lockfile Vercel uses npm by default | https://vercel.com/docs/package-managers | 2026-09-26 |
| An override install command such as pnpm install uses the oldest available version, pnpm 6 | https://vercel.com/docs/package-managers | 2026-09-26 |
| Corepack is enabled with project env var ENABLE_EXPERIMENTAL_COREPACK set to 1 | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| With Corepack enabled, set packageManager in the repo-root package.json, for example pnpm@7.5.1 | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| Corepack is described as experimental and may change or be removed | https://vercel.com/docs/builds/configure-a-build | 2026-09-26 |
| Available Node.js majors are 24.x (default), 22.x and 20.x | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-26 |
| Only major Node versions are selectable; minor and patch roll out automatically | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-26 |
| engines.node in package.json overrides the Node version chosen in Project Settings | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-26 |
| engines.node ">=20.0.0" deploys the latest 24.x | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-26 |
| engines.node "22.x" or "^22.0.0" deploys the latest 22.x | https://vercel.com/docs/functions/runtimes/node-js/node-js-versions | 2026-09-26 |

### Vercel for GitHub, PR comments, deployment_status, repository_dispatch

| Claim | Official URL | Checked |
| --- | --- | --- |
| Vercel for GitHub deploys every push by default, including pushes and pull requests on branches | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| If a branch is already building, newer commits queue and only the most recent one deploys after | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| The latest push to any pull request gets a unique preview URL posted as a PR comment | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Pull requests from forks need authorization by a team member before deploying | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Vercel uses the GitHub Deployments API so deployments show in GitHub and feed GitHub checks | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| By default Vercel notifies GitHub using the deployment_status webhook event | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| deployment_status events can be turned off with the deployment_status Events toggle in project Git settings | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Vercel encourages migrating GitHub Actions from deployment_status to repository_dispatch | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Vercel bot PR comments can be silenced in project Git settings, but not per branch | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Each commit receives a GitHub Commit Status per deployed project by default | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| repository_dispatch only triggers if the workflow file exists on the default branch | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| Listed dispatch types are vercel.deployment.ready, success, error, canceled, ignored, skipped, pending, failed, promoted | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| vercel.deployment.ignored means canceled by the Ignored Build Step script | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| vercel.deployment.skipped means canceled by automatic skipping of unaffected monorepo projects | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| The dispatch payload is read in Actions via github.event.client_payload, for example client_payload.url | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| The documented migration example triggers e2e tests on repository_dispatch type vercel.deployment.success | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |
| The KB e2e example checks out ref github.event.client_payload.git.sha | https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment | 2026-09-26 |
| The KB says protected projects need Protection Bypass for Automation for test runners | https://vercel.com/kb/guide/how-can-i-run-end-to-end-tests-after-my-vercel-preview-deployment | 2026-09-26 |
| [vercel repo] Payload fields are environment, git.ref, git.sha, git.shortSha, id, project.id, project.name, state.type, url | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| [vercel repo] Wildcard type vercel.deployment.* is supported | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| [vercel repo] README: ready means built but not promoted to production | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| [vercel repo] README: success means built and automatically promoted to production | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| [vercel repo] repository_dispatch runs with GITHUB_SHA set to the last commit on the default branch | https://github.com/vercel/repository-dispatch | 2026-09-26 |
| [vercel repo] The TypeScript DispatchDeploymentEventType union does not include vercel.deployment.ready | https://raw.githubusercontent.com/vercel/repository-dispatch/main/packages/repository-dispatch/src/types.ts | 2026-09-26 |
| [vercel repo] failed events carry state.detail such as checks_failed or authorization_required | https://raw.githubusercontent.com/vercel/repository-dispatch/main/packages/repository-dispatch/src/types.ts | 2026-09-26 |

### Deployment Checks

| Claim | Official URL | Checked |
| --- | --- | --- |
| Deployment Checks hold each production deployment until required checks pass before assigning custom production domains | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Check sources are Native (Vercel lint/typecheck), GitHub Checks, and Marketplace Integration Checks | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Native checks run package.json scripts lint and typecheck, type-check or check-types, and skip if missing | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| GitHub Checks require the project to use Vercel for GitHub | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| GitHub Checks require automatic aliasing for production to be turned on | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Checks are added in project Deployment Checks settings via Add Checks, choosing GitHub and selecting Actions checks | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| repository_dispatch workflows should report back with vercel/repository-dispatch/actions/status@v1 and a unique name | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Workflows feeding Deployment Checks via repository_dispatch must use vercel.deployment.ready | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| vercel.deployment.ready fires after the deployment is created and before checks run | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Production deployments are still created but not assigned to custom domains until checks pass | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Checks can be bypassed with Force Promote on the deployment details page | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| Each workflow run should produce one commit status, and the status name should include the environment | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| The Deployment Checks page states no plan restriction (checked 2026-09-26) | https://vercel.com/docs/deployment-checks | 2026-09-26 |
| vercel project checks lists, adds and removes deployment checks from the CLI | https://vercel.com/docs/cli/project | 2026-09-26 |

### System and framework environment variables

| Claim | Official URL | Checked |
| --- | --- | --- |
| System env vars require the Enable access to System Environment Variables checkbox | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_ENV is available at build and runtime with values production, preview or development | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_TARGET_ENV can also hold the name of a custom environment | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_URL is available at build and runtime and has no https:// scheme | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_URL cannot be used in conjunction with Standard Deployment Protection | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_BRANCH_URL is the git branch URL, available at build and runtime, no scheme | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_PROJECT_PRODUCTION_URL is available at build and runtime and is set even in preview deployments | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_PROJECT_PRODUCTION_URL picks the shortest production custom domain, else the vercel.app domain | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_GIT_COMMIT_SHA is available at build and runtime | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_GIT_COMMIT_REF is the branch, available at build and runtime | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_GIT_PREVIOUS_SHA is build time only and only exposed when an Ignored Build Step is provided | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_GIT_PREVIOUS_SHA is empty on a branch's first deployment | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_DEPLOYMENT_ID and VERCEL_PROJECT_ID are available at build and runtime | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| VERCEL_AUTOMATION_BYPASS_SECRET is available at build and runtime when a bypass secret exists | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| CI=1 is available at build time only | https://vercel.com/docs/environment-variables/system-environment-variables | 2026-09-26 |
| For Astro the prefixed variables are PUBLIC_VERCEL_ENV, PUBLIC_VERCEL_URL, PUBLIC_VERCEL_BRANCH_URL and siblings | https://vercel.com/docs/environment-variables/framework-environment-variables | 2026-09-26 |
| Astro also gets PUBLIC_VERCEL_PROJECT_PRODUCTION_URL and PUBLIC_VERCEL_GIT_COMMIT_SHA | https://vercel.com/docs/environment-variables/framework-environment-variables | 2026-09-26 |
| Framework-prefixed variables are available during the build step based on the framework preset | https://vercel.com/docs/environment-variables/framework-environment-variables | 2026-09-26 |
| vercel env pull does not add framework prefixes locally | https://vercel.com/docs/environment-variables/framework-environment-variables | 2026-09-26 |

### Instant Rollback, rollback and promote CLI

| Claim | Official URL | Checked |
| --- | --- | --- |
| Pro and Enterprise can roll back to any deployment previously aliased to production | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Hobby can roll back only to the immediately previous deployment | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Owners, Members and Developers on Pro and Enterprise can roll back | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Project Administrators and holders of Full Production Deployment permission can also roll back | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Rollback does not pick up environment variable changes made in project settings | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Cron jobs revert to the state of the rolled-back deployment | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| After a rollback Vercel turns off auto-assignment of production domains | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| While rolled back, new pushes to the production branch do not go live | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Undo Rollback on the production tile promotes a chosen deployment and re-enables auto-assignment | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| vercel promote DEPLOYMENT has the same effect as Undo Rollback | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Only one rollback can run at a time per project | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| Deployments never aliased to production, for example most previews, are not eligible for rollback | https://vercel.com/docs/instant-rollback | 2026-09-26 |
| vercel rollback [deployment-id or url] rolls production back | https://vercel.com/docs/cli/rollback | 2026-09-26 |
| On Hobby, rolling back further than the previous production deployment returns an upgrade error | https://vercel.com/docs/cli/rollback | 2026-09-26 |
| vercel rollback status [project] shows pending rollbacks | https://vercel.com/docs/cli/rollback | 2026-09-26 |
| vercel rollback --timeout 0 exits immediately after requesting the rollback | https://vercel.com/docs/cli/rollback | 2026-09-26 |
| vercel promote [deployment-id or url] promotes an existing deployment to current | https://vercel.com/docs/cli/promote | 2026-09-26 |
| Promoting a preview deployment asks for confirmation and results in a new production deployment | https://vercel.com/docs/cli/promote | 2026-09-26 |
| vercel promote --yes bypasses the preview promotion prompt | https://vercel.com/docs/cli/promote | 2026-09-26 |
| vercel promote --timeout defaults to 3m | https://vercel.com/docs/cli/promote | 2026-09-26 |
| Promote preview to production does a complete rebuild with production env vars | https://vercel.com/docs/deployments/promoting-a-deployment | 2026-09-26 |
| Promoting a staged production build needs auto-assignment of domains turned off and does not rebuild | https://vercel.com/docs/deployments/promoting-a-deployment | 2026-09-26 |
| Auto-assign Custom Production Domains is under Settings, Environments, Production, Branch Tracking | https://vercel.com/docs/deployments/promoting-a-deployment | 2026-09-26 |

### Functions limits

| Claim | Official URL | Checked |
| --- | --- | --- |
| The maximum request or response body for a Vercel Function is 4.5 MB | https://vercel.com/docs/functions/limitations | 2026-09-26 |
| Exceeding it returns 413 FUNCTION_PAYLOAD_TOO_LARGE | https://vercel.com/docs/functions/limitations | 2026-09-26 |
| Hobby function max duration is 300s default and maximum | https://vercel.com/docs/functions/limitations | 2026-09-26 |

### Vercel Blob

| Claim | Official URL | Checked |
| --- | --- | --- |
| Vercel Blob is available on all plans | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Blob stores are private or public, and the access mode cannot be changed after store creation | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Public blobs are readable by anyone with the URL; private blobs need authentication and are served via get() | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Blob stores can be created from the dashboard or the Vercel CLI | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| The Blob store region cannot be changed after creation | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Connecting a store adds BLOB_STORE_ID, VERCEL_OIDC_TOKEN and BLOB_WEBHOOK_PUBLIC_KEY | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| BLOB_READ_WRITE_TOKEN is added at store creation and is needed for handleUpload client tokens | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Uploading to an existing pathname throws unless allowOverwrite is true | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Overwrites and deletes can take up to 60 seconds to propagate through the cache | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Multipart uploads are recommended for files larger than 100 MB | https://vercel.com/docs/vercel-blob | 2026-09-26 |
| Dashboard flow is Storage, Create Storage, Blob, then choose Private or Public access | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| Production and Preview are preselected for the token; Development must be added for local work | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| Client uploads send the file from the browser directly to Blob, used for files over 4.5 MB | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| Users must be authenticated and authorized inside onBeforeGenerateToken | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| onUploadCompleted callback URL uses VERCEL_BRANCH_URL, then VERCEL_URL in preview | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| onUploadCompleted callback URL uses VERCEL_PROJECT_PRODUCTION_URL in production | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| onUploadCompleted does not work on localhost; use a tunnel and VERCEL_BLOB_CALLBACK_URL | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| Doc samples note the completion webhook retries 5 times waiting for a 200 | https://vercel.com/docs/vercel-blob/client-upload | 2026-09-26 |
| handleUpload always needs a read-write token; OIDC is not accepted for it | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| handleUploadPresigned is the OIDC-compatible alternative to handleUpload | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| SDK credential order is explicit token, then OIDC token plus store id, then BLOB_READ_WRITE_TOKEN | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| upload() options are access, contentType, handleUploadUrl, clientPayload, multipart, abortSignal, onUploadProgress | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| onBeforeGenerateToken receives pathname, clientPayload and multipart | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| onBeforeGenerateToken may return allowedContentTypes, maximumSizeInBytes, validUntil, addRandomSuffix | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| onBeforeGenerateToken may also return allowOverwrite, cacheControlMaxAge, callbackUrl, tokenPayload | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| addRandomSuffix defaults to false | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| maximumSizeInBytes has a maximum of 5TB | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| The client token validUntil defaults to now plus 1 hour | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| allowedContentTypes supports wildcards such as text/* and defaults to all types | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| onUploadCompleted receives blob and tokenPayload | https://vercel.com/docs/vercel-blob/using-blob-sdk | 2026-09-26 |
| vercel blob create-store [name] --access <access> creates a store, default region iad1 | https://vercel.com/docs/cli/blob | 2026-09-26 |
| vercel blob create-store --yes auto-connects the linked project, all environments by default | https://vercel.com/docs/cli/blob | 2026-09-26 |
| The --access option is required for put, put-image, copy, get and create-store | https://vercel.com/docs/cli/blob | 2026-09-26 |
| Hobby includes 1 GB blob storage, 10,000 simple ops, 2,000 advanced ops, 10 GB blob transfer | https://vercel.com/docs/vercel-blob/usage-and-pricing | 2026-09-26 |
| On Hobby, exceeding Blob limits blocks Blob access until 30 days have passed | https://vercel.com/docs/vercel-blob/usage-and-pricing | 2026-09-26 |
| Hobby Blob rate limits are 1,200 simple and 900 advanced operations per minute | https://vercel.com/docs/vercel-blob/usage-and-pricing | 2026-09-26 |
| Client uploads incur no data transfer charges | https://vercel.com/docs/vercel-blob/usage-and-pricing | 2026-09-26 |

### vercel.json

| Claim | Official URL | Checked |
| --- | --- | --- |
| In redirects, permanent defaults to true, which gives status 308 | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| permanent false gives status 307 | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| statusCode sets another redirect code and cannot be combined with permanent | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| Redirect has conditions do not work under vercel dev, only when deployed | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| trailingSlash false redirects /about/ to /about with 308 | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| trailingSlash true redirects /about to /about/ with 308, but not paths with a file extension | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| trailingSlash undefined (default) serves both forms without redirect, which is not recommended | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| ignoreCommand overrides the Ignored Build Step; exit 1 builds, exit 0 skips | https://vercel.com/docs/project-configuration/vercel-json | 2026-09-26 |
| git.deploymentEnabled takes a boolean or an object of branch patterns to booleans, default true | https://vercel.com/docs/project-configuration/git-configuration | 2026-09-26 |
| git.deploymentEnabled branch keys use minimatch, and any true match wins | https://vercel.com/docs/project-configuration/git-configuration | 2026-09-26 |
| git.deploymentEnabled false turns off automatic deployments for all branches | https://vercel.com/docs/project-configuration/git-configuration | 2026-09-26 |
| The git configuration page spells the key github.autoJobCancelation with one l | https://vercel.com/docs/project-configuration/git-configuration | 2026-09-26 |
| The Vercel for GitHub page spells it github.autoJobCancellation with two l | https://vercel.com/docs/git/vercel-for-github | 2026-09-26 |

### Deployment Protection and bypass

| Claim | Official URL | Checked |
| --- | --- | --- |
| Standard Protection protects all deployments except production domains and is available on all plans | https://vercel.com/docs/deployment-protection | 2026-09-26 |
| Password Protection is not available on Hobby | https://vercel.com/docs/deployment-protection | 2026-09-26 |
| Teams can set a default Deployment Protection for new projects in team settings | https://vercel.com/docs/deployment-protection | 2026-09-26 |
| Enabling Standard Protection restricts the generated production URL, so VERCEL_URL fetches must change | https://vercel.com/docs/deployment-protection | 2026-09-26 |
| Hobby includes Vercel Authentication, Standard Protection, All Deployments and Protection Bypass for Automation | https://vercel.com/docs/deployment-protection/usage-and-pricing | 2026-09-26 |
| Hobby Shareable Links are limited to one link per account | https://vercel.com/docs/deployment-protection/usage-and-pricing | 2026-09-26 |
| Hobby teams can enable or disable Vercel Authentication for their own projects, per project | https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication | 2026-09-26 |
| The API disables Vercel Authentication by setting ssoProtection to null | https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication | 2026-09-26 |
| Disabling Vercel Authentication makes all existing deployments unprotected | https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication | 2026-09-26 |
| Protection Bypass for Automation is available on all plans | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| The bypass is sent as header x-vercel-protection-bypass or a query parameter of the same name | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| x-vercel-set-bypass-cookie true sets a bypass cookie via redirect; samesitenone for iframes | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| One secret is exposed as VERCEL_AUTOMATION_BYPASS_SECRET in deployments | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| Regenerating or deleting the secret invalidates it for previous deployments; redeploy to pick up a new one | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| The bypass does not override active DDoS mitigations or attack rate limits | https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation | 2026-09-26 |
| vercel project protection enable|disable [name] --sso toggles Vercel Authentication from the CLI | https://vercel.com/docs/cli/project | 2026-09-26 |
| vercel project protection enable [name] --protection-bypass creates a bypass secret | https://vercel.com/docs/cli/project | 2026-09-26 |

### CLI: project, link, git, env, inspect, list, api

| Claim | Official URL | Checked |
| --- | --- | --- |
| vercel project add <name> creates a project and requires the name argument | https://vercel.com/docs/cli/project | 2026-09-26 |
| vercel project update supports --framework, --build-command, --dev-command, --install-command, --output-directory, --auto-detect | https://vercel.com/docs/cli/project | 2026-09-26 |
| The vercel project reference lists no root-directory flag for add or update | https://vercel.com/docs/cli/project | 2026-09-26 |
| vercel project inspect [name] shows project details | https://vercel.com/docs/cli/project | 2026-09-26 |
| vercel link --repo (Alpha) links all projects in a repository and requires the Git integration | https://vercel.com/docs/cli/link | 2026-09-26 |
| vercel link --yes --project foo links non-interactively to a named project | https://vercel.com/docs/cli/link | 2026-09-26 |
| Linking writes .vercel/project.json with orgId and projectId | https://vercel.com/docs/cli/project-linking | 2026-09-26 |
| vercel git connect connects the remote from the local .git config to the linked project | https://vercel.com/docs/cli/git | 2026-09-26 |
| vercel git connect --yes skips the connect confirmation | https://vercel.com/docs/cli/git | 2026-09-26 |
| vercel env add [name] [environment] [gitbranch] adds a variable, value via stdin or --value | https://vercel.com/docs/cli/env | 2026-09-26 |
| vercel env pull --environment=preview writes preview variables to .env.local | https://vercel.com/docs/cli/env | 2026-09-26 |
| vercel env run -e preview -- CMD runs a command with that environment's variables | https://vercel.com/docs/cli/env | 2026-09-26 |
| vercel env add defaults to secret visibility for production and preview, config for development | https://vercel.com/docs/cli/env | 2026-09-26 |
| vercel inspect URL --logs --wait streams build logs until the deployment completes | https://vercel.com/docs/cli/inspect | 2026-09-26 |
| vercel inspect --timeout defaults to 3 minutes | https://vercel.com/docs/cli/inspect | 2026-09-26 |
| vercel list -m githubCommitSha=SHA finds deployments by commit SHA | https://vercel.com/docs/cli/list | 2026-09-26 |
| vercel list supports --environment, --prod and --status READY,BUILDING | https://vercel.com/docs/cli/list | 2026-09-26 |
| vercel api (Beta) makes authenticated REST calls, with -X for method and -F for typed fields | https://vercel.com/docs/cli/api | 2026-09-26 |

### Hobby plan and fair use

| Claim | Official URL | Checked |
| --- | --- | --- |
| Hobby is restricted to non-commercial personal use only | https://vercel.com/docs/limits/fair-use-guidelines | 2026-09-26 |
| Commercial use includes a paid employee or consultant writing the code | https://vercel.com/docs/limits/fair-use-guidelines | 2026-09-26 |
| Commercial use requires a Pro or Enterprise plan | https://vercel.com/docs/limits/fair-use-guidelines | 2026-09-26 |
| The Hobby plan page repeats the non-commercial personal use restriction | https://vercel.com/docs/plans/hobby | 2026-09-26 |
| Hobby allows 100 deployments per day and 200 projects | https://vercel.com/docs/plans/hobby | 2026-09-26 |
| Hobby builds get 2 vCPUs and 8 GB memory | https://vercel.com/docs/plans/hobby | 2026-09-26 |
| Hobby has no team collaboration features and no email support | https://vercel.com/docs/plans/hobby | 2026-09-26 |
| Hobby Deployment Protection covers Vercel Authentication, Exceptions and Shareable Links | https://vercel.com/docs/plans/hobby | 2026-09-26 |

### Not found in the official pages read (do not cite as fact)

| Claim | Official URL | Checked |
| --- | --- | --- |

## Claude Code


### Skills

| Claim | Official URL | Checked |
| --- | --- | --- |
| A project skill lives at .claude/skills/<skill-name>/SKILL.md and loads in sessions in that repository | https://code.claude.com/docs/en/skills | 2026-09-26 |
| A personal skill lives at ~/.claude/skills/<skill-name>/SKILL.md and loads in all your projects on that machine but not in Cowork or cloud sessions | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Custom commands have been merged into skills; .claude/commands/deploy.md and .claude/skills/deploy/SKILL.md both create /deploy | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Existing .claude/commands/ files keep working, and the docs say to prefer a skill for new work | https://code.claude.com/docs/en/skills | 2026-09-26 |
| A command file in .claude/commands/ accepts the same frontmatter as a skill except name and paths | https://code.claude.com/docs/en/skills | 2026-09-26 |
| When a skill and a .claude/commands/ file share a name, the skill runs | https://code.claude.com/docs/en/skills | 2026-09-26 |
| The skill directory name, or the frontmatter name when set, becomes the slash command | https://code.claude.com/docs/en/skills | 2026-09-26 |
| All skill frontmatter fields are optional and only description is recommended | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Claude Code silently ignores an unrecognized frontmatter field name, so field names must match exactly including hyphens | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Frontmatter is read only when the opening --- is the first line of SKILL.md | https://code.claude.com/docs/en/skills | 2026-09-26 |
| If the frontmatter YAML does not parse, the skill still loads with no fields set | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Skill frontmatter fields are name, description, when_to_use, argument-hint, arguments, disable-model-invocation, user-invocable, allowed-tools, disallowed-tools, model, effort, context, agent, background, hooks, paths, shell, metadata, license, compatibility | https://code.claude.com/docs/en/skills | 2026-09-26 |
| The combined description and when_to_use text is truncated at 1,536 characters in the skill listing | https://code.claude.com/docs/en/skills | 2026-09-26 |
| argument-hint is a hint shown during autocomplete, for example [issue-number] | https://code.claude.com/docs/en/skills | 2026-09-26 |
| disable-model-invocation: true means only the user can invoke the skill and its description is not in Claude's context | https://code.claude.com/docs/en/skills | 2026-09-26 |
| user-invocable: false hides the skill from the / menu so only Claude can invoke it | https://code.claude.com/docs/en/skills | 2026-09-26 |
| allowed-tools grants listed tools without prompting only during the turn that invokes the skill and the grant clears on the next user message | https://code.claude.com/docs/en/skills | 2026-09-26 |
| allowed-tools does not restrict which tools are available; other tools stay governed by permission settings | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Workspace trust does not gate a project skill's allowed-tools, including in a -p run in an untrusted folder | https://code.claude.com/docs/en/skills | 2026-09-26 |
| context: fork runs the skill in a subagent that does not see the conversation history | https://code.claude.com/docs/en/skills | 2026-09-26 |
| A forked skill runs in the background by default, but in non-interactive -p mode Claude Code waits for its result | https://code.claude.com/docs/en/skills | 2026-09-26 |
| $ARGUMENTS expands to all arguments passed when invoking the skill | https://code.claude.com/docs/en/skills | 2026-09-26 |
| $ARGUMENTS[N] accesses a specific argument by 0-based index | https://code.claude.com/docs/en/skills | 2026-09-26 |
| $N is shorthand for $ARGUMENTS[N], so $0 is the first argument | https://code.claude.com/docs/en/skills | 2026-09-26 |
| $name expands a named argument declared in the arguments frontmatter list, mapped to positions in order | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Indexed arguments use shell-style quoting, so a quoted multi-word value is one argument | https://code.claude.com/docs/en/skills | 2026-09-26 |
| If no placeholder receives the arguments, Claude Code appends ARGUMENTS: <value> to the end of the skill content | https://code.claude.com/docs/en/skills | 2026-09-26 |
| An indexed placeholder with no matching argument stays in the content unchanged, while a missing named argument expands to an empty string | https://code.claude.com/docs/en/skills | 2026-09-26 |
| A literal $ before a digit or ARGUMENTS is escaped with a single backslash, for example \$1.00 | https://code.claude.com/docs/en/skills | 2026-09-26 |
| ${CLAUDE_SKILL_DIR} expands to the directory containing the skill's SKILL.md | https://code.claude.com/docs/en/skills | 2026-09-26 |
| ${CLAUDE_PROJECT_DIR} in a skill expands to the project root and requires Claude Code v2.1.196 or later | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Claude Code watches skill directories and picks up an added, edited or removed skill in ~/.claude/skills/ or the project .claude/skills/ within the current session without a restart | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Live skill change detection does not apply in bare mode | https://code.claude.com/docs/en/skills | 2026-09-26 |
| A top-level skills directory created after the session started needs /reload-skills to be picked up | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Skills in a .claude/skills/ directory below the start directory load only once Claude reads or edits a file in that subdirectory | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Claude Code loads project skills from .claude/skills/ in the start directory and every parent up to the repository root | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Cloud sessions load project skills committed to the cloned repository's .claude/skills/ but do not read ~/.claude/skills/ | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Plugins declared in the repository's .claude/settings.json do not load in cloud sessions | https://code.claude.com/docs/en/skills | 2026-09-26 |
| An injected !`command` in a skill is checked against permission rules and a non-allow result aborts the skill outside auto mode | https://code.claude.com/docs/en/skills | 2026-09-26 |
| Skill permission rules use Skill(name) for an exact match and Skill(name *) for a prefix match | https://code.claude.com/docs/en/skills | 2026-09-26 |
| The docs recommend keeping SKILL.md under 500 lines | https://code.claude.com/docs/en/skills | 2026-09-26 |

### Memory

| Claim | Official URL | Checked |
| --- | --- | --- |
| A project CLAUDE.md can be stored at ./CLAUDE.md or ./.claude/CLAUDE.md and is shared with the team through version control | https://code.claude.com/docs/en/memory | 2026-09-26 |
| User-level instructions live at ~/.claude/CLAUDE.md and apply to all projects | https://code.claude.com/docs/en/memory | 2026-09-26 |
| ./CLAUDE.local.md holds personal project-specific preferences and should be added to .gitignore | https://code.claude.com/docs/en/memory | 2026-09-26 |
| The Windows managed policy CLAUDE.md location is C:\Program Files\ClaudeCode\CLAUDE.md | https://code.claude.com/docs/en/memory | 2026-09-26 |
| CLAUDE.md files in the working directory and every directory above it load at launch | https://code.claude.com/docs/en/memory | 2026-09-26 |
| CLAUDE.md files in subdirectories are not loaded at launch and are included when Claude reads files in those subdirectories | https://code.claude.com/docs/en/memory | 2026-09-26 |
| All discovered CLAUDE.md files are concatenated rather than overriding each other | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Claude treats CLAUDE.md and auto memory as context, not enforced configuration | https://code.claude.com/docs/en/memory | 2026-09-26 |
| To block an action regardless of what Claude decides, the docs say to use a PreToolUse hook | https://code.claude.com/docs/en/memory | 2026-09-26 |
| CLAUDE.md instructions shape behavior but are not a hard enforcement layer, while settings rules are enforced by the client | https://code.claude.com/docs/en/memory | 2026-09-26 |
| CLAUDE.md content is delivered as a user message after the system prompt and strict compliance is not guaranteed | https://code.claude.com/docs/en/memory | 2026-09-26 |
| CLAUDE.md can import files with @path/to/import syntax, relative to the importing file | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Imports can recurse to a maximum depth of four hops | https://code.claude.com/docs/en/memory | 2026-09-26 |
| An @path inside backticks or a code block is not imported | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Imported files still load into context at launch, so imports do not reduce context use | https://code.claude.com/docs/en/memory | 2026-09-26 |
| External imports outside the working directory trigger a one-time approval dialog in a project | https://code.claude.com/docs/en/memory | 2026-09-26 |
| The docs recommend targeting under 200 lines per CLAUDE.md file | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Block-level HTML comments in CLAUDE.md are stripped before the content reaches Claude's context | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Rules in .claude/rules/*.md without paths frontmatter load at launch like .claude/CLAUDE.md | https://code.claude.com/docs/en/memory | 2026-09-26 |
| A rule with paths frontmatter loads only when Claude reads files matching its glob patterns | https://code.claude.com/docs/en/memory | 2026-09-26 |
| The project-root CLAUDE.md is re-read from disk and re-injected after /compact | https://code.claude.com/docs/en/memory | 2026-09-26 |
| Run /context and check Memory files to confirm which CLAUDE.md files loaded | https://code.claude.com/docs/en/memory | 2026-09-26 |
| By default Claude reads AGENTS.md only when there is no CLAUDE.md or CLAUDE.local.md in the working directory or above it, and this requires v2.1.277 or later | https://code.claude.com/docs/en/memory | 2026-09-26 |
| On Windows the docs recommend an @AGENTS.md import instead of a CLAUDE.md symlink | https://code.claude.com/docs/en/memory | 2026-09-26 |

### Permissions

| Claim | Official URL | Checked |
| --- | --- | --- |
| Permission rules follow the format Tool or Tool(specifier) | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Rules are evaluated in order deny, then ask, then allow, and the first match decides regardless of specificity | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| An allow rule cannot carve an exception out of a deny rule | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A bare tool name in deny, such as Bash, removes the tool from Claude's context entirely | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Permission rules are enforced by Claude Code, not by the model, and CLAUDE.md instructions do not change what Claude Code allows | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| The default permission mode prompts on first use of each tool and is labeled Manual in the CLI and desktop app | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| acceptEdits automatically accepts file edits and common filesystem commands such as mkdir, touch, mv and cp in the working directory | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| dontAsk auto-denies every call that would otherwise prompt, while pre-approved tools still run | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| bypassPermissions skips permission prompts and should only be used in isolated environments like containers or VMs | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| The session start mode is set with defaultMode in settings files | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A * in a Bash rule matches any text including spaces, and Bash(git commit *) matches only commands starting with git commit | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A trailing space-star such as Bash(ls *) also matches the bare command but not lsof | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| The :* suffix is equivalent to a trailing space-star wildcard, so Bash(ls:*) equals Bash(ls *) | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A Bash allow rule must match each subcommand of a compound command joined by &&, ||, ;, | and similar operators | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A Bash deny rule such as Bash(git push *) does not stop git -C . push or bash -c forms, so it is not a security boundary around the program | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Edit rules apply to all built-in tools that edit files | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Claude Code checks file permissions against Edit(path) and Read(path) rules only, and a path rule written for Write is accepted but never consulted | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| The docs say to use Edit(docs/**) in place of Write(docs/**) | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A Read deny rule also blocks the Edit and Write tools on the same path | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Read and Edit deny rules do not apply to arbitrary subprocesses such as a Python or Node script that opens files itself | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| In Read and Edit rules, //path is an absolute path from the filesystem root | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| In Read and Edit rules, ~/path is a path from the home directory | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| In Read and Edit rules, /path is relative to the settings source, which for project settings is the primary working directory | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| In Read and Edit rules, path or ./path is relative to the current directory | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A /path rule in user settings at ~/.claude/settings.json resolves under ~/.claude/, not the project | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| On Windows, paths are normalized to POSIX form before matching, so a C:\Users\name path becomes /c/Users/name | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| As an allow rule Edit(src/**) matches only <cwd>/src, while as a deny or ask rule it matches a src directory at any depth | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A PreToolUse hook that exits with code 2 stops the tool call before permission rules are evaluated, even if an allow rule matches | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Hook decisions do not bypass deny and ask rules, which are evaluated regardless of what a PreToolUse hook returns | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| If a tool is denied at any settings level, no other level can allow it | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A user-level deny blocks a project-level allow and a project-level deny blocks a user-level allow | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| permissions.allow rules in a project .claude/settings.json apply only after the workspace trust dialog is accepted for that folder | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A claude -p run never shows the trust dialog, and in a never-trusted folder project permissions.allow rules are not used and a not-trusted warning is printed to stderr | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Hooks in settings files are used even in a claude -p run in a never-trusted folder | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A folder can be trusted by hand by setting projects["<path>"].hasTrustDialogAccepted to true in ~/.claude.json | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| Deny and ask rules in project settings are not affected by workspace trust because they only restrict | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| "Yes, and don't ask again" for a Bash command saves the rule to .claude/settings.local.json at the git repository root | https://code.claude.com/docs/en/permissions | 2026-09-26 |
| A file-modification approval is not saved to a file and lasts until the session ends | https://code.claude.com/docs/en/permissions | 2026-09-26 |

### Permission modes

| Claim | Official URL | Checked |
| --- | --- | --- |
| The permission modes are default (Manual), acceptEdits, plan, auto, dontAsk and bypassPermissions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Deny rules block in every mode, including bypassPermissions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Allow rules have no effect in bypassPermissions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Tools matched by an explicit ask rule are not auto-approved in any mode, including bypassPermissions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| acceptEdits auto-approves file edits plus mkdir, touch, rm, rmdir, mv, cp and sed, only for paths inside the working directory or additionalDirectories | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| In acceptEdits, all other Bash commands except the built-in read-only set still prompt | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Plan mode lets Claude read and explore but blocks source edits until the plan is approved | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Plan mode keeps its blocks in non-interactive -p runs and Agent SDK sessions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| dontAsk still runs actions matching permissions.allow rules and calls approved by a PreToolUse hook, and denies everything else that would prompt | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| The docs list dontAsk as best for locked-down CI and scripts | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| The built-in starting mode for claude -p and the Agent SDK is default | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| The --permission-mode flag works with -p for non-interactive runs | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| A defaultMode of auto or bypassPermissions set in project .claude/settings.json or .claude/settings.local.json does not take effect | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Setting defaultMode to plan in .claude/settings.json makes plan mode the default for the project's terminal sessions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Protected-path writes such as .git, .claude, .vscode, .husky and .mcp.json are never auto-approved except in bypassPermissions | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| permissions.allow rules such as Edit(.claude/**) do not pre-approve protected-path writes | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| The CI example in the docs is claude -p "run the test suite" --permission-mode dontAsk --allowedTools "Bash(npm test)" "Read" | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Cloud sessions offer Accept edits, Plan and Auto in the mode dropdown, and Bypass permissions is not available | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Cloud sessions pre-approve file edits regardless of mode | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| Cloud sessions ignore defaultMode bypassPermissions or dontAsk from settings files | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |
| In the CLI, Shift+Tab cycles default, acceptEdits and plan, with optional modes after plan | https://code.claude.com/docs/en/permission-modes | 2026-09-26 |

### Hooks guide

| Claim | Official URL | Checked |
| --- | --- | --- |
| Hooks are configured in a hooks block of a settings file, with each event name as a key inside the single hooks object | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Hooks give deterministic control so actions always happen rather than relying on the model to choose them | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The documented auto-format example is a PostToolUse hook with matcher Edit|Write running jq -r '.tool_input.file_path' piped to xargs npx prettier --write | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The docs place the auto-format hook in the project's .claude/settings.json | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The protected-files example reads .tool_input.file_path from stdin, writes the reason to stderr and exits with code 2 to block the edit | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The protected-files hook is registered as a PreToolUse hook with matcher Edit|Write and command "$CLAUDE_PROJECT_DIR"/.claude/hooks/protect-files.sh | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Hook scripts must be executable on macOS and Linux | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Hook input arrives as JSON on stdin with common fields session_id and cwd, plus hook_event_name, tool_name and tool_input for tool events | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Exit 0 from a PreToolUse hook does not approve the tool call; the normal permission flow still applies | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Exit 2 blocks the action and the reason should be written to stderr | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| For PreToolUse, exit 2 stderr is fed back to Claude as feedback | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Some events such as SessionStart cannot be blocked, and exit 2 there shows stderr to the user while execution continues | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Other nonzero exit codes with plain-text stdout are non-blocking errors and the action proceeds | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| A PreToolUse hook can instead exit 0 and print JSON with hookSpecificOutput.permissionDecision set to allow, deny or ask | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The docs say to choose one approach per hook, exit 2 with stderr or exit 0 with JSON | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The matcher "Edit|Write" fires only for the Edit or Write tool, and a comma separates alternatives the same way | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Matchers are case-sensitive | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| An Edit|Write matcher does not see files changed by shell commands, so Bash|PowerShell or a Stop hook is needed for full coverage | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The if field on a hook handler uses permission rule syntax such as Bash(git *) and works only on tool events | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Hooks in .claude/settings.json apply to a single project and can be committed to the repo | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Hooks in .claude/settings.local.json apply to a single project and are not shared | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The /hooks menu is read-only; hooks are added by editing settings JSON | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Setting "disableAllHooks": true in a settings file disables hooks, but a project settings file can override the user value | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Edits to settings files while Claude Code runs are normally picked up by the file watcher, otherwise restart the session | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The default timeout for command hooks is 10 minutes and can be overridden per hook with a timeout field in seconds | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| PostToolUse hooks cannot undo actions because the tool has already run | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| PreToolUse hooks fire in every permission mode, and a deny blocks the tool even in bypassPermissions or with --dangerously-skip-permissions | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| A hook returning allow does not bypass deny rules from settings | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| In plain -p runs, PermissionRequest hooks do not get a prompt to answer, so PreToolUse hooks should be used for automated decisions | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| A shell-form command hook runs under sh -c on macOS and Linux, Git Bash on Windows, or PowerShell when Git Bash is not installed | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Adding "args": [] switches a hook to exec form, which spawns the script directly without a shell | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| Unconditional echo lines in a shell profile can prepend text to hook JSON so Claude Code ignores it | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |
| The documented protect-files script normalizes Windows backslashes before matching paths | https://code.claude.com/docs/en/hooks-guide | 2026-09-26 |

### Hooks reference

| Claim | Official URL | Checked |
| --- | --- | --- |
| Hook configuration has three levels: hook event, matcher group, and hook handlers | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Claude Code fires the same hook events in the terminal, IDE extensions, the Desktop app and cloud sessions | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Cloud sessions do not read the local ~/.claude/settings.json | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| A matcher of only letters, digits, _, -, spaces, commas and | is an exact match or list of exact matches, anything else is an unanchored JavaScript regex | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| A regex matcher Edit.* also matches NotebookEdit, so ^Edit$ is needed for a whole-string match | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Command hook handler fields are command, args, async, asyncRewake and shell, plus common fields type, if, timeout, statusMessage and once | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| The shell field accepts bash or powershell and defaults to powershell on Windows only when Git Bash is not installed | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| On Windows exec form requires a real executable, so .cmd and .bat shims such as npx cannot be spawned without a shell | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Hook processes receive CLAUDE_PROJECT_DIR as an environment variable in both exec and shell form | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| ${CLAUDE_PROJECT_DIR} is the project root where the session started and does not follow Claude into a worktree | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| In a PowerShell hook, use ${CLAUDE_PROJECT_DIR} or $env:CLAUDE_PROJECT_DIR, never the bare $CLAUDE_PROJECT_DIR | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Common hook input fields include session_id, transcript_path, cwd, permission_mode and hook_event_name | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| PostToolUse input includes tool_name, tool_input, tool_response and tool_use_id | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| File-tool tool_input paths are always absolute with native separators, so backslashes on Windows | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| A PostToolUse hook matching Edit|Write does not run when a Bash command or outside process rewrites the file | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Exit 2 on PreToolUse blocks the tool call even if the JSON says allow | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Exit 2 on PostToolUse cannot block because the tool already ran, and it shows stderr to Claude | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Exit 2 on Stop prevents Claude from stopping and continues the conversation | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Exit 2 on UserPromptSubmit blocks prompt processing and erases the prompt | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Exit 2 is not honored for PermissionRequest | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Stderr from a hook that exits 0 goes to the debug log only and Claude never sees it | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| PostToolUse JSON output can set decision "block" with a reason, which adds the reason next to the tool result | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| If the same handler is defined in more than one settings file it runs once | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Hook entries merge across settings levels rather than replacing each other | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| In an interactive session, hooks from every settings file are held back until the workspace trust dialog is accepted | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| In a -p or SDK session the folder is treated as trusted, so hooks committed in .claude/settings.json run | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Command hooks execute with your full user permissions | https://code.claude.com/docs/en/hooks | 2026-09-26 |
| Hook debug output is written to the debug log, with claude --debug writing to ~/.claude/debug/<session-id>.txt | https://code.claude.com/docs/en/hooks | 2026-09-26 |

### Settings files and precedence

| Claim | Official URL | Checked |
| --- | --- | --- |
| Claude Code reads user settings from ~/.claude/settings.json, shared project settings from .claude/settings.json, and project local settings from .claude/settings.local.json | https://code.claude.com/docs/en/settings | 2026-09-26 |
| The shared project .claude/settings.json is meant to be committed so everyone who clones the repository gets the same permissions, hooks and plugins | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Claude Code adds .claude/settings.local.json to the global git excludes the first time it writes the file, but a hand-made file must be added to .gitignore yourself | https://code.claude.com/docs/en/settings | 2026-09-26 |
| On Windows, ~/.claude means %USERPROFILE%\.claude | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Settings precedence from highest is managed, command line arguments, project local, shared project, then user | https://code.claude.com/docs/en/settings | 2026-09-26 |
| List keys such as permissions.allow merge across settings files instead of overriding | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Settings files are strict JSON, so comments and trailing commas are errors | https://code.claude.com/docs/en/settings | 2026-09-26 |
| The published settings schema is https://json.schemastore.org/claude-code-settings.json and can be referenced with a $schema key | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Claude Code watches settings files and applies most edits, including permissions and hooks, to the running session without a restart | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Run /status to see which settings sources loaded, and claude doctor to list rejected entries | https://code.claude.com/docs/en/settings | 2026-09-26 |
| A -p run shows no settings error dialog and silently skips a broken settings file or value | https://code.claude.com/docs/en/settings | 2026-09-26 |
| permissions.allow rules committed in .claude/settings.json apply only after each teammate trusts the folder, while deny and ask rules apply right away | https://code.claude.com/docs/en/settings | 2026-09-26 |
| A cloud session with one repository reads the repository's committed .claude/settings.json | https://code.claude.com/docs/en/settings | 2026-09-26 |
| A cloud session with several repositories reads only enabledPlugins and extraKnownMarketplaces from each repository's settings, not permission rules or hooks | https://code.claude.com/docs/en/settings | 2026-09-26 |
| Cloud sessions do not read ~/.claude/settings.json or .claude/settings.local.json | https://code.claude.com/docs/en/settings | 2026-09-26 |

### All settings, Git and attribution

| Claim | Official URL | Checked |
| --- | --- | --- |
| The attribution setting customizes what Claude Code adds to git commits and pull requests and accepts commit and pr strings plus a sessionUrl Boolean | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| Setting attribution.commit to an empty string hides commit attribution | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| Setting attribution.pr to an empty string hides pull request attribution | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| attribution.sessionUrl set to false omits the claude.ai session link from commits and pull requests from cloud or Remote Control sessions | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| Setting attribution to false hides all attribution but requires Claude Code v2.1.281 or later, and earlier versions skip the whole settings file holding it | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| For settings files older versions also read, the docs say to set commit and pr to empty strings and sessionUrl to false instead of attribution false | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| includeCoAuthoredBy is deprecated since v2.0.62 and replaced by attribution | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| includeCoAuthoredBy is ignored once attribution.commit or attribution.pr is set | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| The default commit attribution is a Co-Authored-By trailer naming the model with a noreply@anthropic.com address | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| The attribution keys can be set in any settings file | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |
| A CLAUDE.md or memory rule about attribution takes precedence over attribution lines unless the line is set in managed settings | https://code.claude.com/docs/en/settings-reference | 2026-09-26 |

### Headless / non-interactive

| Claim | Official URL | Checked |
| --- | --- | --- |
| Adding -p or --print runs Claude Code non-interactively | https://code.claude.com/docs/en/headless | 2026-09-26 |
| The documented basic form is claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash" | https://code.claude.com/docs/en/headless | 2026-09-26 |
| claude -p exits 0 on success and non-zero when the run fails | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --output-format accepts text (default), json and stream-json | https://code.claude.com/docs/en/headless | 2026-09-26 |
| With --output-format json the text answer is in the result field and the payload includes session_id and total_cost_usd | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --json-schema with --output-format json returns schema-conforming output in the structured_output field | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --allowedTools uses permission rule syntax, for example Bash(git diff *) | https://code.claude.com/docs/en/headless | 2026-09-26 |
| The space before * matters, since Bash(git diff*) would also match git diff-index | https://code.claude.com/docs/en/headless | 2026-09-26 |
| For -p the built-in starting permission mode is Manual on every plan, so the desired mode should be passed | https://code.claude.com/docs/en/headless | 2026-09-26 |
| claude -p "Apply the lint fixes" --permission-mode acceptEdits is the documented acceptEdits example | https://code.claude.com/docs/en/headless | 2026-09-26 |
| In acceptEdits under -p, shell commands other than the read-only set and filesystem commands still need an --allowedTools entry or permissions.allow rule | https://code.claude.com/docs/en/headless | 2026-09-26 |
| In a -p run with no permission host, requests that would prompt are denied | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --permission-prompts none denies anything that would prompt and tells Claude not to retry, and requires v2.1.259 or later | https://code.claude.com/docs/en/headless | 2026-09-26 |
| User-invoked skills and custom commands work in -p mode by including /skill-name in the prompt string | https://code.claude.com/docs/en/headless | 2026-09-26 |
| Terminal-only built-in commands such as /login are not available in -p mode | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --append-system-prompt adds instructions while keeping Claude Code's default behavior | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --system-prompt fully replaces the default system prompt | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --continue resumes the most recent conversation and --resume takes a session ID | https://code.claude.com/docs/en/headless | 2026-09-26 |
| Without --bare, a -p session runs hooks in the project's .claude/settings.json and connects .mcp.json servers even in a never-trusted folder | https://code.claude.com/docs/en/headless | 2026-09-26 |
| --bare skips auto-discovery of hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory and CLAUDE.md | https://code.claude.com/docs/en/headless | 2026-09-26 |
| Bare mode does not use subscription login and needs ANTHROPIC_API_KEY or an apiKeyHelper | https://code.claude.com/docs/en/headless | 2026-09-26 |
| Piped stdin to claude -p is capped at 10MB | https://code.claude.com/docs/en/headless | 2026-09-26 |

### Web quickstart / cloud sessions

| Claim | Official URL | Checked |
| --- | --- | --- |
| Cloud sessions are available on Pro, Max and Team plans, and for Enterprise users with premium seats or Chat + Claude Code seats | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| A cloud session can be started from claude.ai/code, the Claude mobile app, the Desktop app, or the terminal with claude --cloud | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Cloud sessions persist across devices, so a task started on a laptop can be reviewed from a phone | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Cloud sessions require a GitHub repository, or a local repo bundled via --cloud | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| A cloud session does not use your local config, only the repo | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Claude clones the repository into an isolated VM and pushes a branch for you to review | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Each task gets its own session and its own branch | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| The diff view has a Create PR button that can open a full PR, a draft, or GitHub's compose page | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Cloud sessions offer Auto, Accept edits and Plan modes, not Manual or Bypass permissions | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Private repositories need the Claude GitHub App installed, or a gh token connected with /web-setup | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| On Team and Enterprise, an Owner must turn on the GitHub connector before Sign in with GitHub works | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| The Default cloud environment uses Trusted network access limited to common package registries and allowlisted domains | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Closing the browser tab does not stop a cloud session | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| The Claude mobile app for iOS or Android can monitor cloud sessions | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| Organizations with Zero Data Retention enabled cannot use cloud session features | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |
| A setup script must finish in roughly five minutes or new sessions can hang or time out | https://code.claude.com/docs/en/web-quickstart | 2026-09-26 |

### Use Claude Code in the cloud

| Claim | Official URL | Checked |
| --- | --- | --- |
| A cloud session can be started from the browser at claude.ai/code, the Code tab in the Claude mobile app, the Desktop app with Cloud selected, the terminal with claude --cloud, or routines | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| claude --cloud "task" clones the current directory's GitHub remote at the current branch, not the local checkout, so local commits must be pushed first | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| claude --teleport pulls a cloud session and its branch into the terminal and requires a clean git state and the same claude.ai account | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| claude -p "message" --cloud <session-id> queues a follow-up message into a running cloud session | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| In Anthropic-hosted environments, GitHub credentials stay on Anthropic's servers and GitHub operations go through a GitHub proxy | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| Cloud sessions pick up subagents defined in the repo's .claude/agents/ | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| To change a setting for a single-repository cloud session, commit the key to that repository's .claude/settings.json or set an environment variable on the environment | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| Terminal-only commands such as /plugin and /resume are not available in cloud sessions, and /clear does not work there | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| Auto-fix for pull requests requires the Claude GitHub App installed on the repository | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| Cloud sessions share rate limits with other Claude usage and have no separate compute charge | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| Repository cloning and pull request creation in cloud sessions require GitHub | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |
| claude --cloud and claude --teleport require sign-in with a claude.ai account, not an API key | https://code.claude.com/docs/en/claude-code-on-the-web | 2026-09-26 |

### Configure cloud environments

| Claim | Official URL | Checked |
| --- | --- | --- |
| In Anthropic-hosted cloud sessions, git push works only against the session's current working branch | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| In Anthropic-hosted cloud sessions, cloning, fetching and PR operations work normally through the GitHub proxy | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| The GitHub proxy keeps real GitHub credentials outside the session VM | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| The GitHub proxy serves only a pinned set of GraphQL operations, so GraphQL-only APIs such as Projects v2 are unreachable | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| Cloud sessions start from a fresh clone of the repository, so only committed configuration is available | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| The repo's CLAUDE.md, .claude/rules/, .claude/skills/, .claude/agents/ and .claude/commands/ are available in cloud sessions | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| The repo's .claude/settings.json hooks and permission rules apply in a cloud session with one repository | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| A cloud session with several repositories, including a project thread, does not read the repos' .claude/settings.json hooks and permission rules | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| Plugins declared in the repo's .claude/settings.json are not installed in cloud sessions | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| User-level ~/.claude/CLAUDE.md, skills, agents and commands are not available in cloud sessions | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| Anthropic-hosted cloud sessions run on Ubuntu 24.04 x86_64 VMs with common toolchains, gh and jq pre-installed | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| Node.js 20, 21 and 22 are installed in cloud sessions with 22 on PATH, plus npm, yarn, pnpm, eslint and prettier | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |
| Environment variables and setup scripts of a cloud environment are readable by anyone who uses that environment | https://code.claude.com/docs/en/cloud-environments | 2026-09-26 |

### Desktop quickstart

| Claim | Official URL | Checked |
| --- | --- | --- |
| Claude Code in the desktop app requires a Pro, Max, Team or Enterprise subscription | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| The desktop app has Chat, Cowork and Code tabs, and Claude Code sessions run in the Code tab | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| The desktop app includes Claude Code, so Node.js or the CLI is not needed for the Code tab | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| To start a local session, open the Code tab, select Local, click Select folder and choose the project directory | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| The desktop Code tab can also run Cloud, SSH and WSL sessions | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| In the desktop app, typing / or clicking + then Slash commands lists built-in commands, custom skills and plugin skills | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| The desktop permission modes are Auto, Manual, Accept edits and Plan | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |
| A Windows x64 installer is offered for the desktop app, with a separate ARM64 installer | https://code.claude.com/docs/en/desktop-quickstart | 2026-09-26 |

## GitHub, GitHub Actions, Playwright and lychee


### Protected branches (about page)

| Claim | Official URL | Checked |
| --- | --- | --- |
| Protected branches are available in public repositories on GitHub Free and GitHub Free for organizations | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Private repositories need GitHub Pro, Team, Enterprise Cloud or Enterprise Server for protected branches | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| By default branch protection restrictions do not apply to people with admin permissions | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| The setting "Do not allow bypassing the above settings" applies the restrictions to admins too | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Actors can be added to bypass lists only when the repository belongs to an organization | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Required status checks must have a successful, skipped or neutral status before merging | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Required status checks can be checks or commit statuses | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Any person or integration with write permission can set the state of any status check in the repository | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| A required status check can be pinned to an expected source app, otherwise "any source" is accepted | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Strict mode is the "Require branches to be up to date before merging" checkbox and is the default behaviour | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Job names should be unique across all workflows when they are used as required status checks | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Required pull request reviews are an optional setting of a branch protection rule | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |
| Restricting who can push is available for public repos of a GitHub Free organization and for org repos on Team or Enterprise Cloud, not for personal repos | https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches | 2026-09-26 |

### Troubleshooting required status checks

| Claim | Official URL | Checked |
| --- | --- | --- |
| A required status check must have completed successfully in the repository during the past seven days | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| If a check and a commit status have the same name, both must pass when that name is required | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| Required checks must pass on the latest commit SHA; checks from earlier commits do not count | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| If the test merge commit has a status the merge commit must pass, otherwise the head commit must pass | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| Checks from workflow jobs count for a pull request only if the run was triggered by push, pull_request, pull_request_review, pull_request_target, deployment or deployment_status | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| That trigger restriction applies only to checks created by workflow jobs, not to checks created by an external GitHub App | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| A workflow skipped by path or branch filtering leaves its required checks Pending and blocks merging | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| A job skipped by an if conditional reports Success | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| A job whose needs dependency failed is skipped and may not block merging; use always() with needs for required checks | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |
| A merge queue needs the merge_group event added as a trigger or the required check is never reported | https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks | 2026-09-26 |

### REST: branch protection

| Claim | Official URL | Checked |
| --- | --- | --- |
| PUT /repos/{owner}/{repo}/branches/{branch}/protection updates branch protection | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| The PUT body requires required_status_checks, enforce_admins, required_pull_request_reviews and restrictions, and each one may be null | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Inside required_status_checks, strict (boolean) and contexts (array) are both marked Required | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| The contexts field is under a closing down notice; the docs recommend checks instead | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Each entry in checks has context (required) and app_id (optional; -1 allows any app) | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Omitting app_id automatically selects the GitHub App that recently provided the check | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| enforce_admins set to true enforces required status checks for repository administrators | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| required_approving_review_count accepts 1 to 6, or 0 to require no reviewers | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Setting required_pull_request_reviews to null disables required reviews | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| User, app and team push restrictions are only available for organization-owned repositories; null disables restrictions | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| dismissal_restrictions should be omitted for personal repositories | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Updating branch protection needs a fine-grained token with Administration repository permission (write) | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| Protecting a branch requires admin or owner permission on the repository | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| The current REST API version shown in examples is 2026-03-10 | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins turns on admin enforcement | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |
| PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks accepts strict, contexts and checks | https://docs.github.com/en/rest/branches/branch-protection | 2026-09-26 |

### REST: commit statuses

| Claim | Official URL | Checked |
| --- | --- | --- |
| POST /repos/{owner}/{repo}/statuses/{sha} creates a commit status and returns 201 | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| The state field is required and must be one of error, failure, pending or success | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| target_url and description are optional and may be null | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| context is optional, defaults to "default", and is case-insensitive | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| There is a limit of 1000 statuses per sha and context within a repository | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| Creating a commit status needs a fine-grained token with Commit statuses repository permission (write) | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| The repo:status OAuth scope grants access to statuses without granting access to code | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| The combined status is failure if any context reports error or failure | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |
| Listing statuses returns them newest first | https://docs.github.com/en/rest/commits/statuses | 2026-09-26 |

### REST: deployment statuses

| Claim | Official URL | Checked |
| --- | --- | --- |
| A deployment status state can be error, failure, inactive, in_progress, queued, pending or success | https://docs.github.com/en/rest/deployments/statuses | 2026-09-26 |
| log_url replaces target_url, and setting log_url also sets target_url to the same value | https://docs.github.com/en/rest/deployments/statuses | 2026-09-26 |
| environment_url sets the URL for accessing the environment | https://docs.github.com/en/rest/deployments/statuses | 2026-09-26 |

### Events that trigger workflows

| Claim | Official URL | Checked |
| --- | --- | --- |
| deployment_status has no activity types | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| For deployment_status, GITHUB_SHA is the commit to be deployed | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| For deployment_status, GITHUB_REF is the branch or tag to be deployed, and is empty for a commit deployment | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| A deployment status with state inactive does not trigger a workflow run | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| The deployment_status section has no default-branch-only note; repository_dispatch, status and workflow_run do | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| repository_dispatch only triggers if the workflow file exists on the default branch | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| For repository_dispatch, GITHUB_SHA is the last commit on the default branch and GITHUB_REF is the default branch | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| A repository_dispatch request must include event_type, limited to 100 characters | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| repository_dispatch client_payload is available as github.event.client_payload | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| client_payload allows at most 10 top-level properties and 65,535 characters | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| pull_request runs by default only for opened, synchronize and reopened | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| For pull_request, GITHUB_SHA is the last merge commit on refs/pull/N/merge | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| The pull request head commit is github.event.pull_request.head.sha | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| pull_request workflows do not run while the pull request has a merge conflict | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| GITHUB_TOKEN is read-only in pull requests from forks, and other secrets are not passed | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| The status event only triggers if the workflow file exists on the default branch | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |
| workflow_run cannot chain more than three levels of workflows | https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows | 2026-09-26 |

### GITHUB_TOKEN (old URL redirected)

| Claim | Official URL | Checked |
| --- | --- | --- |
| Old URL .../security-guides/automatic-token-authentication redirects to the tutorial authenticate-with-github_token | https://docs.github.com/en/actions/tutorials/authenticate-with-github_token | 2026-09-26 |
| Events triggered by GITHUB_TOKEN do not create workflow runs, except workflow_dispatch and repository_dispatch | https://docs.github.com/en/actions/concepts/security/github_token | 2026-09-26 |
| pull_request events (opened, synchronize or reopened) created with GITHUB_TOKEN produce runs that need approval | https://docs.github.com/en/actions/concepts/security/github_token | 2026-09-26 |
| To trigger workflows from a workflow, use a GitHub App installation token or a PAT instead of GITHUB_TOKEN | https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow | 2026-09-26 |
| GITHUB_TOKEN is a GitHub App installation access token scoped to the workflow repository | https://docs.github.com/en/actions/concepts/security/github_token | 2026-09-26 |
| GITHUB_TOKEN expires when the job finishes; the maximum lifetime on GitHub-hosted runners is 6 hours | https://docs.github.com/en/actions/concepts/security/github_token | 2026-09-26 |

### Workflow syntax

| Claim | Official URL | Checked |
| --- | --- | --- |
| permissions accepts statuses: read, write or none | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| permissions accepts deployments: read, write or none | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| If you set any permission explicitly, every permission you leave out becomes none | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| permissions: {} disables all permissions; read-all and write-all are also accepted | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| Fork pull_request runs get read-only write scopes unless "Send write tokens to workflows from pull requests" is enabled | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| Dependabot-triggered runs use a read-only GITHUB_TOKEN and cannot access secrets | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| A concurrency group expression can only use the github, inputs and vars contexts | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| concurrency cancel-in-progress: true also cancels a running job or workflow in the same group | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| concurrency queue accepts single (default) or max (up to 100 pending) | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| Combining queue: max with cancel-in-progress: true is a workflow validation error | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| Concurrency group names are case-insensitive | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |
| Concurrency group names must be unique across workflows; the docs build the group from github.workflow and github.ref | https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax | 2026-09-26 |

### Webhook payload: deployment_status

| Claim | Official URL | Checked |
| --- | --- | --- |
| No webhook event is fired for deployment statuses with an inactive state | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |
| The deployment_status payload has action "created" plus required deployment and deployment_status objects | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |
| deployment_status.state is described as pending, success, failure or error [data endpoint] | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |
| deployment_status has required fields environment and target_url, and optional environment_url and log_url [data endpoint] | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |
| deployment has required fields sha, ref, environment, original_environment and id; production_environment and transient_environment are optional [data endpoint] | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |
| A GitHub App needs at least read access to the Deployments permission to subscribe to deployment_status | https://docs.github.com/en/webhooks/webhook-events-and-payloads#deployment_status | 2026-09-26 |

### pnpm/action-setup

| Claim | Official URL | Checked |
| --- | --- | --- |
| pnpm/action-setup supports pnpm v12 and earlier; README examples use @v6 | https://github.com/pnpm/action-setup | 2026-09-26 |
| The latest pnpm/action-setup release is v6.1.0, published 2026-09-05 | https://github.com/pnpm/action-setup/releases | 2026-09-26 |
| The version input is optional when package.json has packageManager or devEngines.packageManager, and required otherwise | https://github.com/pnpm/action-setup | 2026-09-26 |
| The cache input defaults to false; cache_dependency_path defaults to pnpm-lock.yaml | https://github.com/pnpm/action-setup | 2026-09-26 |
| run_install defaults to null, which installs nothing | https://github.com/pnpm/action-setup | 2026-09-26 |
| pnpm/action-setup does not set up Node.js | https://github.com/pnpm/action-setup | 2026-09-26 |
| pnpm/setup@v1 is an alternative for pnpm v11+ that can also install Node.js | https://github.com/pnpm/action-setup | 2026-09-26 |
| The action throws "Multiple versions of pnpm specified" when the version input differs from package.json packageManager | https://raw.githubusercontent.com/pnpm/action-setup/ea17c68df8912ef543352723c149a84f56e3d413/src/install-pnpm/run.ts | 2026-09-26 |
| devEngines.packageManager takes priority over packageManager when version is omitted | https://raw.githubusercontent.com/pnpm/action-setup/ea17c68df8912ef543352723c149a84f56e3d413/src/install-pnpm/run.ts | 2026-09-26 |
| actions/checkout must run first if pnpm/action-setup is to read the version from package.json | https://raw.githubusercontent.com/pnpm/action-setup/ea17c68df8912ef543352723c149a84f56e3d413/src/install-pnpm/run.ts | 2026-09-26 |

### actions/setup-node

| Claim | Official URL | Checked |
| --- | --- | --- |
| actions/setup-node README examples use @v7 together with actions/checkout@v7 | https://github.com/actions/setup-node | 2026-09-26 |
| node-version-file accepts .nvmrc, .node-version, .tool-versions, mise.toml or package.json | https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md | 2026-09-26 |
| If both node-version and node-version-file are set, node-version is used | https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md | 2026-09-26 |
| With package.json, setup-node checks volta.node, then devEngines.runtime, then engines.node | https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md | 2026-09-26 |
| cache supports npm, yarn and pnpm, and the package manager must already be installed | https://github.com/actions/setup-node | 2026-09-26 |
| The documented pnpm order is checkout, pnpm/action-setup, then setup-node with cache: pnpm | https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md | 2026-09-26 |
| Since v6, automatic caching applies only to npm; pnpm caching needs the explicit cache input | https://github.com/actions/setup-node | 2026-09-26 |
| setup-node does not cache node_modules | https://github.com/actions/setup-node | 2026-09-26 |

### actions/checkout

| Claim | Official URL | Checked |
| --- | --- | --- |
| actions/checkout README usage is @v7 | https://github.com/actions/checkout | 2026-09-26 |
| fetch-depth defaults to 1; 0 fetches all history for all branches and tags | https://github.com/actions/checkout | 2026-09-26 |
| To check out the PR head commit instead of the merge commit, set ref to github.event.pull_request.head.sha | https://github.com/actions/checkout | 2026-09-26 |
| v7 refuses fork PR code under pull_request_target or workflow_run unless allow-unsafe-pr-checkout is true | https://github.com/actions/checkout | 2026-09-26 |
| The recommended permission for actions/checkout is contents: read | https://github.com/actions/checkout | 2026-09-26 |

### lychee-action and lychee CLI

| Claim | Official URL | Checked |
| --- | --- | --- |
| The latest lychee-action release is v2.9.0, published 2026-07-09; README examples use @v2 | https://github.com/lycheeverse/lychee-action/releases | 2026-09-26 |
| The lychee-action README recommends pinning to a fixed version or a commit SHA | https://github.com/lycheeverse/lychee-action | 2026-09-26 |
| The default lychee-action args are --verbose --no-progress './**/*.md' './**/*.html' './**/*.rst' | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action fail defaults to true | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action failIfEmpty defaults to true | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action format defaults to markdown and output defaults to lychee/out.md | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action jobSummary defaults to true and is written for Markdown output only | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action lycheeVersion defaults to v0.24.2 on the main branch action.yml | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| lychee-action exposes an exit_code output | https://raw.githubusercontent.com/lycheeverse/lychee-action/HEAD/action.yml | 2026-09-26 |
| A .lycheeignore file of regex lines excludes links | https://github.com/lycheeverse/lychee-action | 2026-09-26 |
| lychee --root-dir is required for absolute links in local files, otherwise they are errors | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| lychee --root-dir must be an absolute path and is prefixed to absolute links | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| lychee --base-url resolves relative links as if the local files were hosted at that URL | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| lychee --offline only checks local files and blocks network requests | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| By default lychee accepts a directory link if the directory exists; --index-files changes that | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| lychee --include-fragments with no value means anchor-only | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |
| The lychee CLI page is current as of lychee-v0.24.2 | https://lychee.cli.rs/guides/cli/ | 2026-09-26 |

### Playwright

| Claim | Official URL | Checked |
| --- | --- | --- |
| page.on('request') fires for every request the page issues, and the Request object is read-only | https://playwright.dev/docs/api/class-page | 2026-09-26 |
| page.waitForRequest takes a URL string, a RegExp or a predicate, with a 30 second default timeout | https://playwright.dev/docs/api/class-page | 2026-09-26 |
| The docs pattern is to create the waitForRequest or waitForResponse promise before the click, without await | https://playwright.dev/docs/network | 2026-09-26 |
| page.route and context.route can abort, fulfill or continue requests | https://playwright.dev/docs/network | 2026-09-26 |
| A glob URL pattern must match the entire URL | https://playwright.dev/docs/network | 2026-09-26 |
| If network events seem to be missing, set serviceWorkers to 'block' | https://playwright.dev/docs/network | 2026-09-26 |
| APIRequestContext get, fetch, head, post and similar methods accept maxRedirects; 0 means do not follow redirects | https://playwright.dev/docs/api/class-apirequestcontext | 2026-09-26 |
| maxRedirects defaults to 20, and exceeding it throws | https://playwright.dev/docs/api/class-apirequestcontext | 2026-09-26 |
| failOnStatusCode throws on non-2xx or non-3xx responses; by default any status is returned | https://playwright.dev/docs/api/class-apirequestcontext | 2026-09-26 |
| apiResponse.headers() returns an object of the response headers | https://playwright.dev/docs/api/class-apiresponse | 2026-09-26 |
| apiResponse.ok() is true only for status 200 to 299 | https://playwright.dev/docs/api/class-apiresponse | 2026-09-26 |
| baseURL is applied by page.goto, page.route, page.waitForURL, page.waitForRequest and page.waitForResponse through the URL() constructor | https://playwright.dev/docs/api/class-testoptions | 2026-09-26 |
| A baseURL with no trailing slash drops its last path segment for ./relative navigation | https://playwright.dev/docs/api/class-testoptions | 2026-09-26 |
| The request fixture uses baseURL and extraHTTPHeaders from use in the config | https://playwright.dev/docs/api-testing | 2026-09-26 |
| Test runner options go at the top level, not inside use | https://playwright.dev/docs/test-configuration | 2026-09-26 |
| projects entries have a name and their own use, e.g. devices['Desktop Chrome'] | https://playwright.dev/docs/test-configuration | 2026-09-26 |
| The recommended file upload API is locator.setInputFiles(); page.setInputFiles() is discouraged | https://playwright.dev/docs/input#upload-files | 2026-09-26 |
| setInputFiles accepts a {name, mimeType, buffer} object for in-memory files | https://playwright.dev/docs/input#upload-files | 2026-09-26 |
| For a dynamically created input, wait for the filechooser event then call fileChooser.setFiles() | https://playwright.dev/docs/input#upload-files | 2026-09-26 |
| In CI, browsers are installed with npx playwright install --with-deps | https://playwright.dev/docs/ci-intro | 2026-09-26 |
| The Playwright CI docs show running tests on deployment_status when the state is success | https://playwright.dev/docs/ci | 2026-09-26 |
| That example passes github.event.deployment_status.target_url in the PLAYWRIGHT_TEST_BASE_URL env var | https://playwright.dev/docs/ci | 2026-09-26 |

## Google tags, ActiveCampaign, MailerLite and Webflow


### Google consent mode (gtag and GTM)

| Claim | Official URL | Checked |
| --- | --- | --- |
| Consent mode v2 adds ad_user_data and ad_personalization alongside ad_storage and analytics_storage | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| ad_user_data and ad_personalization accept 'granted' or 'denied' | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| By default no consent mode values are set | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| gtag('consent', 'default', ...) must be called on every page before any command that sends measurement data such as config or event | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| wait_for_update takes a millisecond value controlling how long to wait before data is sent, for asynchronously loaded banners | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Google's example uses 'wait_for_update': 500 in the consent default call | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| The consent update command is gtag('consent', 'update', {...}) and is also used to change from granted to denied | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Consent mode does not save consent choices; the site must persist them and call update on subsequent pages | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| The consent default command accepts a region parameter using ISO 3166-2 codes | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| A consent default command without region applies to all visitors not covered by a region-specific command | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| The more specific region (for example US-CA over US) takes precedence | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Code order is vital: the consent default must run before the Google tag or GTM snippet or consent defaults will not work | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| The Tag Manager implementation example places the gtag consent default script before the GTM container snippet | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| URL passthrough is enabled with gtag('set', 'url_passthrough', true) before any config commands | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| With GTM, url_passthrough can be set on every page before the GTM install snippet via gtag set | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| For Google Ads and Floodlight in GTM, URL passthrough uses a Conversion Linker tag with Enable linking on all page URLs checked | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| For GA tags in GTM, URL passthrough is set via Fields to Set with Field Name url_passthrough and Value true | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| URL passthrough may append gclid, dclid, gclsrc, _gl and wbraid to internal links | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| URL passthrough only works when the outgoing link is on the same domain as the current page | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Ads data redaction is enabled with gtag('set', 'ads_data_redaction', true) | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| ads_data_redaction has no effect when ad_storage is granted or when gtag('consent') is not used | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| GTM consent templates should use setDefaultConsentState and updateConsentState, with gtagSet for ads_data_redaction and URL passthrough | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Inside GTM templates, gtag consent update must not be used instead of updateConsentState because gtag commands are queued | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |
| Consent updates should be sent on the page where consent is granted and well before the page unloads | https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced | 2026-09-26 |

### GTM install snippet

| Claim | Official URL | Checked |
| --- | --- | --- |
| The first GTM code block goes as high in the head tag as possible | https://support.google.com/tagmanager/answer/14847097 | 2026-09-26 |
| The second GTM code block (noscript iframe) goes immediately after the opening body tag | https://support.google.com/tagmanager/answer/14847097 | 2026-09-26 |
| The GTM head snippet loads https://www.googletagmanager.com/gtm.js with the container ID and dataLayer name | https://support.google.com/tagmanager/answer/14847097 | 2026-09-26 |
| The GTM noscript iframe loads https://www.googletagmanager.com/ns.html?id=GTM-XXXX with height 0 width 0 and display none | https://support.google.com/tagmanager/answer/14847097 | 2026-09-26 |
| The install page does not mention a custom loader domain | https://support.google.com/tagmanager/answer/14847097 | 2026-09-26 |
| developers.google.com/tag-platform/tag-manager/web now redirects to the Tag Manager Help "Create an account and container" article | https://support.google.com/tagmanager/answer/14842164 | 2026-09-26 |

### GTM consent trigger and consent settings

| Claim | Official URL | Checked |
| --- | --- | --- |
| Each web container includes a Consent Initialization - All Pages trigger by default | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| The Consent Initialization trigger always fires before all other tags, including Initialization triggers | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| The Consent Initialization trigger is for tags that set or update consent state, such as CMP tags or consent default tags | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| In custom HTML tags, commands using gtag() are not guaranteed to be available before the next trigger fires | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| Tag consent settings live under Advanced settings then Consent settings, with Additional consent checks options | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| Additional consent check options are Not set, No additional consent required, and Require additional consent for tag to fire | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |
| ad_user_data consent is required for measurement uses such as enhanced conversions and tag-based conversion tracking | https://support.google.com/tagmanager/answer/10718549?hl=en | 2026-09-26 |

### Google Ads conversion tag and Conversion Linker in GTM

| Claim | Official URL | Checked |
| --- | --- | --- |
| The GTM tag type path is Tag Configuration then Google Ads then Google Ads Conversion Tracking | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| Conversion ID and Conversion Label are required; Conversion Value, Transaction ID and Currency Code are optional | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| The Conversion ID is unique per Google Ads account and the Conversion Label is unique per conversion action | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| If Conversion Value is empty or undefined, GTM sends the value as 0 | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| Google recommends a Transaction ID from a data layer variable to avoid duplicate conversions | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| The Google Ads conversions article lists a Conversion linker tag and an installed Google tag as prerequisites | https://support.google.com/tagmanager/answer/6105160?hl=en | 2026-09-26 |
| The Conversion Linker tag type is selected under Tag Configuration as Conversion Linker | https://support.google.com/tagmanager/answer/7549390?hl=en | 2026-09-26 |
| In most cases the Conversion Linker should use the All Pages trigger | https://support.google.com/tagmanager/answer/7549390?hl=en | 2026-09-26 |
| If a container loads a Google tag on every page, it does not also need a conversion linker tag | https://support.google.com/tagmanager/answer/7549390?hl=en | 2026-09-26 |
| The conversion linker stores ad click info in _gcl_* cookies such as _gcl_aw and in local storage key _gcl_ls | https://support.google.com/tagmanager/answer/7549390?hl=en | 2026-09-26 |

### Auto-tagging, GCLID, GBRAID

| Claim | Official URL | Checked |
| --- | --- | --- |
| Auto-tagging appends a GCLID parameter to the clicked URL, for example ?gclid=123xyz | https://support.google.com/google-ads/answer/3095550?hl=en | 2026-09-26 |
| Auto-tagging is on by default for new Google Ads accounts | https://support.google.com/google-ads/answer/3095550?hl=en | 2026-09-26 |
| If the site uses redirects, the GCLID must be passed to the final landing page | https://support.google.com/google-ads/answer/3095550?hl=en | 2026-09-26 |
| Auto-tagging is toggled in Admin then Account settings then Auto-tagging | https://support.google.com/google-ads/answer/3095550?hl=en | 2026-09-26 |
| The GCLID is case sensitive | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| Google's GCLID example uses a hidden form input with id and name gclid_field | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| Google's suggested GCLID script stores the value in localStorage key gclid with a 90 day expiry | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| Google's suggested script only stores gclid when gclsrc is absent or contains aw | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| Google recommends the GCLID script on every page, immediately before the closing body tag | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| Google recommends starting with enhanced conversions for leads instead of adopting classic offline conversion import | https://support.google.com/google-ads/answer/7012522?hl=en | 2026-09-26 |
| GBRAID arrives as a URL parameter (&gbraid=xyz) and is case sensitive | https://support.google.com/google-ads/answer/17371255?hl=en | 2026-09-26 |
| Google advises capturing GBRAID in a hidden form field alongside the GCLID and storing both | https://support.google.com/google-ads/answer/17371255?hl=en | 2026-09-26 |
| Google recommends Data Manager (UI or Data Manager API) for uploading offline conversions with GBRAID | https://support.google.com/google-ads/answer/17371255?hl=en | 2026-09-26 |

### GTM triggers, exceptions, variables

| Claim | Official URL | Checked |
| --- | --- | --- |
| Every tag must have at least one trigger in order to fire | https://support.google.com/tagmanager/answer/7679316?hl=en | 2026-09-26 |
| Trigger filters use a Variable, an Operator and a Value, set via This trigger fires on then Some events | https://support.google.com/tagmanager/answer/7679316?hl=en | 2026-09-26 |
| A trigger exception (also called a blocking trigger) blocks another trigger's ability to fire | https://support.google.com/tagmanager/answer/7679318?hl=en | 2026-09-26 |
| Trigger exceptions are added in the tag's Triggering panel under the Exceptions section | https://support.google.com/tagmanager/answer/7679318?hl=en | 2026-09-26 |
| A tag fires when the conditions for any one of its firing triggers are met | https://support.google.com/tagmanager/answer/7679318?hl=en | 2026-09-26 |
| The Custom Event trigger fires on an event name pushed to the data layer, with optional regex matching | https://support.google.com/tagmanager/answer/7679219?hl=en | 2026-09-26 |
| The Custom Event example pushes dataLayer.push({'event':'button1-click','conversionValue':25}) | https://support.google.com/tagmanager/answer/7679219?hl=en | 2026-09-26 |
| Google suggests reading pushed values with a data layer variable, for example in the Google Ads conversion value field | https://support.google.com/tagmanager/answer/7679219?hl=en | 2026-09-26 |
| User-defined variables are created under Variables then User-Defined Variables then New | https://support.google.com/tagmanager/answer/7683362?hl=en | 2026-09-26 |
| The Data layer variable takes its value from dataLayer.push and supports Version 1 and Version 2 key interpretation | https://support.google.com/tagmanager/answer/7683362?hl=en | 2026-09-26 |
| Data layer Version 2 interprets dots in key names as nested values | https://support.google.com/tagmanager/answer/7683362?hl=en | 2026-09-26 |
| The Custom Event variable returns the name of the custom event pushed to the data layer | https://support.google.com/tagmanager/answer/7683362?hl=en | 2026-09-26 |
| The User-provided data variable supports Automatic, Manual and Code modes for email, phone, name and address | https://support.google.com/tagmanager/answer/7683362?hl=en | 2026-09-26 |

### GA4 in GTM and generate_lead

| Claim | Official URL | Checked |
| --- | --- | --- |
| GA4 in GTM uses tag type Google Tag with a Tag ID field | https://support.google.com/tagmanager/answer/9442095?hl=en | 2026-09-26 |
| Google's GA4 setup assigns the Google Tag the Initialization - All Initialization Events trigger | https://support.google.com/tagmanager/answer/9442095?hl=en | 2026-09-26 |
| GA4 events in GTM use the Google Analytics: GA4 Event tag type with Measurement ID and Event Name | https://support.google.com/tagmanager/answer/13034206?hl=en | 2026-09-26 |
| To send a recommended event, the GA4 Event tag must use one of the predefined event names | https://support.google.com/tagmanager/answer/13034206?hl=en | 2026-09-26 |
| generate_lead is the recommended event for when a lead has been generated, for example through a form | https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag | 2026-09-26 |
| generate_lead parameters are currency (string), value (number) and lead_source (string, optional) | https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag | 2026-09-26 |
| For generate_lead, currency is required when value is set, in 3-letter ISO 4217 format | https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag | 2026-09-26 |
| Google recommends setting value when generate_lead is marked as a key event | https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag | 2026-09-26 |
| The GTM version of generate_lead is a GA4 Event tag with Event Name generate_lead and parameters currency, value, lead_source | https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm | 2026-09-26 |

### ActiveCampaign API v3

| Claim | Official URL | Checked |
| --- | --- | --- |
| All ActiveCampaign API requests authenticate with an HTTP header named Api-Token | https://developers.activecampaign.com/reference/authentication | 2026-09-26 |
| The API key must not be exposed in client-side code | https://developers.activecampaign.com/reference/authentication | 2026-09-26 |
| The base URL is account-specific, in the form https://<your-account>.api-us1.com/api/3/<resource> | https://developers.activecampaign.com/reference/url | 2026-09-26 |
| The API URL shown in the user's Developer settings tab is the source of truth; api-us1.com is not guaranteed | https://developers.activecampaign.com/reference/url | 2026-09-26 |
| All ActiveCampaign API calls should be made over HTTPS | https://developers.activecampaign.com/reference/url | 2026-09-26 |
| The ActiveCampaign rate limit is 5 requests per second per account | https://developers.activecampaign.com/reference/rate-limits | 2026-09-26 |
| Exceeding the limit returns 429 Too Many Requests with a Retry-After header in seconds | https://developers.activecampaign.com/reference/rate-limits | 2026-09-26 |
| ActiveCampaign also returns RateLimit-Limit and RateLimit-Remaining headers | https://developers.activecampaign.com/reference/rate-limits | 2026-09-26 |
| POST /api/3/contact/sync upserts a single contact and rejects a contact array with more than one resource | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync looks up by contact.id (only with lookupByAcId=true), then whatsapp_id, then email, then phone only when no email is sent | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync body fields include email (required), firstName, lastName, phone and fieldValues as [{field, value}] | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync accepts a tags array of tag names; missing tags are auto-created and tagging is additive | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| Tags sent to contact/sync are not echoed in the response | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| A non-array tags value on contact/sync is rejected with 400 | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync accepts a lists array of objects, each with list (int32, required) plus optional sdate and autoresponder flags | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| A list named in contact/sync becomes an active membership, even if it was previously unconfirmed or unsubscribed | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| Resubscribing through contact/sync lists needs the pg_subscriber_resubscribe permission | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync lists memberships are additive and omission never unsubscribes | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| A malformed lists entry or nonexistent list fails the whole contact/sync request | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync also accepts ip4 (IPv4 opt-in address only), form (form ID), account, id and whatsapp_id | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync has optional top-level useDefaults and source fields beside contact | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| contact/sync documents 201 and 400 responses | https://developers.activecampaign.com/reference/sync-a-contacts-data | 2026-09-26 |
| POST /api/3/contactLists subscribes or unsubscribes a contact via a contactList object with list, contact and status | https://developers.activecampaign.com/reference/update-list-status-for-contact | 2026-09-26 |
| contactList status "1" subscribes and "2" unsubscribes | https://developers.activecampaign.com/reference/update-list-status-for-contact | 2026-09-26 |
| Changing contactList status from unsubscribed to active resubscribes a contact who manually unsubscribed | https://developers.activecampaign.com/reference/update-list-status-for-contact | 2026-09-26 |
| contactList sourceid defaults to 0 and should be 4 when resubscribing | https://developers.activecampaign.com/reference/update-list-status-for-contact | 2026-09-26 |
| POST /api/3/contactTags adds one tag by id using a contactTag object with contact and tag | https://developers.activecampaign.com/reference/create-contact-tag | 2026-09-26 |
| POST /api/3/contactTags documents 201, 404 and 422 responses | https://developers.activecampaign.com/reference/create-contact-tag | 2026-09-26 |
| POST /api/3/contacts/{contactId}/tags adds up to 100 tags by name (tags) or id (tagIds) in one request | https://developers.activecampaign.com/reference/add-tags-to-a-contact | 2026-09-26 |
| The batch tags endpoint creates missing tag names unless createMissing is false, and repeating it is safe | https://developers.activecampaign.com/reference/add-tags-to-a-contact | 2026-09-26 |

### MailerLite API

| Claim | Official URL | Checked |
| --- | --- | --- |
| The MailerLite base URL is https://connect.mailerlite.com/api | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| Every MailerLite request should send Content-Type: application/json and Accept: application/json | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| MailerLite authenticates with an Authorization: Bearer token header | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| An invalid MailerLite token returns 401 with message Unauthenticated. | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| MailerLite API keys stop working if the user who created them is removed or deleted | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| The API version can be pinned with an X-Version header holding a date | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| MailerLite has a global rate limit of 120 requests per minute | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| Exceeding the MailerLite limit returns 429 with message Too Many Attempts. | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| MailerLite 429 responses include X-RateLimit-Limit, X-RateLimit-Remaining and Retry-After headers | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| Import endpoints and batch requests made only of POST api/subscribers items are limited to 5 requests per minute | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| MailerLite validation errors return 422 with message and an errors object keyed by field | https://developers.mailerlite.com/getting-started | 2026-09-26 |
| POST https://connect.mailerlite.com/api/subscribers creates or updates (upserts) a subscriber | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| The subscriber upsert is non-destructive: omitted fields or groups are not removed | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| Upsert body: email (required), fields object, groups array of existing group ids, status, subscribed_at, ip_address, opted_in_at, optin_ip, unsubscribed_at, resubscribe | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| Subscriber status values are active, unsubscribed, unconfirmed, bounced and junk | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| MailerLite date fields use the format yyyy-MM-dd HH:mm:ss | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| The upsert resubscribe flag set to true resubscribes previously unsubscribed subscribers | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| Upsert returns 201 Created for a new subscriber and 200 OK for an existing one | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| On PUT update, unsubscribed, bounced or junk subscribers cannot be reactivated via the API | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| Such subscribers can only be reactivated through the app, a form or a landing page | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |
| PUT /api/subscribers/:id removes the subscriber from groups not listed in groups | https://developers.mailerlite.com/api/subscribers | 2026-09-26 |

### Webflow 301 redirects

| Claim | Official URL | Checked |
| --- | --- | --- |
| A Webflow redirect CSV has two columns, old path and redirect-to path, with one row per redirect | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| The Webflow import article does not name exact CSV header strings | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| Importing a redirect CSV overwrites and removes all existing redirects on the site | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| The maximum redirect CSV file size is 16MB | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| Any invalid redirect makes the whole import fail, with an emailed CSV explaining the errors | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| Import and export are in Site settings then Publishing then 301 redirects, and the site must be published after import | https://help.webflow.com/hc/en-us/articles/33961211526291-Import-export-301-redirects | 2026-09-26 |
| Webflow 301 redirects need a paid Site plan or a paid Workspace plan | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Webflow recommends a maximum of 1,000 redirects and wildcard rules where possible | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Webflow folder redirects use the capture group (.*) in Old path and %1 in Redirect to path | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Multiple capture groups map to %1, %2 and so on, for example /blogs/(.*)/(.*) to /articles/%1/%2 | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Special characters in Old path must be escaped with a % prefix; the Redirect to path needs no escaping | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Webflow runs redirects oldest first, so specific rules must be added before broad wildcards | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Webflow strips a trailing slash directly before a query string before matching redirects | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| Webflow redirects are relative to the root domain and do not apply to localized slugs or subdirectories | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
| An existing live static page must be deleted, drafted or re-slugged before a redirect from its URL works | https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow | 2026-09-26 |
