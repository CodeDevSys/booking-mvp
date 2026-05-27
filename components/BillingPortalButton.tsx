"use client";

import { useState } from "react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={openPortal}
      disabled={loading}
      className="rounded-lg border border-nexora-border px-4 py-2 text-sm text-white hover:border-nexora-blue disabled:opacity-50"
    >
      {loading ? "Loading…" : "Manage billing (cancel anytime)"}
    </button>
  );
}
