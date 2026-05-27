import { LegalLayout } from "@/components/LegalLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | NEXORA",
};

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <p>
        Angaben gemäß § 5 TMG (Telemediengesetz) und § 18 MStV (Medienstaatsvertrag)
      </p>

      <h2>Anbieter</h2>
      <p>
        NEXORA GmbH
        <br />
        Musterstraße 1
        <br />
        10115 Berlin
        <br />
        Deutschland
      </p>

      <h2>Vertreten durch</h2>
      <p>Geschäftsführung: [Name eintragen]</p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: kontakt@nexora.app
        <br />
        Telefon: +49 (0) 30 0000000
      </p>

      <h2>Registereintrag</h2>
      <p>
        Registergericht: Amtsgericht Charlottenburg (Berlin)
        <br />
        Registernummer: HRB [Nummer]
        <br />
        Umsatzsteuer-ID: DE[Nummer] (gemäß § 27a UStG)
      </p>

      <h2>Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
      <p>[Name], Anschrift wie oben</p>

      <h2>EU-Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
        bereit:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          className="text-nexora-cyan"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <p className="text-xs mt-12">
        Hinweis: Bitte ersetzen Sie die Platzhalter durch Ihre tatsächlichen
        Unternehmensdaten vor dem produktiven Einsatz.
      </p>
    </LegalLayout>
  );
}
