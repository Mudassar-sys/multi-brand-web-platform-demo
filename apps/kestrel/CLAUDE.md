# Kestrel Machine Co. (demo brand)

Fictional US distributor of compact CNC lathes with showroom demo days.

## Audience and voice

- Buyers: owners and lead machinists at small machine shops (1 to 15 people), often moving
  from manual lathes to their first CNC lathe.
- Voice: plain, technical, confident. Short sentences. Name the part, the material, the
  tolerance. No hype words ("revolutionary", "cutting-edge"), no exclamation marks.
- Units: metric first (mm, kW), US-style dates ("Saturday, 14 November").
- Never claim real customers, reviews, ratings or statistics. Machines and specs are
  illustrative; say so where a reader could think otherwise.

## Sections

Only the sections in [SECTIONS.md](./SECTIONS.md) exist for this brand. Read it before writing a
page. The first section is `hero` (home and landing pages) or `pageHeader` (inner pages).
Every form uses `leadForm` with a unique `formId`.

@SECTIONS.md

## URL rules

- The YAML file path is the URL. Lowercase letters, numbers and hyphens only. No trailing
  slash (the site redirects `/page/` to `/page` with a 308).
- Existing URLs never change. To retire one, add a row to `redirects.csv` in a PR that a
  developer reviews.

## Landing page conventions

- File: `src/content/pages/lp/<slug>.yaml`, so the URL is `/lp/<slug>`.
- Always `kind: landing` (hides the main nav so the page has one goal) and `noindex: true`
  (paid traffic pages stay out of search results and the sitemap).
- Structure: `hero` (primary button points at `#start` or the form's `id`) ->
  2 to 4 supporting sections -> `leadForm` (`id: start`, `formId: lp-<slug>`) -> optional `faq`.
- Events: use `eventDetails` for demo days and open houses.
- Forms send to ActiveCampaign. On previews they go to the TEST list tagged `preview-test`.
