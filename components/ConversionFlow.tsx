const steps = [
  {
    step: "1",
    title: "Register",
    description: "Sign up with your business email — secure, passwordless authentication.",
  },
  {
    step: "2",
    title: "Start 14-day trial",
    description: "Full access to your plan. No charge until the trial ends.",
  },
  {
    step: "3",
    title: "Automatic conversion",
    description: "Stripe Billing activates your monthly subscription after the trial.",
  },
  {
    step: "4",
    title: "Cancel anytime",
    description: "Manage or cancel your subscription from your dashboard — no lock-in.",
  },
];

export function ConversionFlow() {
  return (
    <section className="py-24 bg-nexora-surface/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div
                  className="absolute top-8 left-full hidden h-px w-full bg-gradient-to-r from-nexora-blue/50 to-transparent lg:block"
                  aria-hidden
                />
              )}
              <div className="glass rounded-2xl p-6 h-full">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-nexora-blue to-nexora-purple text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-nexora-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
