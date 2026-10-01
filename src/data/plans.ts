import type { Plan } from "@/types/marketplace";

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    originalPrice: 799,
    durationDays: 15,
    description: "Best for quick hiring or single service needs",
    features: ["Unlock price & phone for every provider", "Valid for 15 days", "Call & WhatsApp directly", "Email support"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 999,
    originalPrice: 1499,
    durationDays: 30,
    isPopular: true,
    description: "Most popular for families seeking verified help",
    features: ["Unlock price & phone for every provider", "Valid for 30 days", "Call & WhatsApp directly", "Priority support", "Save unlimited providers"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 2499,
    originalPrice: 3999,
    durationDays: 90,
    description: "Maximum savings & unlimited access for 3 months",
    features: ["Unlock price & phone for every provider", "Valid for 90 days", "Call & WhatsApp directly", "Priority support", "Save unlimited providers", "Best value per day"],
  },
];

export function getPlans(): Plan[] {
  return PLANS;
}

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
