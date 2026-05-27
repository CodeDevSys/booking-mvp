# Stripe Billing setup for NEXORA

## Products & prices

Create one Product: **NEXORA Scheduling**, then three recurring **monthly** prices in EUR:

| Plan     | Amount | Metadata `planId` |
|----------|--------|-------------------|
| Basic    | €19    | `basic`           |
| Pro      | €39    | `pro`             |
| Business | €89    | `business`        |

Copy each **Price ID** (`price_...`) into `.env`:

```
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_BUSINESS=price_...
```

## Checkout & trial

Checkout uses `mode: subscription` with `trial_period_days: 14`. After trial, Stripe automatically bills the customer monthly.

## Webhook

Endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`

Events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Customer portal

Enable Stripe Customer Portal for subscription cancellation and payment method updates.
