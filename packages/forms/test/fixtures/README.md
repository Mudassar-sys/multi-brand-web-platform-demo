# Fixtures

Request bodies copied from the providers' own API reference examples, used to
prove the payload builders produce exactly the documented shape.

- `activecampaign-contact-sync.json`: the example request on
  https://developers.activecampaign.com/reference/sync-a-contacts-data
  (email, names, phone, fieldValues and tags from the example; `lists` follows
  the documented body schema with a placeholder list ID).
- `mailerlite-create-subscriber.json`: the create/upsert example on
  https://developers.mailerlite.com/docs/subscribers.html (email, fields and
  groups; optional status and dates omitted).

Checked on 26 Sep 2026. See docs/SOURCES.md.
