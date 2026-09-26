---
name: ship
description: Check, commit and push the current page changes and open (or update) the pull request with the owner-friendly template. Use after editing pages by hand.
argument-hint: [brand] ["short summary"]
disable-model-invocation: true
---

# Ship

Arguments: `$ARGUMENTS`

1. `git status --short`. If nothing changed, say so and stop.
2. If any changed file is under `packages/tracking/`, `packages/forms/`, `.github/`,
   `.claude/` or is `packages/config/src/redirects.mjs`, stop: those need a developer.
3. Work out the brand(s) from the changed paths (`apps/<brand>/...`). Run `pnpm verify <brand>`
   for each. Fix page YAML only; stop after 3 failed attempts and explain.
4. Branch: if on `main`, `git switch -c page/<short-slug-of-summary>`; otherwise stay.
5. `git add` only the changed page files, then `git commit -m "<brand>: <summary>"`.
6. `git push -u origin HEAD`.
7. If a PR already exists for this branch (`gh pr view` succeeds), report its link. Otherwise
   open one as in `/new-landing-page` step 9, or ask the owner to click **Create PR**.
8. Report the PR link and remind the owner to wait for `ci` and `preview-checks/<brand>`.
