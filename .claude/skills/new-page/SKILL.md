---
name: new-page
description: Create a new regular (indexed) page for one brand from that brand's section catalog, run the checks, push and open a pull request. Use when an owner asks for a new content page that is not an ad landing page.
argument-hint: <brand> "<title>" [path] [copy or notes]
disable-model-invocation: true
---

# New page

Arguments: `$ARGUMENTS`

- Brand: `$0` (a folder in `apps/`)
- Title: `$1`
- Optional path: `$2` if it starts with `/` (for example `/guides/lathe-sizing`); otherwise the
  slug of the title. Everything else is the owner's copy or notes.

1. If `apps/$0/` does not exist, list the folders in `apps/` and stop.
2. Read `apps/$0/CLAUDE.md` and `apps/$0/SECTIONS.md`. Use only the listed sections and fields.
3. The path decides the file: `/guides/lathe-sizing` is
   `apps/$0/src/content/pages/guides/lathe-sizing.yaml`. Paths use `a-z`, `0-9`, `-` and `/`
   only, no trailing slash. Never reuse or rename an existing file (URLs must not change). Do
   not use the `lp/` folder; that is for `/new-landing-page`.
4. Branch: if on `main`, `git switch -c page/<slug>`; otherwise stay on the current branch.
5. Write the YAML: `title`, `description`, `kind: page` (omit `noindex`), first section
   `pageHeader` (or `hero` for a major page), then the sections the copy needs. If the page
   should be in the main navigation, say so in the PR; nav lives in `brand.config.ts` and needs
   developer review.
6. Run `pnpm verify $0`. Fix YAML only, up to 3 attempts.
7. `git add` the new file, `git commit -m "Add $0 page: <title>"`, `git push -u origin HEAD`.
8. Open the PR exactly as in step 9 of `/new-landing-page` (`gh pr create` with the template,
   or ask the owner to click **Create PR**).
9. Report the PR link and the page path in plain language.
