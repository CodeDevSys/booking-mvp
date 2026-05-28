import { getBookingUrls } from "@/lib/booking-url";
import type { PlanId } from "@/lib/plans";

export function BookingLinks({
  tenantSlug,
  planId,
}: {
  tenantSlug: string;
  planId: PlanId;
}) {
  const { bookingUrl, adminUrl } = getBookingUrls(tenantSlug, planId);

  return (
    <section className="glass rounded-2xl p-6 mt-8">
      <h2 className="text-lg font-semibold text-white">Ihr Booking MVP</h2>
      <p className="mt-2 text-sm text-nexora-muted">
        Diese Links wurden auch per E-Mail an Sie gesendet. Teilen Sie die
        Kunden-URL mit Ihren Kunden — passend zu Ihrem Tarif ({planId}).
      </p>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-nexora-cyan uppercase tracking-wide">
            Kunden-Buchung
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-white hover:text-nexora-cyan"
          >
            {bookingUrl}
          </a>
        </div>
        <div>
          <p className="text-xs font-medium text-nexora-cyan uppercase tracking-wide">
            Admin / Verwaltung
          </p>
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-white hover:text-nexora-cyan"
          >
            {adminUrl}
          </a>
        </div>
      </div>
    </section>
  );
}
