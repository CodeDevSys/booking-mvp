import nodemailer from "nodemailer";
import type { PlanId } from "./plans";
import { getBookingUrls } from "./booking-url";
import { getPlanById } from "./plans";

function getTransport() {
  const server = process.env.EMAIL_SERVER;
  if (!server) return null;
  return nodemailer.createTransport(server);
}

export interface BookingAccessEmailParams {
  to: string;
  businessName: string;
  planId: PlanId;
  tenantSlug: string;
}

export async function sendBookingAccessEmail(
  params: BookingAccessEmailParams
): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.warn("EMAIL_SERVER not configured — booking access email skipped");
    return false;
  }

  const plan = getPlanById(params.planId);
  const planName = plan?.name ?? params.planId;
  const { bookingUrl, adminUrl } = getBookingUrls(params.tenantSlug, params.planId);
  const from = process.env.EMAIL_FROM ?? "NEXORA <noreply@nexora.app>";

  const featureList = (plan?.features ?? [])
    .slice(0, 4)
    .map((f) => `• ${f}`)
    .join("\n");

  const subject = `Ihr Terminbuchungssystem ist bereit — ${params.businessName}`;

  const text = `Hallo,

vielen Dank für Ihr NEXORA-Abo (${planName}).

Ab sofort können Sie Ihr Booking-System nutzen:

Kunden-Buchungsseite (für Ihre Kunden):
${bookingUrl}

Verwaltung / Admin:
${adminUrl}

Tarif: ${planName}
${featureList ? `\nEnthalten im Tarif:\n${featureList}\n` : ""}
Teilen Sie den Kunden-Link auf Ihrer Website oder per WhatsApp/E-Mail.

Bei Fragen antworten Sie auf diese E-Mail.

Ihr NEXORA Team
`;

  const html = `
<!DOCTYPE html>
<html lang="de">
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b; max-width: 560px;">
  <h1 style="color: #0f172a;">Ihr Booking-System ist bereit</h1>
  <p>Hallo,</p>
  <p>vielen Dank für Ihr <strong>NEXORA ${planName}</strong>-Abo für <strong>${params.businessName}</strong>.</p>
  <p><strong>Kunden-Buchungsseite</strong> (Link an Ihre Kunden senden):</p>
  <p><a href="${bookingUrl}" style="display:inline-block;padding:12px 20px;background:linear-gradient(90deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Termine buchen</a></p>
  <p style="word-break:break-all;font-size:13px;color:#64748b;">${bookingUrl}</p>
  <p><strong>Verwaltung (Admin):</strong></p>
  <p><a href="${adminUrl}">${adminUrl}</a></p>
  ${plan?.features?.length ? `<p><strong>Ihr Tarif enthält:</strong></p><ul>${plan.features.map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}
  <p style="margin-top:24px;font-size:13px;color:#94a3b8;">NEXORA — AI Scheduling & Automation</p>
</body>
</html>`;

  await transport.sendMail({
    from,
    to: params.to,
    subject,
    text,
    html,
  });

  return true;
}
