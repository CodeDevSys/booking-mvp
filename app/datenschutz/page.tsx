import { LegalLayout } from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | NEXORA",
};

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung (Privacy Policy)">
      <p>Stand: Mai 2026</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        NEXORA GmbH, Musterstraße 1, 10115 Berlin, Deutschland
        <br />
        E-Mail: datenschutz@nexora.app
      </p>

      <h2>2. Zweck und Rechtsgrundlagen</h2>
      <p>
        Wir verarbeiten personenbezogene Daten gemäß der EU-Datenschutz-Grundverordnung
        (DSGVO) und dem Bundesdatenschutzgesetz (BDSG) für:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Bereitstellung unseres SaaS-Terminbuchungssystems (Art. 6 Abs. 1 lit. b DSGVO)</li>
        <li>Abrechnung über Stripe (Art. 6 Abs. 1 lit. b DSGVO)</li>
        <li>E-Mail-Authentifizierung (Art. 6 Abs. 1 lit. b DSGVO)</li>
        <li>Sicherheit und Betrieb (Art. 6 Abs. 1 lit. f DSGVO)</li>
      </ul>

      <h2>3. Kategorien verarbeiteter Daten</h2>
      <p>
        Kontaktdaten (E-Mail, Name), Unternehmensdaten, Buchungs- und Kalenderdaten,
        Zahlungsmetadaten (über Stripe — keine vollständigen Kartendaten bei uns),
        technische Protokolldaten (IP, Browser, Zeitstempel).
      </p>

      <h2>4. Empfänger und Auftragsverarbeiter</h2>
      <p>
        Stripe, Inc. (Zahlungsabwicklung), Hosting-Anbieter (Netlify/Render), E-Mail-Dienst
        für Magic Links. Mit allen Auftragsverarbeitern bestehen AV-Verträge gemäß Art. 28
        DSGVO.
      </p>

      <h2>5. Speicherdauer</h2>
      <p>
        Daten werden gelöscht, sobald der Vertragszweck entfällt und keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>

      <h2>6. Ihre Rechte</h2>
      <p>
        Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit,
        Widerspruch und Beschwerde bei einer Aufsichtsbehörde (z. B. Berliner
        Beauftragte für Datenschutz und Informationsfreiheit).
      </p>

      <h2>7. SSL-Verschlüsselung</h2>
      <p>
        Diese Website nutzt TLS/SSL-Verschlüsselung zum Schutz übertragener Daten.
      </p>

      <h2>8. Multi-Tenant-Isolation</h2>
      <p>
        Kundendaten werden mandantenspezifisch getrennt gespeichert (tenant isolation).
      </p>
    </LegalLayout>
  );
}
