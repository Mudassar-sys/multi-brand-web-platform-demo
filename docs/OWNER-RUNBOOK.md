# Owner runbook

For the two owners. No coding needed. You ask Claude Code for a page, check the preview link,
and merge. If anything looks wrong on the live site, you roll back with one click.

## 1. Start a Claude Code session

You need a Claude **Pro, Max or Team** plan (or an Enterprise seat that includes Claude Code)
for cloud sessions, and the Desktop app needs one of the same plans.

**Web or phone (recommended, nothing to install)**

1. Open claude.ai, go to **Code**, connect GitHub the first time, and pick this repository.
2. Type your request (see section 2). Claude works in a cloud copy of the repo.
3. Cloud sessions can only push their own working branch, and the diff view has a
   **Create PR** button. If Claude says "click Create PR", that is the button.
4. The Claude mobile apps (iOS and Android) show your cloud sessions, so you can follow
   progress and read the result from your phone.

**Desktop app (optional)**

Open the Claude desktop app, choose the **Code** tab, pick **Local**, click **Select folder**
and choose your copy of the repository. This needs the repository on your computer.

The repository's own rules (`CLAUDE.md`, the commands in `.claude/skills/` and the
guardrails in `.claude/settings.json`) load automatically in both.

## 2. What to ask for

| You want | Type this |
| --- | --- |
| A new ad landing page | `/new-landing-page kestrel "Open House Demo Day"` then paste your copy |
| A new normal page | `/new-page paintline "Care guide" /care` then paste your copy |
| A copy change | "On the kestrel contact page, change the heading to ..." then `/ship` |
| To know why a check is red | `/check kestrel pr` |
| A new kind of section | `/new-section paintline "VideoFeature" ...` (a developer reviews this one) |

Claude only uses the building blocks (sections) listed in each brand's `SECTIONS.md`. It will
refuse to invent testimonials, reviews, logos, ratings or statistics.

## 3. Read the preview

1. Open the pull request link Claude gives you.
2. Within about two minutes Vercel adds a comment with a **Visit Preview** link for each
   brand the change touched. Open it on your phone and your computer.
3. A dark badge in the corner says **Preview build**. On a preview:
   - forms go to the TEST list or group and are tagged `preview-test`
   - after you submit a form, a **Demo receipt** shows exactly where the lead would go
   - Google Ads conversions never fire
4. Want a change? Reply in the same Claude session ("make the headline shorter"). Claude
   pushes to the same branch and the preview updates.

## 4. Merge (go live)

The PR shows these checks. Wait until all are green:

- `ci`: the build, the page rules, unit tests and the link check
- `preview-checks/kestrel` and `preview-checks/paintline`: automated tests on each preview.
  A brand your change did not touch shows **Not affected**, which counts as green.

Then click **Merge pull request** and **Confirm merge**. The live site updates in a few
minutes, after the same tests pass on the production build (Vercel Deployment Checks).

## 5. Roll back (one click), then undo the rollback

If the live site looks wrong after a merge:

1. vercel.com > the brand's project (for example `kestrel-demo`) > **Deployments**.
2. Find the deployment that was live before (marked Production, one step older).
3. Open its **...** menu and choose **Instant Rollback**, then confirm. The old version is
   live within seconds.

Important: after a rollback, **new merges do not go live on their own**. The site stays on
the rolled-back version until you undo it. When the fix is merged:

4. Undo the rollback. On the project's Overview page a yellow bar says "To undo the
   rollback". Click **Manage** on that bar. In **Manage Rollback**, keep the deployment
   marked **Rolled Back** selected (or pick your newer fix), then click **Confirm**. That
   deployment is promoted, the live site switches to it within seconds, and automatic
   go-live is back on.

A rolled-back version also uses the settings it was built with (for example the form list
IDs), so it behaves exactly like it did before.

## 6. When a check fails

| Check | What it usually means | What to do |
| --- | --- | --- |
| `ci` | A page broke a rule, for example a description is too long, a section name is misspelled, or a link points nowhere | Ask `/check <brand> pr`. Claude explains in plain words and fixes the page |
| `preview-checks/<brand>` | The preview works differently from what the tests expect: a missing H1, a redirect that no longer works, a form that does not reach the TEST list | Ask `/check <brand> pr`. If the problem is in tracking or forms, a developer fixes it |
| Vercel build failed | Usually the same page-rule error as `ci` | Same as `ci` |

Never merge with a red check. The Merge button stays blocked until everything is green.

## 7. Guardrails you may notice

Some parts of the repository are off limits for Claude on purpose: the tracking package, the
forms package, the automated checks and the redirects converter. If you ask for a change there,
Claude stops with a message like "This file is protected ... ask a developer". That is
expected: those parts affect ad spend and lead data for every brand.

## 8. Words used here

- **PR (pull request)**: a proposed change you can preview before it goes live.
- **Preview**: a private copy of the site with your change, on its own link.
- **Merge**: accept the PR. That starts the production build.
- **Production**: the live site.
- **Rollback**: switch the live site back to an earlier version.
