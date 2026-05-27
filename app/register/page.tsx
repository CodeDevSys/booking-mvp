"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PLANS } from "@/lib/plans";

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") ?? "pro";
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [planId, setPlanId] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, businessName, planId }),
      });
      const regData = await regRes.json();

      if (!regRes.ok) {
        setError(regData.error ?? "Registration failed");
        setLoading(false);
        return;
      }

      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }

      await signIn("email", { email, callbackUrl: "/dashboard" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-white">Start your free trial</h1>
      <p className="mt-2 text-sm text-nexora-muted">
        14 days free · Then monthly billing via Stripe · Cancel anytime
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-300">
          {typeof error === "string" ? error : "Registration failed"}
        </p>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="business" className="block text-sm font-medium text-slate-300">
            Business name
          </label>
          <input
            id="business"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nexora-border bg-nexora-bg px-4 py-3 text-white focus:border-nexora-blue focus:outline-none"
            placeholder="Your Salon / Clinic"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Business email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nexora-border bg-nexora-bg px-4 py-3 text-white focus:border-nexora-blue focus:outline-none"
            placeholder="you@business.com"
          />
        </div>
        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-slate-300">
            Plan
          </label>
          <select
            id="plan"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-nexora-border bg-nexora-bg px-4 py-3 text-white focus:border-nexora-blue focus:outline-none"
          >
            {PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — €{p.price}/month
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-nexora-blue to-nexora-purple py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Setting up…" : "Start Free Trial"}
        </button>
      </form>
      <p className="mt-4 text-xs text-nexora-muted text-center">
        By registering you agree to our{" "}
        <Link href="/agb" className="text-nexora-cyan hover:underline">
          AGB
        </Link>{" "}
        and{" "}
        <Link href="/datenschutz" className="text-nexora-cyan hover:underline">
          Datenschutz
        </Link>
        .
      </p>
      <p className="mt-4 text-center text-sm text-nexora-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-nexora-cyan hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-nexora-bg">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-nexora-blue to-nexora-purple text-sm font-bold text-white">
          N
        </span>
        <span className="text-lg font-semibold text-white">NEXORA</span>
      </Link>
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-nexora-muted text-center">Loading…</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
