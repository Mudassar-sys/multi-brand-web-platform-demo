---
name: new-landing-page
description: Create an ad landing page for one brand using only that brand's section catalog, run the checks, push a branch and open a pull request with a Vercel preview. Use when an owner asks for a new landing page.
argument-hint: <brand> "<title>" [copy or notes]
disable-model-invocation: true
---

# New landing page

Arguments: `$ARGUMENTS`

- Brand: `$0` (must be a folder in `apps/`)
- Title: `$1`
- Anything after the title is the owner's copy or notes. Use it; do not invent facts.

Follow these steps in order. Do not skip the checks.

1. **Validate the brand.** If `apps/$0/` does not exist, list the folders in `apps/` and stop.
2. **Read the rules.** Read `apps/$0/CLAUDE.md` and `apps/$0/SECTIONS.md`. Use ONLY the section
   types and fields listed in `SECTIONS.md`, with their limits (characters, item counts).
3. **Pick the URL.** Slug = the title in lowercase, words joined by hyphens, only `a-z`, `0-9`
   and `-`, at most 50 characters. File: `apps/$0/src/content/pages/lp/<slug>.yaml`. URL:
   `/lp/<slug>`. If the file already exists, stop and ask for a different title.
4. **Branch.** Run `git rev-parse --abbrev-ref HEAD`.
   - On `main`: run `git switch -c page/<slug>`.
   - On any other branch: stay on it (cloud sessions can only push their own working branch).
5. **Write the page** following the brand's landing page conventions in its `CLAUDE.md`:
   - `title` (10 to 70 characters) and `description` (50 to 165 characters)
   - `kind: landing` and `noindex: true`
   - first section `hero`, its main button pointing at the form's `id`
   - 2 to 4 supporting sections that fit the copy
   - the brand's form section with `formId: lp-<slug>` (shorten to 40 characters if needed)
   - no testimonials, reviews, logos, ratings or statistics; mark any needed placeholder as
     `[Placeholder: ...]`; no em dashes
6. **Check.** Run `pnpm verify $0`. If it fails, read the error, fix the YAML only (never code
   or protected packages) and run it again. After 3 failed attempts, stop and report the error
   in plain language.
7. **Commit.** `git add apps/$0/src/content/pages/lp/<slug>.yaml` then
   `git commit -m "Add $0 landing page: <title>"`.
8. **Push.** `git push -u origin HEAD`.
9. **Pull request.**
   - If `gh auth status` succeeds: write the filled-in `.github/pull_request_template.md` to
     `.git/PR_BODY.md` (what changed, the page URL, the brand) and run
     `gh pr create --base main --title "$0: <title> landing page" --body-file .git/PR_BODY.md`.
   - Otherwise tell the owner: "Click **Create PR** to open the pull request."
10. **Report** in plain language: the PR link, the page path (`/lp/<slug>`), that Vercel will
    post a preview link on the PR in a minute or two, and that `ci` and
    `preview-checks/$0` must turn green before merging.
