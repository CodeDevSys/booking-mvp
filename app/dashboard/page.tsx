import { authOptions } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingPortalButton } from "@/components/BillingPortalButton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const subscription = session.user.subscription;
  const planIdMap: Record<string, string> = {
    BASIC: "basic",
    PRO: "pro",
    BUSINESS: "business",
  };
  const planName =
    PLANS.find((p) => p.id === planIdMap[subscription?.plan ?? ""])?.name ??
    subscription?.plan ??
    "Trial";

  return (
    <div className="min-h-screen bg-nexora-bg">
      <header className="border-b border-nexora-border/40 bg-nexora-surface/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nexora-blue to-nexora-purple text-xs font-bold text-white">
              N
            </span>
            <span className="font-semibold text-white">NEXORA Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-nexora-muted sm:inline">
              {session.user.email}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-nexora-muted hover:text-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {searchParams.checkout === "success" && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Subscription activated. Welcome to NEXORA!
          </div>
        )}

        <h1 className="text-2xl font-bold text-white">Business dashboard</h1>
        <p className="mt-2 text-nexora-muted">
          Manage appointments, customers, and your subscription.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-nexora-muted">Subscription</p>
            <p className="mt-1 text-xl font-bold text-white">{planName}</p>
            <p className="mt-1 text-sm text-nexora-muted capitalize">
              Status: {subscription?.status?.toLowerCase() ?? "trialing"}
            </p>
            {subscription?.trialEndsAt && (
              <p className="mt-2 text-xs text-nexora-cyan">
                Trial ends:{" "}
                {new Date(subscription.trialEndsAt).toLocaleDateString("de-DE")}
              </p>
            )}
            <div className="mt-4">
              <BillingPortalButton />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-nexora-muted">Today&apos;s appointments</p>
            <p className="mt-1 text-3xl font-bold text-white">—</p>
            <p className="mt-2 text-xs text-nexora-muted">
              Connect your calendar to sync bookings
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-nexora-muted">Automation</p>
            <p className="mt-1 text-3xl font-bold text-white">Active</p>
            <p className="mt-2 text-xs text-nexora-muted">
              Reminders & notifications enabled on Pro+
            </p>
          </div>
        </div>

        <section className="mt-10 glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Appointment list</h2>
          <p className="mt-2 text-sm text-nexora-muted">
            Your booking data will appear here once you configure services and
            availability. This dashboard is linked to your subscription status.
          </p>
          <div className="mt-6 rounded-xl border border-dashed border-nexora-border/60 p-8 text-center text-sm text-nexora-muted">
            No appointments yet — set up your booking page from settings.
          </div>
        </section>
      </main>
    </div>
  );
}
