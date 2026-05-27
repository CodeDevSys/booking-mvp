import Link from "next/link";
import { NeuralBackground } from "./NeuralBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <NeuralBackground />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-nexora-border/60 bg-nexora-card/50 px-4 py-1.5 text-xs font-medium text-nexora-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-nexora-cyan animate-pulse" />
            AI Development & Automation
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI-powered scheduling & automation for{" "}
            <span className="text-gradient">modern businesses</span>
          </h1>
          <p className="mt-6 text-lg text-nexora-muted sm:text-xl">
            NEXORA helps businesses automate appointments and workflows using AI
            systems — built for speed, simplicity, and conversions.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-xl bg-gradient-to-r from-nexora-blue to-nexora-purple px-8 py-4 text-center text-base font-semibold text-white transition hover:opacity-90 glow-blue sm:w-auto"
            >
              Start Free Trial
            </Link>
            <Link
              href="/register"
              className="w-full rounded-xl border border-nexora-border bg-nexora-card/50 px-8 py-4 text-center text-base font-semibold text-white transition hover:border-nexora-blue sm:w-auto"
            >
              Get Started
            </Link>
          </div>
          <p className="mt-6 text-sm text-nexora-muted">
            14-day free trial · Cancel anytime · No lock-in
          </p>
        </div>

        <div className="mt-16 animate-float">
          <div className="glass mx-auto max-w-4xl overflow-hidden rounded-2xl border border-nexora-border/80 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-nexora-border/60 bg-nexora-surface/80 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-nexora-muted">NEXORA Dashboard</span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              {[
                { label: "Today's bookings", value: "24", trend: "+12%" },
                { label: "No-show rate", value: "3.2%", trend: "-18%" },
                { label: "Automation runs", value: "156", trend: "+34%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-nexora-border/40 bg-nexora-bg/60 p-4"
                >
                  <p className="text-xs text-nexora-muted">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-emerald-400">{stat.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
