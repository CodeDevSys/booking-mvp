# Neues GitHub-Repository anlegen

Die Landing Page liegt lokal in diesem Ordner und auf GitHub als Branch:

https://github.com/CodeDevSys/booking-mvp/tree/nexora-landing

## Schritte für ein eigenes Repository `nexora-landing`

1. Auf GitHub: **New repository** → Name: `nexora-landing` → **Create repository** (ohne README).

2. Im Terminal:

```bash
cd nexora-landing
git remote add origin https://github.com/CodeDevSys/nexora-landing.git
git push -u origin main
```

Fertig — die Landing Page ist ein eigenes Projekt, `booking-mvp` bleibt dein Buchungs-SaaS.
