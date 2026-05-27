"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("email", {
      email,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (result?.ok) setSent(true);
  }

  if (sent) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h1 className="text-xl font-bold text-white">Check your email</h1>
        <p className="mt-3 text-sm text-nexora-muted">
          We sent a secure sign-in link to <strong className="text-white">{email}</strong>.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-nexora-cyan hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-white">Log in to NEXORA</h1>
      <p className="mt-2 text-sm text-nexora-muted">
        Email-based authentication — no password required.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            className="mt-1 w-full rounded-lg border border-nexora-border bg-nexora-bg px-4 py-3 text-white placeholder:text-nexora-muted focus:border-nexora-blue focus:outline-none focus:ring-1 focus:ring-nexora-blue"
            placeholder="you@business.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-nexora-blue to-nexora-purple py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Sending link…" : "Send magic link"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-nexora-muted">
        No account?{" "}
        <Link href="/register" className="text-nexora-cyan hover:underline">
          Start free trial
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
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
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
