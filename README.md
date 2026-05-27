# NEXORA Landing Page

Production-ready SaaS marketing site for **NEXORA** — AI-powered scheduling & automation.

> **Note:** This repository is separate from [booking-mvp](https://github.com/CodeDevSys/booking-mvp), which contains the appointment booking SaaS product.

## Stack

- Next.js 14 (App Router) + Tailwind CSS
- Stripe Billing (14-day trial → monthly subscription)
- NextAuth (email magic links)
- Prisma + PostgreSQL (multi-tenant ready)

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

Open http://localhost:3000

## Environment

See `.env.example` for Stripe, database, and email configuration.

Stripe setup: `scripts/stripe-setup.md`

## Deploy

- **Render:** `render.yaml`
- **Netlify:** `netlify.toml` (requires `@netlify/plugin-nextjs`)

## Legal (Germany)

- `/impressum` — Impressum
- `/datenschutz` — Datenschutzerklärung
- `/agb` — AGB

Replace placeholder company details in Impressum before production.
