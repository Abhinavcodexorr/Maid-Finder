"use client";

// Bridges the real Maid Finder BE plans API (admin-managed, GET
// /api/v1/plans for the public/active ones) into the frontend's existing
// `Plan` shape, replacing the hardcoded PLANS constant in src/data/plans.ts.

import type { Plan } from "@/types/marketplace";
import { getCustomerToken } from "@/lib/services/live-customer-auth";

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

/**
 * Records a purchase on the real backend so it shows up in the admin panel. Call after the payment
 * succeeds. Returns false when the customer isn't signed in to the live backend (nothing to record).
 */
export async function recordLiveSubscription(planId: string, paymentRef?: string): Promise<boolean> {
  const token = getCustomerToken();
  if (!token || !planId) return false;
  const response = await fetch("/api/customers/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ planId, paymentRef }),
  });
  const res = await response.json().catch(() => null);
  if (!response.ok || !res?.success) throw new Error(res?.message || "Couldn't record your plan. Please contact support.");
  return true;
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
