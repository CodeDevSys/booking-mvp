import Stripe from "stripe";
import { getPlanById, type PlanId } from "./plans";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith("sk_")) {
    throw new Error("Stripe is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}

export function getStripePriceId(planId: PlanId): string {
  const plan = getPlanById(planId);
  if (!plan) throw new Error(`Unknown plan: ${planId}`);

  const priceId = process.env[plan.stripePriceEnvKey];
  if (!priceId) {
    throw new Error(
      `Missing ${plan.stripePriceEnvKey}. Create a recurring price in Stripe Dashboard.`
    );
  }
  return priceId;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_"));
}
