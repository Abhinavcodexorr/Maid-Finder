"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getPlans } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const INCLUDED = [
  "Unlimited provider contact access",
  "View phone numbers & pricing",
  "WhatsApp integration",
  "Save unlimited professionals",
  "Priority customer support",
  "Access across all categories",
];

function MembershipContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/providers";
  const { user, isSubscribed } = useAuth();
  const plans = getPlans();

  const onSelect = (planId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/membership?redirect=${encodeURIComponent(redirect)}`)}`);
      return;
    }
    router.push(`/checkout?plan=${planId}&redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <>
      {/* Header */}
      <section className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="container-page py-12 text-center">
          <motion.p {...fadeUp()} className="eyebrow">Membership Plans</motion.p>
          <motion.h1 {...fadeUp(0.06)} className="font-display text-display mt-3">
            Unlock Every Provider
          </motion.h1>
          <motion.p {...fadeUp(0.12)} className="mx-auto mt-4 max-w-lg text-lg" style={{ color: "var(--muted)" }}>
            One plan unlocks contact details for every professional — no per-listing charges, no hidden fees.
          </motion.p>
        </div>
      </section>

      {/* Already subscribed banner */}
      {isSubscribed && (
        <div className="container-page mt-6">
          <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
            <Icon name="check-circle" className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">You&apos;re already a member!</p>
              <p className="text-xs" style={{ color: "var(--ink-light)" }}>
                You have full access to all provider contact details.{" "}
                <Link href="/dashboard/membership" className="underline">Manage membership →</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <section className="container-page py-12">
        <ScrollStagger className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isPopular = plan.isPopular;
            return (
              <ScrollStaggerItem key={plan.id}>
                <div
                  className="card relative flex flex-col overflow-hidden h-full"
                  style={isPopular ? {
                    border: "2px solid var(--primary)",
                    boxShadow: "var(--shadow-lg), 0 0 0 4px var(--primary-soft)",
                  } : undefined}
                >
                  {isPopular && (
                    <span
                      className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      Most Popular
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="font-display text-h3">{plan.name}</h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{plan.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      {" "}/ {plan.durationDays} days
                    </span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-sm line-through" style={{ color: "var(--faint)" }}>
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <ul className="mb-6 flex-1 space-y-2.5">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--success)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => onSelect(plan.id)}
                    disabled={isSubscribed}
                    className={isPopular ? "btn btn-primary btn-lg w-full" : "btn btn-outline btn-lg w-full"}
                  >
                    {isSubscribed ? "Already Active" : "Choose Plan"}
                  </button>
                </div>
              </ScrollStaggerItem>
            );
          })}
        </ScrollStagger>
      </section>

      {/* FAQ-style trust section */}
      <section style={{ background: "var(--line-light)" }}>
        <div className="container-page py-12">
          <ScrollReveal direction="up">
            <h2 className="font-display text-h2 text-center mb-8">Frequently Asked Questions</h2>
          </ScrollReveal>
          <ScrollStagger className="mx-auto grid max-w-3xl gap-4">
            {[
              { q: "Can I browse for free?", a: "Yes — browsing profiles, skills, experience, and reviews is always free. You only need a membership to see phone numbers, email addresses, and exact pricing." },
              { q: "What happens when my plan expires?", a: "You'll keep your account and saved list, but contact details will be masked again until you renew." },
              { q: "Can I get a refund?", a: "We offer a 7-day money-back guarantee if you're not satisfied. Contact support to initiate a refund." },
              { q: "Is one plan enough for all categories?", a: "Yes! Every plan unlocks every provider across all service categories — cleaning, plumbing, electrical, cooking, and more." },
            ].map((faq) => (
              <ScrollStaggerItem key={faq.q}>
                <div className="card">
                  <h3 className="text-sm font-semibold">{faq.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{faq.a}</p>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </div>
      </section>
    </>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={null}>
      <MembershipContent />
    </Suspense>
  );
}
