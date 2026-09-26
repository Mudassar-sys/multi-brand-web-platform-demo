# Paintline section catalog

Generated from `packages/brand-paintline/src/schemas.ts` by `pnpm sections`. Do not edit by hand.

Rules for every page in `src/content/pages/`:

- Use only the section types listed below. Anything else fails the build.
- The first section must be one of `hero` or `pageHeader`, and a page has exactly one of them (it holds the H1).
- Page fields: `title` (10 to 70 characters), `description` (50 to 165 characters), optional `kind` (`page` or `landing`) and `noindex` (true or false).
- Links (`href`) start with `/`, `#`, `https://`, `mailto:` or `tel:`.

## Sections

- [`hero`](#hero): Hero
- [`pageHeader`](#pageheader): Page header
- [`serviceCards`](#servicecards): Service cards
- [`processSteps`](#processsteps): Process steps
- [`gallery`](#gallery): Gallery
- [`surfaceGuide`](#surfaceguide): Surface guide
- [`packages`](#packages): Packages
- [`faq`](#faq): FAQ
- [`ctaBand`](#ctaband): CTA band
- [`quoteForm`](#quoteform): Quote form
- [`richText`](#richtext): Rich text

### hero

**Hero.** Opening block with the page H1, a pitch, up to two buttons, badges and a large mural concept on a wall.

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
| `badges` | list of text | no | 0 to 3 items; default: [] |
| `art` | one of: sunrise, botanical, geo, wave, city, abstract | no | default: "sunrise" |

Example:

```yaml
- type: hero
  eyebrow: Direct-to-wall mural printing
  heading: Big, bright walls printed in a day
  subheading: We print your artwork straight onto brick, drywall or concrete, on site, with no vinyl and no seams.
  primaryCta:
    label: Get a quote
    href: /contact
  badges:
    - Printed on site
  art: sunrise
```

### pageHeader

**Page header.** Compact title block with the page H1, an intro line and an optional small artwork.

Use when: First section of inner pages such as the quote page or a content page. Renders the page H1.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 4 to 90 characters |
| `intro` | text | no | 20 to 280 characters |
| `art` | one of: sunrise, botanical, geo, wave, city, abstract | no |  |

Example:

```yaml
- type: pageHeader
  eyebrow: Quote
  heading: Tell us about your wall
  intro: Send a photo and rough measurements. We reply with a price range within one business day.
  art: geo
```

### serviceCards

**Service cards.** Rounded cards with an icon, title, short body and optional link, 2 to 6 cards.

Use when: Listing services or wall types. Keep each body under 200 characters.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `cards` | list of object | yes | 2 to 6 items |
| `cards[].icon` | one of: arrow-right, arrow-up-right, check, x, calendar, clock, map-pin, phone, mail, ruler, gauge, wrench, cpu, cog, truck, shield-check, layers, sparkles, palette, paint-roller, paintbrush, image, sun, droplets, building, store, coffee, graduation-cap, house, zap, box, scan-line, file-text, upload, timer, hammer, leaf | yes |  |
| `cards[].title` | text | yes | 3 to 60 characters |
| `cards[].body` | text | yes | 10 to 200 characters |
| `cards[].link` | object | no |  |
| `cards[].link.label` | text | yes | 2 to 40 characters |
| `cards[].link.href` | text | yes | a link (see the link rule above) |

Example:

```yaml
- type: serviceCards
  heading: Walls we print
  cards:
    - icon: coffee
      title: Cafes and restaurants
      body: Feature walls that make the room.
    - icon: building
      title: Offices
      body: Brand walls and wayfinding.
```

### processSteps

**Process steps.** Numbered steps with big serif numerals, 3 to 6 steps.

Use when: Explaining how a project runs from quote to reveal.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `steps` | list of object | yes | 3 to 6 items |
| `steps[].title` | text | yes | 3 to 60 characters |
| `steps[].body` | text | yes | 10 to 220 characters |

Example:

```yaml
- type: processSteps
  heading: How a wall comes together
  steps:
    - title: Send a photo
      body: A phone photo and rough size is enough to start.
    - title: Approve the proof
      body: We mock the design onto your wall.
    - title: Print day
      body: Most walls are printed in a single day.
```

### gallery

**Gallery.** Grid of mural concepts, each with a title, caption and space type. Uses generated artwork, labelled as illustrative.

Use when: Showing styles and ideas. Never present these as real client work.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `items` | list of object | yes | 3 to 9 items |
| `items[].art` | one of: sunrise, botanical, geo, wave, city, abstract | yes |  |
| `items[].title` | text | yes | 3 to 48 characters |
| `items[].caption` | text | yes | 10 to 140 characters |
| `items[].space` | text | yes | 3 to 40 characters |
| `note` | text | no | 10 to 160 characters; default: "Illustrative concepts created for this demo, not client projects." |

Example:

```yaml
- type: gallery
  heading: Style ideas
  items:
    - art: botanical
      title: Greenhouse
      caption: Oversized leaves for a plant-filled cafe.
      space: Cafe
    - art: geo
      title: Blocks
      caption: Bold shapes for a studio lobby.
      space: Office
    - art: wave
      title: Tide
      caption: Calm waves for a treatment room.
      space: Clinic
```

### surfaceGuide

**Surface guide.** Table of wall surfaces with a suitability rating (great, good, ask) and a note.

Use when: Answering "can you print on my wall?" before someone asks.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `surfaces` | list of object | yes | 3 to 10 items |
| `surfaces[].name` | text | yes | 2 to 40 characters |
| `surfaces[].rating` | one of: great, good, ask | yes |  |
| `surfaces[].note` | text | yes | 6 to 140 characters |

Example:

```yaml
- type: surfaceGuide
  heading: Will it work on my wall?
  surfaces:
    - name: Painted drywall
      rating: great
      note: Our most common surface.
    - name: Brick
      rating: good
      note: Texture shows through, which many people love.
    - name: Glass
      rating: ask
      note: Possible with a primer coat.
```

### packages

**Packages.** One to three price cards with an includes list; one can be highlighted. Requires a footnote.

Use when: Showing starting prices. Prices on this demo brand are illustrative.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `tiers` | list of object | yes | 1 to 3 items |
| `tiers[].name` | text | yes | 2 to 32 characters |
| `tiers[].price` | text | yes | 2 to 32 characters |
| `tiers[].summary` | text | yes | 10 to 160 characters |
| `tiers[].includes` | list of text | yes | 1 to 8 items |
| `tiers[].highlighted` | true or false | no | default: false |
| `tiers[].cta` | object | no |  |
| `tiers[].cta.label` | text | yes | 2 to 40 characters |
| `tiers[].cta.href` | text | yes | a link (see the link rule above) |
| `footnote` | text | yes | 10 to 200 characters |

Example:

```yaml
- type: packages
  heading: Starting prices
  tiers:
    - name: Feature wall
      price: From $900
      summary: One wall up to 10 m2.
      includes:
        - Design proof
  footnote: Illustrative demo pricing.
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
    - question: How long does printing take?
      answer: Most walls take one day on site.
    - question: Is the ink safe indoors?
      answer: We use low-odour, water-based inks.
```

### ctaBand

**CTA band.** Rounded call-to-action panel with a heading, one line of copy, up to two buttons and an optional artwork.

Use when: Closing a page with a clear next step.

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
| `art` | one of: sunrise, botanical, geo, wave, city, abstract | no |  |

Example:

```yaml
- type: ctaBand
  heading: Ready for a wall people talk about?
  primaryCta:
    label: Get a quote
    href: /contact
  art: abstract
```

### quoteForm

**Quote form.** Quote request form posting to the shared forms package (provider set in brand.config.ts). First name and email are always included. The optional attachment uploads up to 10 MB straight to Vercel Blob.

Use when: Quote page and landing pages. Use a unique formId per form.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 6 to 90 characters |
| `intro` | text | no | 20 to 260 characters |
| `formId` | text | yes | lowercase letters, numbers and hyphens |
| `fields` | list of one of: lastName, phone, company, city, wallSize, surface, message, attachment | no | default: ["wallSize","message","attachment"] |
| `surfaceOptions` | list of text | no | 0 to 8 items; default: [] |
| `submitLabel` | text | no | 2 to 32 characters; default: "Request a quote" |
| `successMessage` | text | yes | 10 to 200 characters |
| `aside` | object | no |  |
| `aside.title` | text | yes | 3 to 60 characters |
| `aside.points` | list of text | yes | 1 to 5 items |

Example:

```yaml
- type: quoteForm
  id: quote
  heading: Request a quote
  formId: quote-main
  fields:
    - wallSize
    - surface
    - message
    - attachment
  surfaceOptions:
    - Painted drywall
    - Brick
    - Not sure
  successMessage: Thanks. We will reply with a price range within one business day.
```

### richText

**Rich text.** Readable text column with an optional pull quote from the brand itself. Supports **bold** and [links](/path).

Use when: Long-form content such as care guides or how the printing works.

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `id` | text | no | lowercase letters, numbers and hyphens |
| `eyebrow` | text | no | 2 to 48 characters |
| `heading` | text | yes | 4 to 90 characters |
| `paragraphs` | list of text | yes | 1 to 12 items |
| `pullQuote` | text | no | 10 to 160 characters |

Example:

```yaml
- type: richText
  heading: Why direct-to-wall
  paragraphs:
    - Printing straight onto the wall means **no seams** and no peeling edges.
```
