import { LegalLayout } from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | NEXORA",
};

export default function AGBPage() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen (AGB)">
      <p>Stand: Mai 2026 — NEXORA GmbH</p>

      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese AGB gelten für die Nutzung der SaaS-Plattform NEXORA (Terminbuchung und
        zugehörige Dienste) durch Unternehmer im Sinne des § 14 BGB.
      </p>

      <h2>§ 2 Vertragsschluss und Testphase</h2>
      <p>
        Mit Registrierung und Start der 14-tägigen Testphase kommt ein Nutzungsvertrag
        zustande. Nach Ablauf der Testphase wandelt sich der Vertrag automatisch in ein
        kostenpflichtiges Abonnement um, sofern nicht vorher gekündigt.
      </p>

      <h2>§ 3 Preise und Zahlung</h2>
      <p>
        Es gelten die auf der Website angegebenen Festpreise (Basic €19/Monat, Pro
        €39/Monat, Business €89/Monat). Die Abrechnung erfolgt monatlich im Voraus über
        Stripe Billing. Preisänderungen werden mit angemessener Frist angekündigt.
      </p>

      <h2>§ 4 Laufzeit und Kündigung</h2>
      <p>
        Das Abonnement verlängert sich monatlich. Kündigung ist jederzeit zum Ende der
        laufenden Abrechnungsperiode über das Kunden-Dashboard bzw. das Stripe
        Kundenportal möglich — ohne Mindestlaufzeit.
      </p>

      <h2>§ 5 Leistungsumfang</h2>
      <p>
        Der Leistungsumfang richtet sich nach dem gewählten Tarif (Basic, Pro, Business).
        NEXORA ist berechtigt, die Software weiterzuentwickeln.
      </p>

      <h2>§ 6 Haftung</h2>
      <p>
        Haftung für Vorsatz und grobe Fahrlässigkeit sowie nach dem Produkthaftungsgesetz
        bleibt unberührt. Im Übrigen ist die Haftung bei leichter Fahrlässigkeit auf
        vorhersehbare, vertragstypische Schäden begrenzt.
      </p>

      <h2>§ 7 Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht. Gerichtsstand ist Berlin, sofern der Kunde Kaufmann ist.
      </p>
    </LegalLayout>
  );
}
