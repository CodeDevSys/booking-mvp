import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TRIAL_DAYS, getPlanById, type PlanId } from "@/lib/plans";
import { getStripe, getStripePriceId, isStripeConfigured } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  planId: z.enum(["basic", "pro", "business"]),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { planId } = bodySchema.parse(json);
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: "Stripe not configured",
          redirect: `/register?plan=${planId}`,
        },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    let customerId: string | undefined;
    let customerEmail: string | undefined;

    if (session?.user?.email) {
      customerEmail = session.user.email;
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { tenant: true },
      });
      customerId = user?.tenant?.stripeCustomerId ?? undefined;

      if (!customerId && user) {
        const customer = await getStripe().customers.create({
          email: user.email,
          metadata: { userId: user.id, planId },
        });
        customerId = customer.id;

        if (user.tenantId) {
          await prisma.tenant.update({
            where: { id: user.tenantId },
            data: { stripeCustomerId: customer.id },
          });
        }
      }
    }

    const priceId = getStripePriceId(planId as PlanId);

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { planId },
      },
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/register?plan=${planId}&canceled=1`,
      metadata: { planId },
      allow_promotion_codes: false,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
