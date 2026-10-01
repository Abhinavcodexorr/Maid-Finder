import { PLANS } from "@/data/plans";
import type { Plan } from "@/types/marketplace";

export function getPlans(): Plan[] {
  return PLANS;
}

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
