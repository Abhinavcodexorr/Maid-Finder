"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { Icon } from "@/components/ui/icon";
import { ServiceGlyph, serviceImage } from "@/components/ui/service-glyph";
import { Shimmer } from "@/components/ui/shimmer";
import { fetchCatalogServices, fetchLiveProviders } from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import type { AvailabilityType, Provider } from "@/types/marketplace";

const SCHEDULES: Array<{ id: AvailabilityType | "any"; label: string; note: string }> = [
  { id: "full-time", label: "Full-time", note: "Full-day work" },
  { id: "part-time", label: "Part-time", note: "A few hours a day" },
  { id: "one-time", label: "Flexible", note: "Hours that suit you" },
  { id: "any", label: "No preference", note: "Show me everything" },
];

const MAX_RESULTS = 6;

export default function FindMyMatchPage() {
  const [services, setServices] = useState<CatalogService[] | null>(null);
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [step, setStep] = useState(1);
  const [service, setService] = useState<CatalogService | null>(null);
  const [schedule, setSchedule] = useState<AvailabilityType | "any" | null>(null);
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    fetchCatalogServices().then(setServices).catch(() => setServices([]));
    fetchLiveProviders().then(setProviders).catch(() => setProviders([]));
  }, []);

  const cities = useMemo(
    () => Array.from(new Set((providers ?? []).map((p) => p.city).filter(Boolean))).sort(),
    [providers],
  );

  const { matches, relaxed } = useMemo(() => {
    const all = providers ?? [];
    const byService = all.filter((p) => !service || p.categoryId === service.key || p.skills.includes(service.name));
    const strict = byService.filter(
      (p) => (!schedule || schedule === "any" || p.availabilityType === schedule) && (!city || p.city === city),
    );
    if (strict.length > 0) return { matches: strict, relaxed: false };
    return { matches: byService, relaxed: true };
  }, [providers, service, schedule, city]);

  const reset = () => {
    setStep(1);
    setService(null);
    setSchedule(null);
    setCity("");
  };

  const browseHref = `/providers?${new URLSearchParams({
    ...(service ? { category: service.key } : {}),
    ...(schedule && schedule !== "any" ? { availability: schedule } : {}),
  }).toString()}`;

  const optionClass = "rounded-2xl border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md";

  return (
    <>
      <PageHeader eyebrow="Free tool" title="Find my" accent="match" subtitle="Answer three quick questions and we'll show the professionals who fit best." />

      <section className="container-page max-w-5xl py-10 sm:py-14">
        {step <= 3 ? (
          <>
            <div className="mb-8 flex items-center justify-center gap-3" aria-label={`Step ${step} of 3`}>
              {[1, 2, 3].map((n) => (
                <span key={n} className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: n <= step ? "var(--primary)" : "var(--line-light)", color: n <= step ? "white" : "var(--muted)" }}
                  >
                    {n < step ? <Icon name="check" className="h-4 w-4" /> : n}
                  </span>
                  {n < 3 && <span className="h-px w-10 sm:w-16" style={{ background: n < step ? "var(--primary)" : "var(--line)" }} />}
                </span>
              ))}
            </div>

            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {step === 1 && (
                <>
                  <h2 className="font-display text-center text-h2">What kind of help do you need?</h2>
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {services === null && Array.from({ length: 8 }).map((_, i) => <Shimmer key={i} className="h-20 rounded-2xl" />)}
                    {(services ?? []).map((svc) => (
                      <button
                        key={svc.key}
                        type="button"
                        onClick={() => { setService(svc); setStep(2); }}
                        className={`${optionClass} flex items-center gap-3`}
                        style={{ borderColor: "var(--line)" }}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--line-light)]">
                          {serviceImage(svc) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={serviceImage(svc)!} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ServiceGlyph name={svc.name} className="h-5 w-5 text-[var(--primary)]" />
                          )}
                        </span>
                        <span className="text-sm font-bold">{svc.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-center text-h2">What schedule suits you?</h2>
                  <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                    {SCHEDULES.map((o) => (
                      <button key={o.id} type="button" onClick={() => { setSchedule(o.id); setStep(3); }} className={optionClass} style={{ borderColor: "var(--line)" }}>
                        <span className="block text-base font-bold">{o.label}</span>
                        <span className="mt-0.5 block text-sm" style={{ color: "var(--muted)" }}>{o.note}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-display text-center text-h2">Which city?</h2>
                  <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
                    {providers === null && Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} className="h-12 w-32 rounded-full" />)}
                    {cities.map((c) => (
                      <button key={c} type="button" onClick={() => { setCity(c); setStep(4); }} className="rounded-full border bg-white px-6 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: "var(--line)" }}>
                        {c}
                      </button>
                    ))}
                    <button type="button" onClick={() => { setCity(""); setStep(4); }} className="btn btn-primary !rounded-full">
                      Anywhere in India
                    </button>
                  </div>
                </>
              )}

              {step > 1 && (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                    <Icon name="arrow-left" className="h-4 w-4" /> Back
                  </button>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="font-display text-h2">
                {matches.length > 0 ? "Your best matches" : "No matches yet"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {service?.name}
                {schedule && schedule !== "any" ? ` · ${SCHEDULES.find((s) => s.id === schedule)?.label}` : ""}
                {city ? ` · ${city}` : ""}
              </p>
              {relaxed && matches.length > 0 && (
                <p className="mx-auto mt-3 max-w-xl rounded-2xl px-4 py-2.5 text-sm" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>
                  Nobody matches every answer yet, so here are all {service?.name} professionals instead.
                </p>
              )}
            </div>

            {providers === null ? (
              <div className="mt-8 grid gap-5 xl:grid-cols-2">{[0, 1].map((i) => <Shimmer key={i} className="h-64 rounded-3xl" />)}</div>
            ) : matches.length === 0 ? (
              <p className="mx-auto mt-8 max-w-md text-center text-sm" style={{ color: "var(--muted)" }}>
                We don&apos;t have anyone for this service yet. New professionals join every day — try another service.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
                {matches.slice(0, MAX_RESULTS).map((p) => <ProviderCard key={p.id} provider={p} />)}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href={browseHref} className="btn btn-primary !rounded-full">See all results</Link>
              <button type="button" onClick={reset} className="btn btn-outline !rounded-full">Start again</button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
