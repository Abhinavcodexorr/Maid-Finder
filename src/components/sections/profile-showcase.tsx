"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { getCategoryById } from "@/lib/services";
import type { Provider } from "@/types/marketplace";

const AUTOPLAY_MS = 3800;

const AVAILABILITY_LABEL: Record<string, string> = {
  "full-time": "Full time",
  "part-time": "Part time",
  "live-in": "Live in",
  "one-time": "One time",
};

function initialsOf(p: Provider): string {
  return `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();
}

/** A face on the blurred side cards, or initials when the provider has no photo. */
function SideCard({ provider, side }: { provider: Provider; side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`absolute top-1/2 hidden h-[420px] w-48 -translate-y-1/2 overflow-hidden rounded-3xl opacity-80 blur-[3px] sm:block ${side === "left" ? "left-0 lg:-left-6" : "right-0 lg:-right-6"}`}
      style={{ background: "var(--gradient-primary)" }}
    >
      {provider.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={provider.photo} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-white">{initialsOf(provider)}</div>
      )}
    </div>
  );
}

/**
 * "Browse verified profiles": a phone frame that auto-rotates through real
 * professionals, with the neighbours blurred behind it. Each card links to
 * that professional's profile.
 */
export function ProfileShowcase({ providers }: { providers: Provider[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = providers.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, paused, go]);

  if (count === 0) return null;

  const current = providers[index];
  const prev = count > 1 ? providers[(index - 1 + count) % count] : null;
  const next = count > 2 ? providers[(index + 1) % count] : null;
  const category = getCategoryById(current.categoryId)?.name ?? current.skills[0] ?? "Professional";

  return (
    <section className="container-page py-16 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Verified profiles</p>
          <h2 className="font-display text-h1 mt-3">
            Browse <span style={{ color: "var(--primary)" }}>verified</span> profiles
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Find the professional that&apos;s perfect for you. New maids, cooks, nannies and more join every day.
          </p>
          <ul className="mt-6 space-y-3">
            {["Every profile checked by our team", "Call or message professionals directly", "New professionals added daily"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-base font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/providers" className="btn btn-primary btn-lg">
              See all professionals <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous profile" className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--line)" }}>
                  <Icon name="arrow-left" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next profile" className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-[var(--primary-soft)]" style={{ borderColor: "var(--line)" }}>
                  <Icon name="arrow-right" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className="relative mx-auto flex w-full max-w-xl justify-center py-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          {prev && <SideCard provider={prev} side="left" />}
          {next && <SideCard provider={next} side="right" />}

          {/* Phone */}
          <div className="relative z-10 w-[300px] rounded-[3rem] border-[10px] bg-white shadow-2xl" style={{ borderColor: "#12182b" }}>
            <div aria-hidden className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full" style={{ background: "#12182b" }} />
            <div className="overflow-hidden rounded-[2.2rem]">
              <div className="flex items-center justify-between px-6 pb-1 pt-3 text-xs font-bold">
                <span>9:41</span>
                <span className="flex gap-1" aria-hidden>
                  <span className="h-2 w-3 rounded-sm bg-[var(--ink)]" />
                  <span className="h-2 w-4 rounded-sm bg-[var(--ink)]" />
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="px-3 pb-4"
                >
                  <div className="relative h-64 overflow-hidden rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
                    {current.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={current.photo} alt={`${current.firstName} ${current.lastName}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white">{initialsOf(current)}</div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">{category}</span>
                    {current.verified && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white shadow" style={{ background: "var(--success)" }}>
                        <Icon name="check" className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="px-2 pt-4">
                    <p className="font-display text-xl font-extrabold">
                      {current.firstName} {current.lastName ? `${current.lastName[0]}.` : ""}
                    </p>
                    <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                      {AVAILABILITY_LABEL[current.availabilityType] ?? "Available"}
                      {current.experienceYears > 0 ? ` · ${current.experienceYears} yrs` : ""}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "var(--ink-light)" }}>
                      <Icon name="map-pin" className="h-4 w-4" style={{ color: "var(--primary)" }} />
                      {[current.area, current.city].filter(Boolean).join(", ") || "India"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>
                        0% commission
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} /> Ready now
                      </span>
                    </div>
                    <Link href={`/providers/${current.id}`} className="btn btn-primary mt-4 w-full !rounded-full">
                      View profile
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {count > 1 && (
                <div className="flex justify-center gap-1.5 pb-4" aria-hidden>
                  {providers.slice(0, 10).map((p, i) => (
                    <span key={p.id} className="h-1.5 rounded-full transition-all" style={{ width: i === index % 10 ? 18 : 6, background: i === index % 10 ? "var(--primary)" : "var(--line)" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
