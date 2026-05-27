# NEXORA live schalten

## Option A — GitHub Pages (empfohlen, dauerhaft)

1. Öffne: https://github.com/CodeDevSys/booking-mvp/settings/pages
2. **Build and deployment** → Source: **GitHub Actions**
3. Workflow erneut starten: https://github.com/CodeDevSys/booking-mvp/actions/workflows/deploy-pages.yml  
   → **Run workflow** → Branch `nexora-landing`

**Live-URL (nach Aktivierung):**  
https://codedevsys.github.io/booking-mvp/

> Der Build ist bereits erfolgreich — nur Pages muss einmal aktiviert werden.

## Option B — Render (volles SaaS mit Stripe & Login)

1. https://render.com → New **Web Service**
2. Repo: `booking-mvp`, Branch: `nexora-landing`
3. Env-Variablen aus `.env.example` (DATABASE_URL, NEXTAUTH_*, STRIPE_*)
4. PostgreSQL-Datenbank verbinden (`render.yaml` vorhanden)

## Option C — Netlify

1. Import `booking-mvp`, Branch `nexora-landing`
2. Build: `npm run build`, Plugin `@netlify/plugin-nextjs`
