"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { Shimmer } from "@/components/ui/shimmer";
import { fetchLiveProviders } from "@/lib/services";
import { citySlug } from "@/lib/cities";
import type { Provider } from "@/types/marketplace";

export default function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [providers, setProviders] = useState<Provider[] | null>(null);

  useEffect(() => {
    fetchLiveProviders().then(setProviders).catch(() => setProviders([]));
  }, []);

  const cities = useMemo(() => {
    const counts = new Map<string, number>();
    (providers ?? []).forEach((p) => p.city && counts.set(p.city, (counts.get(p.city) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [providers]);

  const cityName = cities.find((c) => citySlug(c) === slug) ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const here = (providers ?? []).filter((p) => citySlug(p.city) === slug);

  return (
    <>
      <PageHeader
        eyebrow="Local professionals"
        title="Verified professionals in"
        accent={cityName}
        subtitle={`Browse maids, cooks, nannies, drivers and more working in ${cityName}. Contact them directly — no agency fees.`}
      />
      <section className="container-page py-10 sm:py-14">
        {providers === null ? (
          <div className="grid gap-5 xl:grid-cols-2">{[0, 1].map((i) => <Shimmer key={i} className="h-64 rounded-3xl" />)}</div>
        ) : here.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border bg-white p-10 text-center" style={{ borderColor: "var(--line)" }}>
            <h2 className="font-display text-h3">No professionals in {cityName} yet</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>New professionals join every day. Browse everyone in the meantime.</p>
            <Link href="/providers" className="btn btn-primary mt-6 !rounded-full">Browse all professionals</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {here.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        )}

        {cities.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-h3">Other cities</h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {cities.filter((c) => citySlug(c) !== slug).map((c) => (
                <Link key={c} href={`/city/${citySlug(c)}`} className="rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-colors hover:text-[var(--primary)]" style={{ borderColor: "var(--line)" }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
