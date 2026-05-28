import { sendBookingAccessEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import type { PlanId } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { PlanTier, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

const planMap: Record<string, PlanTier> = {
  basic: "BASIC",
  pro: "PRO",
  business: "BUSINESS",
};

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );
        await syncSubscription(subscription, session.customer as string);
        await sendBookingLinkEmail(session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(
          subscription,
          subscription.customer as string
        );
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  stripeCustomerId: string
) {
  const tenant = await prisma.tenant.findFirst({
    where: { stripeCustomerId },
  });
  if (!tenant) return;

  const planId =
    subscription.metadata.planId ??
    subscription.items.data[0]?.price.metadata?.planId ??
    "basic";
  const plan = planMap[planId] ?? "BASIC";

  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      plan,
      status: mapStripeStatus(subscription.status),
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      trialEndsAt: trialEnd,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      plan,
      status: mapStripeStatus(subscription.status),
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      trialEndsAt: trialEnd,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

/** After checkout (trial or paid): email customer their Booking MVP links. */
async function sendBookingLinkEmail(stripeSession: Stripe.Checkout.Session) {
  const stripeCustomerId =
    typeof stripeSession.customer === "string"
      ? stripeSession.customer
      : stripeSession.customer?.id;
  if (!stripeCustomerId) return;

  const tenant = await prisma.tenant.findFirst({
    where: { stripeCustomerId },
    include: {
      subscription: true,
      users: { where: { role: "OWNER" }, take: 1 },
    },
  });
  if (!tenant || tenant.bookingWelcomeSentAt) return;

  const email =
    stripeSession.customer_details?.email ??
    stripeSession.customer_email ??
    tenant.users[0]?.email;
  if (!email) {
    console.warn("No email for booking welcome", tenant.id);
    return;
  }

  const planId = (stripeSession.metadata?.planId ?? "basic") as PlanId;

  try {
    const sent = await sendBookingAccessEmail({
      to: email,
      businessName: tenant.name,
      planId,
      tenantSlug: tenant.slug,
    });

    if (sent) {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { bookingWelcomeSentAt: new Date() },
      });
    }
  } catch (err) {
    console.error("Failed to send booking access email:", err);
  }
}
