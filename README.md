# NEXORA Landing Page

Marketing site for **NEXORA** — AI-powered scheduling & automation (Next.js, Tailwind, Stripe-ready).

## Separate from Booking MVP

| Repository | Purpose |
|------------|---------|
| [booking-mvp](https://github.com/CodeDevSys/booking-mvp) | Live appointment booking product |
| **nexora-landing** (this repo) | Marketing, pricing, legal pages |

No shared code or database between the two.

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

## Deploy

See [LIVE.md](./LIVE.md) and [scripts/stripe-setup.md](./scripts/stripe-setup.md).
