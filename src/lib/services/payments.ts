"use client";

import { readJson, writeJson, STORAGE_KEYS } from "@/lib/services/storage";
import { getPlanById } from "@/lib/services/plans";
import { activatePlan } from "@/lib/services/subscription";
import type { Payment, PaymentMode, Subscription } from "@/types/marketplace";

function getAll(): Payment[] {
  return readJson<Payment[]>(STORAGE_KEYS.payments, []);
}

function saveAll(payments: Payment[]): void {
  writeJson(STORAGE_KEYS.payments, payments);
}

export function getPaymentHistory(userId: string): Payment[] {
  return getAll()
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Simulated checkout. `forceFail` lets the checkout UI offer a "simulate
 * payment failure" test path. On success the matching subscription is
 * activated (extending any existing active plan).
 */
export function mockPay(params: {
  userId: string;
  planId: string;
  mode: PaymentMode;
  forceFail?: boolean;
}): { payment: Payment; subscription: Subscription | null } {
  const plan = getPlanById(params.planId);
  if (!plan) throw new Error("Plan not found.");

  const payment: Payment = {
    id: `pay-${Date.now()}`,
    userId: params.userId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.price,
    mode: params.mode,
    status: params.forceFail ? "failed" : "success",
    createdAt: new Date().toISOString(),
  };

  const all = [...getAll(), payment];
  saveAll(all);

  if (payment.status === "failed") {
    return { payment, subscription: null };
  }

  const subscription = activatePlan(params.userId, plan.id);
  return { payment, subscription };
}

export function processPayment(
  userId: string,
  planId: string,
  mode: PaymentMode = "Card"
): { payment: Payment; subscription: Subscription | null } {
  return mockPay({ userId, planId, mode });
}
