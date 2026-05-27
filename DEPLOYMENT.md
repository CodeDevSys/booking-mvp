# Deployment

## Render

This app can run on Render as a regular Node web service.

1. Open https://render.com
2. Create a new Web Service from the GitHub repository.
3. Use these settings:
   - Runtime: Node
   - Build Command: `npm install --omit=optional`
   - Start Command: `npm start`
4. Add environment variables:
   - Optional: `ADMIN_KEY`: password for the management login. If it is not set, the app uses `123456`.
   - Optional: `GOOGLE_CALENDAR_ID` and `GOOGLE_CREDENTIALS_JSON` for calendar sync
5. Deploy the service.

The booking page is available at `/`.
The management login is available at `/admin.html`.

## NEXORA landing page (separate project)

The marketing landing page is **not** part of this repo's `main` branch. It is maintained separately:

- **Branch:** [nexora-landing](https://github.com/CodeDevSys/booking-mvp/tree/nexora-landing)
- **New repository (recommended):** create `nexora-landing` on GitHub and push from that branch (see branch README).
