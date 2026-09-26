# Kestrel section catalog

Generated from `packages/brand-kestrel/src/schemas.ts` by `pnpm sections`. Do not edit by hand.

Rules for every page in `src/content/pages/`:

- Use only the section types listed below. Anything else fails the build.
- The first section must be one of `hero` or `pageHeader`, and a page has exactly one of them (it holds the H1).
- Page fields: `title` (10 to 70 characters), `description` (50 to 165 characters), optional `kind` (`page` or `landing`) and `noindex` (true or false).
- Links (`href`) start with `/`, `#`, `https://`, `mailto:` or `tel:`.

## Sections

- [`hero`](#hero): Hero
- [`pageHeader`](#pageheader): Page header
- [`featureGrid`](#featuregrid): Feature grid
- [`specTable`](#spectable): Spec table
- [`processSteps`](#processsteps): Process steps
- [`comparisonTable`](#comparisontable): Comparison table
- [`eventDetails`](#eventdetails): Event details
- [`faq`](#faq): FAQ
- [`ctaBand`](#ctaband): CTA band
- [`leadForm`](#leadform): Lead form
- [`richText`](#richtext): Rich text

### hero

**Hero.** Full-width opening block with the page H1, a short pitch, up to two buttons and a technical drawing.

Use when: First section of the home page or a landing page. Exactly one H1 section per page. Renders the page H1.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 8 to 90 characters |
| `subheading` | text | yes | 20 to 260 characters |
| `primaryCta` | object | yes |  |
| `primaryCta.label` | text | yes | 2 to 40 characters |
| `primaryCta.href` | text | yes | a link (see the link rule above) |
| `secondaryCta` | object | no |  |
| `secondaryCta.label` | text | yes | 2 to 40 characters |
| `secondaryCta.href` | text | yes | a link (see the link rule above) |
| `highlights` | list of object | no | 0 to 4 items; default: [] |
| `highlights[].label` | text | yes | 2 to 24 characters |
| `highlights[].value` | text | yes | 1 to 24 characters |
| `visual` | one of: lathe, chuck, none | no | default: "lathe" |

Example:

```yaml
- type: hero
  eyebrow: Compact CNC lathes
  heading: Production-grade turning for a two-bay shop
  subheading: Bench-to-floor lathes sized for small machine shops, with training and setup included.
  primaryCta:
    label: Book a demo
    href: /contact
  highlights:
    - label: Swing
      value: 250 mm
  visual: lathe
```

### pageHeader

**Page header.** Compact title block with the page H1 and an optional intro line.

Use when: First section of inner pages such as Contact or a content page. Renders the page H1.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 4 to 90 characters |
| `intro` | text | no | 20 to 280 characters |

Example:

```yaml
- type: pageHeader
  eyebrow: Contact
  heading: Talk to an applications engineer
  intro: Tell us what you turn today and we will suggest a machine and tooling package.
```

### featureGrid

**Feature grid.** Grid of 2 to 8 short features, each with an icon, a title and one or two sentences.

Use when: Explaining benefits or what is included. Keep each body under 200 characters.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `columns` | always "2" or always "3" or always "4" | no | default: 3 |
| `features` | list of object | yes | 2 to 8 items |
| `features[].icon` | one of: arrow-right, arrow-up-right, check, x, calendar, clock, map-pin, phone, mail, ruler, gauge, wrench, cpu, cog, truck, shield-check, layers, sparkles, palette, paint-roller, paintbrush, image, sun, droplets, building, store, coffee, graduation-cap, house, zap, box, scan-line, file-text, upload, timer, hammer, leaf | yes |  |
| `features[].title` | text | yes | 3 to 60 characters |
| `features[].body` | text | yes | 10 to 200 characters |

Example:

```yaml
- type: featureGrid
  heading: Built for short runs and fast changeovers
  columns: 3
  features:
    - icon: gauge
      title: Rigid cast bed
      body: Meehanite-style cast iron damps chatter on interrupted cuts.
    - icon: cpu
      title: Conversational control
      body: Program simple parts at the machine without CAM.
```

### specTable

**Spec table.** Side-by-side specification table for 1 to 4 machine models.

Use when: Comparing models or listing technical specs. Each row needs one value per model.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `models` | list of text | yes | 1 to 4 items |
| `rows` | list of object | yes | 2 to 16 items |
| `rows[].label` | text | yes | 2 to 40 characters |
| `rows[].values` | list of text | yes |  |
| `footnote` | text | no | 10 to 200 characters |

Example:

```yaml
- type: specTable
  heading: Specifications
  models:
    - KL-160
    - KL-250
  rows:
    - label: Swing over bed
      values:
        - 160 mm
        - 250 mm
    - label: Spindle speed
      values:
        - 4,500 rpm
        - 4,000 rpm
```

### processSteps

**Process steps.** Numbered steps in a row (stacked on mobile), each with a title, body and optional duration.

Use when: Explaining how buying, installing or training works.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `steps` | list of object | yes | 2 to 6 items |
| `steps[].title` | text | yes | 3 to 60 characters |
| `steps[].body` | text | yes | 10 to 220 characters |
| `steps[].duration` | text | no | 2 to 24 characters |

Example:

```yaml
- type: processSteps
  heading: From first call to first chip
  steps:
    - title: Part review
      body: Send a drawing and we confirm fit.
      duration: Day 1
    - title: Install
      body: Rigging, levelling and a test cut.
      duration: Week 3
```

### comparisonTable

**Comparison table.** Two-column comparison with check marks or short text per row.

Use when: Contrasting the Kestrel approach with an alternative, such as a used import or a full-size lathe.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `columns` | object | yes |  |
| `columns.ours` | text | yes | 2 to 32 characters |
| `columns.other` | text | yes | 2 to 32 characters |
| `rows` | list of object | yes | 2 to 10 items |
| `rows[].label` | text | yes | 2 to 60 characters |
| `rows[].ours` | true or false or text | yes |  |
| `rows[].other` | true or false or text | yes |  |

Example:

```yaml
- type: comparisonTable
  heading: Why not a used full-size lathe?
  columns:
    ours: Kestrel KL-250
    other: Used full-size lathe
  rows:
    - label: Fits a 3 m bay
      ours: true
      other: false
    - label: Setup and training
      ours: Included
      other: Extra
```

### eventDetails

**Event details.** Date, time, location and agenda block for a showroom event, with an optional button.

Use when: Landing pages for demo days and open houses.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `date` | text | yes | 4 to 48 characters |
| `time` | text | yes | 4 to 48 characters |
| `location` | object | yes |  |
| `location.name` | text | yes | 2 to 60 characters |
| `location.address` | text | yes | 4 to 120 characters |
| `agenda` | list of object | yes | 1 to 8 items |
| `agenda[].time` | text | yes | 2 to 16 characters |
| `agenda[].title` | text | yes | 3 to 80 characters |
| `agenda[].body` | text | no | 10 to 200 characters |
| `cta` | object | no |  |
| `cta.label` | text | yes | 2 to 40 characters |
| `cta.href` | text | yes | a link (see the link rule above) |
| `note` | text | no | 10 to 200 characters |

Example:

```yaml
- type: eventDetails
  heading: Showroom demo day
  date: Saturday, 14 November
  time: 9:00 am to 2:00 pm
  location:
    name: Kestrel showroom
    address: 100 Example Parkway, Suite B
  agenda:
    - time: 9:00
      title: Doors open
```

### faq

**FAQ.** Accessible accordion of questions and answers (native details elements).

Use when: Answering objections near the bottom of a page. 2 to 12 questions.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 4 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `items` | list of object | yes | 2 to 12 items |
| `items[].question` | text | yes | 6 to 140 characters |
| `items[].answer` | text | yes | 10 to 600 characters |

Example:

```yaml
- type: faq
  heading: Questions
  items:
    - question: What power supply do I need?
      answer: Single-phase 230 V on the KL-160, three-phase on the KL-250.
    - question: Do you ship outside the US?
      answer: Not yet. Demo showroom deliveries are US-only.
```

### ctaBand

**CTA band.** Full-width call-to-action strip with a heading, one line of copy and up to two buttons.

Use when: Closing a page or splitting a long page with a clear next step.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `heading` | text | yes | 6 to 90 characters |
| `body` | text | no | 10 to 220 characters |
| `primaryCta` | object | yes |  |
| `primaryCta.label` | text | yes | 2 to 40 characters |
| `primaryCta.href` | text | yes | a link (see the link rule above) |
| `secondaryCta` | object | no |  |
| `secondaryCta.label` | text | yes | 2 to 40 characters |
| `secondaryCta.href` | text | yes | a link (see the link rule above) |
| `tone` | one of: accent, inverse | no | default: "inverse" |

Example:

```yaml
- type: ctaBand
  heading: See the KL-250 cut your part
  primaryCta:
    label: Book a demo
    href: /contact
  tone: accent
```

### leadForm

**Lead form.** Lead form posting to the shared forms package (provider set in brand.config.ts). First name and email are always included; choose the rest.

Use when: Contact pages and landing pages. Use a unique formId per form so tracking can tell forms apart.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `formId` | text | yes | lowercase letters, numbers and hyphens |
| `fields` | list of one of: lastName, phone, company, city, interest, message | no | default: ["lastName","company","message"] |
| `interestLabel` | text | no | 3 to 60 characters; default: "What are you interested in?" |
| `interestOptions` | list of text | no | 0 to 8 items; default: [] |
| `submitLabel` | text | no | 2 to 32 characters; default: "Send" |
| `successMessage` | text | yes | 10 to 200 characters |
| `points` | list of text | no | 0 to 5 items; default: [] |

Example:

```yaml
- type: leadForm
  id: book
  heading: Book a showroom demo
  formId: contact-demo
  fields:
    - lastName
    - company
    - interest
    - message
  interestOptions:
    - KL-160
    - KL-250
    - Not sure yet
  successMessage: Thanks. An applications engineer will reply within one business day.
```

### richText

**Rich text.** Readable text column with optional aside list. Supports **bold** and [links](/path) only.

Use when: Long-form content such as a showroom guide or buying advice.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 4 to 90 characters |
| `paragraphs` | list of text | yes | 1 to 12 items |
| `aside` | object | no |  |
| `aside.title` | text | yes | 3 to 60 characters |
| `aside.items` | list of text | yes | 1 to 8 items |

Example:

```yaml
- type: richText
  heading: Choosing a first CNC lathe
  paragraphs:
    - Start with the largest part you turn today and add **20 percent** headroom.
```
