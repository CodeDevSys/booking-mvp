import type { PlanId } from "./plans";

const DEFAULT_BOOKING_APP_URL = "https://booking-mvp.onrender.com";

export function getBookingAppBaseUrl(): string {
  const base = process.env.BOOKING_APP_URL ?? DEFAULT_BOOKING_APP_URL;
  return base.replace(/\/$/, "");
}

export function getBookingUrls(tenantSlug: string, planId: PlanId) {
  const base = getBookingAppBaseUrl();
  const params = new URLSearchParams({
    business: tenantSlug,
    plan: planId,
  });
  return {
    bookingUrl: `${base}/?${params.toString()}`,
    adminUrl: `${base}/admin.html?${params.toString()}`,
  };
}
