# NEXORA — AI Scheduling SaaS Landing

Production-ready single-page marketing site with Stripe Billing subscriptions, email authentication, and multi-tenant database schema.

## Stack

- **Next.js 14** (App Router) + **Tailwind CSS**
- **NextAuth** (email magic links)
- **Prisma** + **PostgreSQL** (multi-tenant)
- **Stripe Billing** (14-day trial → recurring subscription)

## Quick start

```bash
cp .env.example .env
# Configure DATABASE_URL, NEXTAUTH_SECRET, Stripe keys, EMAIL_SERVER

npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe setup

1. Create three **recurring monthly** prices in EUR: €19, €39, €89.
2. Add metadata `planId` = `basic` | `pro` | `business` on each price (optional, used in webhooks).
3. Set `STRIPE_PRICE_*` env vars to the Price IDs.
4. Configure webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Enable **Customer Portal** in Stripe Dashboard for cancel-anytime flow.

## Deploy

- **Render**: use `render.yaml` (Web Service + PostgreSQL).
- **Netlify**: use `netlify.toml` with `@netlify/plugin-nextjs`.

## Legal pages (Germany)

- `/impressum` — Impressum
- `/datenschutz` — Datenschutzerklärung
- `/agb` — Terms & Conditions

Replace placeholder company details in Impressum before production.
