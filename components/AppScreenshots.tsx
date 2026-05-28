import Image from "next/image";
import { BOOKING_APP_PUBLIC_URL } from "@/lib/public-config";

const shots = [
  {
    src: "/screenshots/booking-home.png",
    alt: "Booking MVP — Kunden buchen Termine online",
    title: "Kunden-Buchung",
    description:
      "Service wählen, Datum und Uhrzeit buchen — optimiert für Salons, Kliniken und Dienstleister.",
  },
  {
    src: "/screenshots/booking-admin.png",
    alt: "Booking MVP — Admin Dashboard für Unternehmen",
    title: "Admin-Dashboard",
    description:
      "Alle Termine verwalten, Passwort-geschützt — nach dem NEXORA-Abo per E-Mail-Link.",
  },
];

export function AppScreenshots() {
  return (
    <section id="screenshots" className="relative py-24 bg-nexora-surface/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-nexora-cyan uppercase tracking-wider">
            Booking MVP
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            So sieht Ihr Terminbuchungssystem aus
          </h2>
          <p className="mt-4 text-nexora-muted">
            Nach dem Abo erhalten Sie per E-Mail Ihren persönlichen Link — dieselbe
            Oberfläche wie in der Vorschau, passend zu Ihrem Tarif.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {shots.map((shot) => (
            <article
              key={shot.src}
              className="group overflow-hidden rounded-2xl border border-nexora-border/60 bg-nexora-card/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-nexora-bg">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={shot.src.includes("booking-home")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nexora-bg/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">{shot.title}</h3>
                <p className="mt-2 text-sm text-nexora-muted leading-relaxed">
                  {shot.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-nexora-muted">
          Live-Demo:{" "}
          <a
            href={BOOKING_APP_PUBLIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-nexora-cyan hover:underline"
          >
            Booking MVP öffnen
          </a>
        </p>
      </div>
    </section>
  );
}
