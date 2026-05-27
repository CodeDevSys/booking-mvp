const features = [
  {
    title: "Smart booking system",
    description: "Customers book appointments through a fast, conversion-optimized interface.",
    icon: "📅",
  },
  {
    title: "Calendar management",
    description: "Unified calendars with real-time availability and conflict prevention.",
    icon: "🗓️",
  },
  {
    title: "Automated scheduling",
    description: "Fully automated workflows — confirmations, reminders, and rescheduling.",
    icon: "⚡",
  },
  {
    title: "Business dashboard",
    description: "Manage all bookings, services, and staff from one professional dashboard.",
    icon: "📊",
  },
  {
    title: "Customer tracking",
    description: "Track booking history, preferences, and engagement across your client base.",
    icon: "👥",
  },
  {
    title: "Fewer no-shows",
    description: "Automated reminders and re-engagement reduce missed appointments.",
    icon: "✓",
  },
];

export function Product() {
  return (
    <section id="product" className="relative py-24 bg-nexora-surface/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-nexora-cyan uppercase tracking-wider">
            Main Product
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Appointment Scheduling SaaS
          </h2>
          <p className="mt-4 text-nexora-muted">
            A complete scheduling platform for SMBs — optimized for speed, simplicity, and
            conversions. Reduce manual work and no-shows with intelligent automation.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-nexora-border/60 bg-nexora-card/30 p-6 transition hover:border-nexora-purple/50 hover:bg-nexora-card/50"
            >
              <span className="text-2xl" role="img" aria-hidden>
                {feature.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-nexora-cyan transition">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-nexora-muted leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
