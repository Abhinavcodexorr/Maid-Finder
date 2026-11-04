"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/page-header";
import { PlanCards } from "@/components/sections/plan-cards";
import { Icon } from "@/components/ui/icon";
import { Shimmer } from "@/components/ui/shimmer";
import { fetchLivePlans } from "@/lib/services";
import type { Plan } from "@/types/marketplace";

const PERKS = [
  { icon: "unlock", title: "Every contact unlocked", note: "Phone and WhatsApp of every verified professional for the length of your plan." },
  { icon: "check-circle", title: "0% commission", note: "You agree salary directly. We never take a cut of anyone's wages." },
  { icon: "heart", title: "Unlimited shortlists", note: "Save as many profiles as you like and compare them side by side." },
] as const;

export default function OffersPage() {
  const router = useRouter();
  const { user, isSubscribed } = useAuth();
  const [plans, setPlans] = useState<Plan[] | null>(null);

  useEffect(() => {
    fetchLivePlans().then(setPlans).catch(() => setPlans([]));
  }, []);

  const onSelect = (planId: string) => {
    router.push(user ? `/checkout?plan=${planId}&redirect=${encodeURIComponent("/providers")}` : `/login?redirect=${encodeURIComponent("/offers")}`);
  };

  return (
    <>
      <PageHeader eyebrow="Offers" title="Membership" accent="plans" subtitle="One payment unlocks every contact. Pick the length that suits your search." />
      <section className="container-page py-12 sm:py-16">
        {plans === null ? (
          <div className="grid gap-6 md:grid-cols-3">{[0, 1, 2].map((i) => <Shimmer key={i} className="h-96 rounded-3xl" />)}</div>
        ) : plans.length === 0 ? (
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>Plans are unavailable right now. Please check back soon.</p>
        ) : (
          <PlanCards plans={plans} onSelect={onSelect} disabled={isSubscribed} ctaLabel="Get access" />
        )}

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="rounded-3xl border bg-white p-6" style={{ borderColor: "var(--line)" }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Icon name={perk.icon} className="h-5 w-5" />
              </span>
              <h2 className="font-display mt-4 text-lg font-extrabold">{perk.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{perk.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm" style={{ color: "var(--muted)" }}>
          Not sure yet? <Link href="/providers" className="font-semibold" style={{ color: "var(--primary)" }}>Browse profiles for free</Link> or{" "}
          <Link href="/find-my-match" className="font-semibold" style={{ color: "var(--primary)" }}>find your match</Link>.
        </p>
      </section>
    </>
  );
}
