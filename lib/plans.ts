export type PlanId = "basic" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  interval: "month";
  description: string;
  features: string[];
  stripePriceEnvKey: string;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 19,
    currency: "EUR",
    interval: "month",
    description: "Essential booking for small businesses",
    stripePriceEnvKey: "STRIPE_PRICE_BASIC",
    features: [
      "Simple appointment booking system",
      "Service selection + time slot booking",
      "Basic business dashboard",
      "Appointment list view",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 39,
    currency: "EUR",
    interval: "month",
    description: "Automation and customer engagement",
    stripePriceEnvKey: "STRIPE_PRICE_PRO",
    popular: true,
    features: [
      "Everything in Basic",
      "Automated email/SMS notifications after booking",
      "Appointment reminders (24h before)",
      "Cancel/reschedule functionality",
      "Improved customer management",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 89,
    currency: "EUR",
    interval: "month",
    description: "Scale with teams and analytics",
    stripePriceEnvKey: "STRIPE_PRICE_BUSINESS",
    features: [
      "Everything in Pro",
      "Multi-employee / team scheduling",
      "Multiple calendars per business",
      "Advanced analytics dashboard",
      "Customer re-engagement automation",
      "Scalable SaaS for growing businesses",
    ],
  },
];

export const TRIAL_DAYS = 14;

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function formatPrice(plan: Plan): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: 0,
  }).format(plan.price);
}
