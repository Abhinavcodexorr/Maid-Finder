"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getPlans, getPaymentHistory } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";

export default function DashboardMembershipPage() {
  const { user, isSubscribed, subscription, daysRemaining } = useAuth();
  const plans = useMemo(() => getPlans(), []);

  const payments = useMemo(() => {
    if (!user) return [];
    return getPaymentHistory(user.id);
  }, [user]);

  const handleDownloadInvoice = (paymentId: string) => {
    toast({
      title: "Downloading Receipt",
      description: `Invoice #${paymentId}.pdf has been generated.`,
      variant: "success",
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
          Membership & Billing
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Manage your subscription plan, view invoice receipts, and unlock direct candidate contact.
        </p>
      </div>

      {/* Current Active Plan Status */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isSubscribed ? "var(--success-soft)" : "var(--primary-soft)",
                  color: isSubscribed ? "var(--success)" : "var(--primary)",
                }}
              >
                <Icon name="award" className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Current Status
                </span>
                <h2 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>
                  {isSubscribed ? `${subscription?.planName} Pass` : "Free Explorer Account"}
                </h2>
              </div>
            </div>

            <p className="text-sm max-w-xl" style={{ color: "var(--muted)" }}>
              {isSubscribed
                ? `Your access is active through ${new Date(subscription?.endDate || "").toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}. You have unrestricted phone & WhatsApp access to all candidate listings.`
                : "Free accounts can browse helper profiles, read ratings, and save favorites. Upgrade to get instant unmasked phone numbers and WhatsApp buttons."}
            </p>
          </div>

          <div className="shrink-0">
            {isSubscribed ? (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-center">
                <div className="font-display text-2xl font-bold" style={{ color: "var(--success)" }}>
                  {daysRemaining}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Days Remaining
                </div>
              </div>
            ) : (
              <Link href="/membership" className="btn btn-primary">
                <Icon name="zap" className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        {/* Benefits Breakdown */}
        <div className="mt-8 border-t border-[var(--line-light)] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
            Included with Membership
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Direct Phone Number of Candidates",
              "1-Click Direct WhatsApp Messaging",
              "0% Brokerage or Commission Fees",
              "Aadhaar & Police Verification Checks",
              "Unlimited Helper Shortlists",
              "Dedicated Priority Customer Support",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-xs">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isSubscribed ? "var(--success-soft)" : "var(--line-light)",
                    color: isSubscribed ? "var(--success)" : "var(--muted)",
                  }}
                >
                  <Icon name="check" className="h-3 w-3" />
                </span>
                <span style={{ color: isSubscribed ? "var(--ink)" : "var(--muted)" }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Plans / Upgrade Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
              {isSubscribed ? "Extend or Upgrade Plan" : "Choose a Membership Plan"}
            </h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              All plans include complete direct contact access with zero recurring fees.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {plans.map((p) => {
            const isCurrent = isSubscribed && subscription?.planId === p.id;
            return (
              <div
                key={p.id}
                className="card relative flex flex-col justify-between overflow-hidden p-6 transition-all hover:shadow-md"
                style={
                  p.isPopular
                    ? {
                        border: "2px solid var(--primary)",
                        boxShadow: "var(--shadow-md)",
                      }
                    : undefined
                }
              >
                {p.isPopular && (
                  <span
                    className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    POPULAR
                  </span>
                )}

                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                    {p.name}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    {p.description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-extrabold" style={{ color: "var(--ink)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      / {p.durationDays} days
                    </span>
                    {p.originalPrice && (
                      <span className="ml-2 text-xs line-through" style={{ color: "var(--faint)" }}>
                        ₹{p.originalPrice}
                      </span>
                    )}
                  </div>

                  <ul className="mt-5 space-y-2 text-xs" style={{ color: "var(--ink-secondary)" }}>
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Icon name="check" className="h-3.5 w-3.5 mt-0.5 text-[var(--success)] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-[var(--line-light)] pt-4">
                  <Link
                    href={`/checkout?plan=${p.id}&redirect=/dashboard/membership`}
                    className={`btn w-full text-xs font-semibold ${
                      p.isPopular ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {isCurrent ? "Extend This Plan" : `Choose ${p.name}`}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment & Invoice Receipts History */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold mb-1" style={{ color: "var(--ink)" }}>
          Billing & Payment Receipts
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Official tax invoices for domestic staffing and membership purchases.
        </p>

        {payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--line)] py-8 text-center text-xs" style={{ color: "var(--muted)" }}>
            No transaction records yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] font-medium">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-light)]">
                {payments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-[var(--surface-muted)]/50">
                    <td className="py-3 font-mono font-medium" style={{ color: "var(--ink)" }}>
                      {pmt.id}
                    </td>
                    <td className="py-3 font-medium" style={{ color: "var(--ink)" }}>
                      {pmt.planName}
                    </td>
                    <td className="py-3" style={{ color: "var(--muted)" }}>
                      {new Date(pmt.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-semibold" style={{ color: "var(--ink)" }}>
                      ₹{pmt.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3" style={{ color: "var(--muted)" }}>
                      {pmt.mode}
                    </td>
                    <td className="py-3">
                      <span className="pill pill-success text-[10px] uppercase">
                        {pmt.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(pmt.id)}
                        className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline"
                      >
                        <Icon name="download" className="h-3 w-3" />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
