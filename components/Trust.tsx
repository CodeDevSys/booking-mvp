const trustItems = [
  {
    title: "GDPR compliant",
    description: "Built for EU and Germany — privacy by design, lawful data processing.",
  },
  {
    title: "SSL encryption",
    description: "All data in transit protected with industry-standard TLS encryption.",
  },
  {
    title: "Secure data storage",
    description: "Encrypted storage with strict access controls and tenant isolation.",
  },
  {
    title: "Enterprise-grade infrastructure",
    description: "Scalable SaaS architecture on reliable cloud providers.",
  },
  {
    title: "Privacy-first design",
    description: "Minimal data collection, transparent policies, and user control.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="relative py-24 border-t border-nexora-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Trust & security
          </h2>
          <p className="mt-4 text-nexora-muted">
            Professional B2B SaaS standards — so you and your customers can book with
            confidence.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-nexora-border/50 bg-nexora-surface/50 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                ✓
              </span>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-nexora-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
