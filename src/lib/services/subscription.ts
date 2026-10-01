"use client";

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/services/storage";
import { getPlanById } from "@/lib/services/plans";
import type { Subscription } from "@/types/marketplace";

type SubscriptionMap = Record<string, Subscription>;

function getAll(): SubscriptionMap {
  return readJson<SubscriptionMap>(STORAGE_KEYS.subscriptions, {});
}

function saveAll(map: SubscriptionMap): void {
  writeJson(STORAGE_KEYS.subscriptions, map);
}

export function getActiveSubscription(userId: string): Subscription | null {
  const sub = getAll()[userId];
  if (!sub) return null;
  if (new Date(sub.endDate).getTime() < Date.now()) return null;
  return sub;
}

export function isSubscribed(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return getActiveSubscription(userId) !== null;
}

export function getDaysRemaining(userId: string): number {
  const sub = getActiveSubscription(userId);
  if (!sub) return 0;
  const ms = new Date(sub.endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/** Activates a plan for the user, extending an already-active plan's expiry rather than overwriting it. */
export function activatePlan(userId: string, planId: string): Subscription {
  const plan = getPlanById(planId);
  if (!plan) throw new Error("Plan not found.");

  const map = getAll();
  const existing = map[userId];
  const now = new Date();
  const hasActive = existing && new Date(existing.endDate).getTime() > now.getTime();
  const base = hasActive ? new Date(existing.endDate) : now;

  const end = new Date(base);
  end.setDate(end.getDate() + plan.durationDays);

  const subscription: Subscription = {
    userId,
    planId: plan.id,
    planName: plan.name,
    startDate: hasActive ? existing.startDate : now.toISOString(),
    endDate: end.toISOString(),
  };

  map[userId] = subscription;
  saveAll(map);
  return subscription;
}
