export function About() {
  const pillars = [
    {
      title: "Intelligent automation",
      description:
        "AI systems that reduce manual scheduling, follow-ups, and operational overhead.",
    },
    {
      title: "Business efficiency",
      description:
        "Workflow optimization designed for salons, clinics, and service providers at scale.",
    },
    {
      title: "SaaS-first architecture",
      description:
        "Multi-tenant, subscription-ready infrastructure built for European compliance.",
    },
  ];

  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">About NEXORA</h2>
          <p className="mt-4 text-lg text-nexora-muted">
            NEXORA is an AI development and automation company focused on artificial
            intelligence systems, workflow automation, and business process optimization.
            We build SaaS products that help modern businesses work smarter — not harder.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="glass rounded-2xl p-6 transition hover:border-nexora-blue/50"
            >
              <div className="mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-nexora-blue/30 to-nexora-purple/30 flex items-center justify-center">
                <span className="text-nexora-cyan">◆</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-nexora-muted leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
