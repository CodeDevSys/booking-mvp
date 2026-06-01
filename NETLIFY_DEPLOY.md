# NEXORA — Netlify Deployment

## 1. Site mit GitHub verbinden (Auto-Deploy)

1. [Netlify Dashboard](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. **GitHub** → Repository: `CodeDevSys/booking-mvp`
3. **Branch:** `nexora-landing` (oder `cursor/netlify-deploy-66b1` nach Merge)
4. Build settings werden aus `netlify.toml` gelesen:
   - Build command: `npm run build`
   - Plugin: `@netlify/plugin-nextjs`
5. **Deploy site**

Jeder Push auf den verbundenen Branch löst automatisch einen Production- oder Preview-Deploy aus.

## 2. Umgebungsvariablen (Site settings → Environment variables)

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `DATABASE_URL` | Ja | PostgreSQL (z. B. Neon, Supabase) |
| `NEXTAUTH_SECRET` | Ja | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Ja | `https://IHR-SITE.netlify.app` oder Custom Domain |
| `NEXT_PUBLIC_SITE_URL` | Ja | Gleich wie `NEXTAUTH_URL` |
| `STRIPE_SECRET_KEY` | Ja | Stripe Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Ja | Webhook → `https://IHR-DOMAIN/api/stripe/webhook` |
| `STRIPE_PRICE_BASIC` | Ja | Stripe Price ID |
| `STRIPE_PRICE_PRO` | Ja | Stripe Price ID |
| `STRIPE_PRICE_BUSINESS` | Ja | Stripe Price ID |
| `EMAIL_SERVER` | Ja | SMTP für Magic Links + Booking-Mail |
| `EMAIL_FROM` | Ja | z. B. `NEXORA <noreply@ihre-domain.de>` |
| `BOOKING_APP_URL` | Ja | `https://booking-mvp.onrender.com` |
| `NEXT_PUBLIC_BOOKING_APP_URL` | Ja | Gleich wie `BOOKING_APP_URL` |

**Build:** `DATABASE_URL` muss auch für Builds gesetzt sein (kann dieselbe URL sein).

## 3. Eigene Domain + HTTPS

HTTPS ist auf Netlify **automatisch** (Let's Encrypt), sobald DNS korrekt ist.

### Option A — Subdomain (empfohlen)

Ziel bei Netlify: **Domain settings** → **Add custom domain** → z. B. `nexora.ihre-domain.de`

| Typ | Name | Wert |
|-----|------|------|
| **CNAME** | `nexora` (oder `www`) | `IHR-SITE-NAME.netlify.app` |

### Option B — Apex-Domain (`ihre-domain.de`)

| Typ | Name | Wert |
|-----|------|------|
| **A** | `@` | `75.2.60.5` |
| **A** | `@` | `99.83.248.142` |
| **CNAME** | `www` | `IHR-SITE-NAME.netlify.app` |

(Netlify zeigt die aktuellen IPs in der Domain-Verwaltung an — ggf. dort prüfen.)

Nach DNS-Propagierung (bis 48 h, oft Minuten):

1. Netlify verifiziert die Domain
2. **HTTPS** → Zertifikat wird automatisch ausgestellt
3. **Domain settings** → **HTTPS** → **Force HTTPS** aktivieren

## 4. Stripe Webhook (Production)

URL: `https://IHR-DOMAIN/api/stripe/webhook`

Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 5. Datenbank-Migration

Einmalig (lokal oder CI):

```bash
npx prisma migrate deploy
```

## 6. Netlify-URL

Nach dem ersten Deploy:

`https://<site-name>.netlify.app`

Den exakten Namen finden Sie unter **Site overview** im Netlify Dashboard.
