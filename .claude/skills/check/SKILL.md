---
name: check
description: Run every local check for a brand and explain any failure in plain language, or read the status of the checks on the current pull request.
argument-hint: <brand> [pr]
---

# Check

Arguments: `$ARGUMENTS` (brand: `$0`)

1. If no brand was given, run the checks for every folder in `apps/` that has changes on this
   branch (`git diff --name-only origin/main...HEAD`).
2. Run `pnpm verify $0`.
3. If `$1` is `pr` or the owner asks about the pull request, run `gh pr checks` (if `gh` is
   available) and list each check with its state.
4. Explain the result for a non-developer:
   - which check failed (catalog, build, types, unit test, link check, preview checks)
   - the file and line, and what it means in plain words (for example "the description on
     `lp/spring-demo.yaml` is 172 characters; the limit is 165")
   - the fix you propose. Apply it only if it is in page YAML; anything in `packages/`,
     `.github/` or `.claude/` is for a developer.
5. Never mark a failing check as acceptable and never skip or disable a check.
