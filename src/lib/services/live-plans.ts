"use client";

// Bridges the real Maid Finder BE plans API (admin-managed, GET
// /api/v1/plans for the public/active ones) into the frontend's existing
// `Plan` shape, replacing the hardcoded PLANS constant in src/data/plans.ts.

import type { Plan } from "@/types/marketplace";

interface ApiPlan {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  durationDays?: number;
  features?: string[];
  isPopular?: boolean;
}

interface ListResponse {
  success: boolean;
  count: number;
  data: ApiPlan[];
}

function mapApiPlanToPlan(raw: ApiPlan): Plan {
  return {
    id: raw.id || raw._id || "",
    name: raw.name || "Membership",
    price: raw.price ?? 0,
    originalPrice: raw.originalPrice,
    durationDays: raw.durationDays ?? 30,
    isPopular: raw.isPopular,
    description: raw.description,
    features: raw.features ?? [],
  };
}

/** Every active membership plan, in the order the admin set, straight from the real backend. */
export async function fetchLivePlans(): Promise<Plan[]> {
  const response = await fetch("/api/plans", { cache: "no-store" });
  const res: ListResponse = await response.json();
  if (!res.success) throw new Error("Could not load membership plans.");
  return (res.data || []).map(mapApiPlanToPlan);
}

export async function fetchLivePlanById(id: string): Promise<Plan | null> {
  const plans = await fetchLivePlans();
  return plans.find((p) => p.id === id) ?? null;
}
