"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchLivePlans } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/layout/page-header";
import { PlanCards } from "@/components/sections/plan-cards";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import type { Plan } from "@/types/marketplace";

function MembershipContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/providers";
  const { user, isSubscribed } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLivePlans()
      .then((list) => { if (!cancelled) setPlans(list); })
      .catch(() => { if (!cancelled) setPlans([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const onSelect = (planId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/membership?redirect=${encodeURIComponent(redirect)}`)}`);
      return;
    }
    router.push(`/checkout?plan=${planId}&redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Membership Plans"
        title="Simple, one-time"
        accent="pricing"
        subtitle="One plan unlocks contact details for every professional — no per-listing charges, no hidden fees."
      />

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
        {loading ? (
          <div className="py-16 text-center text-sm" style={{ color: "var(--muted)" }}>Loading plans…</div>
        ) : plans.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center text-sm" style={{ color: "var(--muted)" }}>
            No membership plans are available right now. Please check back shortly.
          </div>
        ) : (
        <PlanCards plans={plans} onSelect={onSelect} disabled={isSubscribed} />
        )}
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
