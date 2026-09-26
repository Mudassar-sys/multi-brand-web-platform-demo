# Paintline Murals (demo brand)

Fictional direct-to-wall mural printing service. Quote form accepts one optional file up to 10 MB.

## Audience and voice

- Buyers: cafe and restaurant owners, office and facilities managers, schools and clinics.
- Voice: warm, visual, practical. Describe how the room will feel, then the facts (surface,
  size, one print day). British-neutral spelling is fine ("colour"), stay consistent per page.
- Never claim real clients, reviews, ratings or statistics. Gallery items are generated
  concepts and must stay labelled as illustrative. Prices are illustrative.

## Sections

Only the sections in [SECTIONS.md](./SECTIONS.md) exist for this brand. Read it before writing a
page. The first section is `hero` (home and landing pages) or `pageHeader` (inner pages).
Every form uses `quoteForm` with a unique `formId`.

@SECTIONS.md

## URL rules

- The YAML file path is the URL. Lowercase letters, numbers and hyphens only. No trailing
  slash (the site redirects `/page/` to `/page` with a 308).
- Existing URLs never change. To retire one, add a row to `redirects.csv` in a PR that a
  developer reviews.

## Landing page conventions

- File: `src/content/pages/lp/<slug>.yaml`, so the URL is `/lp/<slug>`.
- Always `kind: landing` and `noindex: true`.
- Structure: `hero` (primary button points at `#quote`) -> 2 to 4 supporting sections
  (`serviceCards`, `gallery`, `surfaceGuide`) -> `quoteForm` (`id: quote`,
  `formId: lp-<slug>`, include `attachment`) -> optional `faq`.
- Forms send to MailerLite. On previews they go to the TEST group tagged `preview-test`.
