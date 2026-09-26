## What changed

<!-- One or two sentences in plain words. Example: "New landing page /lp/open-house for Kestrel." -->

- Brand:
- Pages added or changed:

## Preview

Vercel adds a comment with a **Visit Preview** link for each brand this change touches, usually
within two minutes. Open it on your phone and your computer. Forms on previews go to the TEST
list, and Google Ads conversions never fire there.

## Checks

These must all be green before you merge. Nothing to do while they run.

- [ ] `ci`: build, page rules, unit tests, link check
- [ ] `preview-checks/kestrel`: tests on the Kestrel preview (or "not affected")
- [ ] `preview-checks/paintline`: tests on the Paintline preview (or "not affected")

If one is red, ask: "Why did the check fail on this PR?" and follow the answer.

## Going live and rolling back

Click **Merge** when everything is green. The live site updates in a few minutes.

If something is wrong after going live: Vercel > the brand's project > Deployments >
previous production deployment > **Instant Rollback**. After a rollback, new merges stay
off the live site until you click **Undo Rollback**. See docs/OWNER-RUNBOOK.md.
