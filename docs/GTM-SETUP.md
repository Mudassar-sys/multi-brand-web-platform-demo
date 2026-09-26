# GTM setup (about 10 minutes per brand)

The site already does its part of the tracking contract (tested on every preview):

1. `dataLayer` starts with `{ site_env, brand }`. `site_env` is `production`, `preview` or
   `development`, taken from Vercel's environment at build time.
2. A consent default for all four consent mode v2 parameters runs next, with per-brand
   regions, `wait_for_update: 500`, `url_passthrough` and `ads_data_redaction`.
3. The GTM snippet loads only when the Vercel project has `PUBLIC_GTM_ID` set.
4. After the server accepts a lead, the page pushes
   `{ event: 'generate_lead', form_id, brand, lead_provider, site_env }`.

Your job in GTM is to map that one event to GA4 and Google Ads, and to make sure the Ads
conversion can never fire outside production. Names below are the exact names used in the
GTM interface; each is sourced in [SOURCES.md](./SOURCES.md) (Google tags section).

## Before you start

- A GA4 property with a web data stream. Copy the Measurement ID (`G-...`).
- A Google Ads conversion action for leads. Copy its **Conversion ID** and
  **Conversion Label**.
- A GTM **web** container per brand. Copy the container ID (`GTM-...`).

## 1. Variables

Variables > User-Defined Variables > New, type **Data Layer Variable**, Data Layer Version 2:

| Variable name | Data Layer Variable Name |
| --- | --- |
| `DLV - site_env` | `site_env` |
| `DLV - brand` | `brand` |
| `DLV - form_id` | `form_id` |
| `DLV - lead_provider` | `lead_provider` |

Also create two **Constant** variables: `Const - Ads Conversion ID` and
`Const - Ads Conversion Label`, holding the values from Google Ads.

## 2. Triggers

| Trigger name | Type | Settings |
| --- | --- | --- |
| `CE - generate_lead` | **Custom Event** | Event name `generate_lead`, fires on All Custom Events |
| `Block - not production` | **Custom Event** | Event name `.*`, **Use regex matching** on, fires on Some Custom Events: `DLV - site_env` **does not equal** `production` |

`Block - not production` is used only as an **exception** (a blocking trigger). It matches
every custom event on previews and local builds, so any tag that lists it as an exception
cannot fire there.

## 3. Tags

| Tag name | Tag type | Key settings | Triggering |
| --- | --- | --- | --- |
| `Google Tag - GA4` | **Google Tag** | Tag ID: your `G-...` | **Initialization - All Initialization Events** |
| `Conversion Linker` | **Conversion Linker** | defaults | **All Pages** |
| `GA4 Event - generate_lead` | **Google Analytics: GA4 Event** | Measurement ID: your `G-...`; Event Name: `generate_lead`; event parameters `form_id` = `{{DLV - form_id}}`, `brand` = `{{DLV - brand}}`, `lead_source` = `{{DLV - lead_provider}}` | `CE - generate_lead` |
| `Google Ads - Lead conversion` | **Google Ads Conversion Tracking** (under Google Ads) | Conversion ID `{{Const - Ads Conversion ID}}`, Conversion Label `{{Const - Ads Conversion Label}}` | Firing: `CE - generate_lead`. **Exceptions: `Block - not production`** |

Notes:

- Google says a container that loads a Google tag on every page does not also need a
  Conversion Linker. Keeping one on All Pages is harmless and makes the Ads setup
  independent of the GA4 tag.
- If you later send a lead value, `generate_lead` requires `currency` whenever `value` is
  set. Leave both out until the business sets a lead value.
- Leave each tag's consent settings on the built-in checks (Advanced settings > Consent
  settings > Additional consent checks: **Not set**). The page already sets the consent
  default before GTM loads.

## 4. Consent banner for production

The sites ship a minimal Accept / Reject banner for the demo. For real traffic from the
EEA, the UK or Switzerland, replace it with a Google-certified CMP: add the CMP's GTM
template tag on **Consent Initialization - All Pages**, then remove the demo banner
component in a developer PR.

## 5. Test in GTM Preview, then publish

1. In GTM click **Preview** and enter a Vercel **preview** URL of the brand (from any PR).
2. Submit the form on the page (wait a few seconds before submitting; the spam guard rejects
   instant submissions).
3. In Tag Assistant, on the `generate_lead` event: `GA4 Event - generate_lead` **fired**,
   `Google Ads - Lead conversion` is under **Tags Not Fired** (blocked by the exception).
4. Repeat on the production URL: both fire.
5. **Submit** the container version with a clear name, for example "Lead tracking v1".

## 6. Add the container ID to Vercel

For each brand's Vercel project: Settings > Environment Variables > add `PUBLIC_GTM_ID` =
`GTM-...` for **Production** and **Preview**, then redeploy (Deployments > latest > Redeploy).
Previews then load GTM too, which is how step 5 works; the exception keeps Ads silent there.

## 7. Re-run the live tracking test

Open any PR (or re-run `preview-checks` on an existing one). The tracking contract test then
also checks that the GTM snippet comes after the consent default, and the Ads check confirms
zero Google Ads requests on the preview.
