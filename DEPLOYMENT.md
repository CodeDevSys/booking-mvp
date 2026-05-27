# Booking MVP — Deployment

## Local development

```bash
npm install
npm run dev
```

## Render

1. https://render.com → New Web Service from this repository (`main` branch only).
2. Build: `npm install --omit=optional`
3. Start: `npm start`
4. Optional env: `ADMIN_KEY`, `GOOGLE_CALENDAR_ID`, `GOOGLE_CREDENTIALS_JSON`

## Netlify

Uses `netlify.toml` and `netlify/functions/`.

## NEXORA landing page

Separate repo: **https://github.com/CodeDevSys/nexora-landing**

Do not deploy this repo’s `nexora-landing` branch for booking — use `main` only.
