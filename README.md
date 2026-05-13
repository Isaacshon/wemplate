# Wemplate

Wemplate is a premium template marketplace with an Ang Studio-inspired scroll gallery, price-tier indexes, Stripe Checkout, and a daily rule-based template generator.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

If Stripe, Supabase, or Resend env vars are missing, the storefront still works with seed templates. Checkout returns a clear configuration error until `STRIPE_SECRET_KEY` is set.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `templates`: published marketplace templates.
- `references`: reference-only scouting notes and screenshots.
- `orders`: Stripe delivery status.
- Storage buckets: `template-previews`, `template-zips`, `reference-shots`.

`template-zips` and `reference-shots` are private. Purchase emails use 7-day signed download links.

## Stripe + Resend

Checkout creates a Stripe Checkout Session with template metadata. Configure the webhook endpoint:

```text
/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
```

The webhook verifies the Stripe signature, creates a Supabase signed URL for the ZIP, records the order, and sends the buyer a Resend email.

## Daily Template Automation

Dry-run locally:

```bash
npm run templates:daily
```

Publish to Supabase Storage + DB:

```bash
npm run templates:daily -- --publish
```

The generator creates 12 templates per day:

- 4 x `$29` CSS-only templates.
- 4 x `$49` Vite React templates.
- 4 x `$59` Next.js + Framer Motion templates.

Reference scouting uses the curated source list in `scripts/reference-sources.ts`. It scrolls pages, samples nav/menu affordances, records motion/layout notes, and stores screenshots for reference only. It does not copy external code, images, or text.

GitHub Actions runs the publish job daily at `10:00 UTC`, which is `06:00 America/Toronto` during daylight time.
