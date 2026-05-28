# NEXORA Landing — Live

## Live-URL (GitHub Pages)

**https://codedevsys.github.io/booking-mvp/**

(Branch `nexora-landing`, nach Aktivierung von GitHub Pages → Source: **GitHub Actions**)

### Einmalig aktivieren

1. https://github.com/CodeDevSys/booking-mvp/settings/pages  
2. **Build and deployment** → **GitHub Actions**  
3. Workflow ausführen: [Deploy NEXORA to GitHub Pages](https://github.com/CodeDevSys/booking-mvp/actions/workflows/deploy-pages.yml) → **Run workflow**

## Vollständiges SaaS (Stripe, E-Mail, Dashboard)

Deploy Branch `nexora-landing` auf **Render** oder **Netlify** mit `@netlify/plugin-nextjs` — nicht nur statischer Export.

Env: siehe `.env.example`

## Screenshots aktualisieren

```bash
# Booking MVP lokal starten
cd ../booking-mvp && PORT=3099 npm start

# Screenshots erzeugen
cd nexora-landing
BOOKING_URL=http://localhost:3099 npm run screenshots
git add public/screenshots && git commit -m "chore: update booking screenshots"
```
