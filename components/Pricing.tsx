"use client";

import { formatPrice, PLANS, TRIAL_DAYS } from "@/lib/plans";
import Link from "next/link";
import { useState } from "react";

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function startCheckout(planId: string) {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `/register?plan=${planId}`;
      }
    } catch {
      window.location.href = `/register?plan=${planId}`;
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, fixed pricing
          </h2>
          <p className="mt-4 text-nexora-muted">
            {TRIAL_DAYS}-day free trial on all plans. After trial, your subscription
            continues automatically via Stripe Billing. Cancel anytime — no lock-in.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.popular
                  ? "border-nexora-purple bg-gradient-to-b from-nexora-purple/10 to-nexora-card/40 glow-blue"
                  : "border-nexora-border/60 bg-nexora-card/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-nexora-blue to-nexora-purple px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-nexora-muted">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(plan)}
                </span>
                <span className="text-nexora-muted">/month</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-nexora-cyan shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => startCheckout(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-gradient-to-r from-nexora-blue to-nexora-purple text-white hover:opacity-90"
                    : "border border-nexora-border text-white hover:border-nexora-blue"
                } disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? "Loading…" : "Start Free Trial"}
              </button>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-nexora-muted">
          Recurring billing powered by{" "}
          <span className="text-white font-medium">Stripe Billing</span>. Fixed prices —
          no negotiation.
        </p>
        <p className="mt-2 text-center">
          <Link href="/register" className="text-sm text-nexora-cyan hover:underline">
            Create account to start your trial →
          </Link>
        </p>
      </div>
    </section>
  );
}
