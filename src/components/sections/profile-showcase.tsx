"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { ServiceGlyph } from "@/components/ui/service-glyph";
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

/**
 * Blurred card peeking out behind the phone. It shows the neighbouring
 * professional's photo, or — when they have none or there are too few
 * professionals — a decorative service photo, purely for atmosphere.
 */
function SideCard({ image, side }: { image: string; side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`absolute top-1/2 hidden h-[540px] w-56 -translate-y-1/2 overflow-hidden rounded-[2rem] opacity-90 blur-[3px] sm:block ${side === "left" ? "left-0 -rotate-3" : "right-0 rotate-3"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

const DECOR_PHOTOS = ["/images/services/cleaning.jpg", "/images/services/nanny.jpg", "/images/services/cooking.jpg", "/images/services/elderly.jpg"];

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
  const prevProvider = count > 1 ? providers[(index - 1 + count) % count] : null;
  const nextProvider = count > 2 ? providers[(index + 1) % count] : null;
  const leftImage = prevProvider?.photo ?? DECOR_PHOTOS[index % DECOR_PHOTOS.length];
  const rightImage = nextProvider?.photo ?? DECOR_PHOTOS[(index + 2) % DECOR_PHOTOS.length];
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
          {/* Soft stage behind the phone */}
          <div aria-hidden className="absolute inset-x-2 inset-y-0 rounded-[3rem]" style={{ background: "linear-gradient(160deg, var(--primary-soft), #fff 70%)" }} />
          <div aria-hidden className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }} />
          <SideCard image={leftImage} side="left" />
          <SideCard image={rightImage} side="right" />

          {/* Phone */}
          <div className="relative z-10 w-[310px] rounded-[3rem] border-[10px] bg-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.45)]" style={{ borderColor: "#12182b" }}>
            <div aria-hidden className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full" style={{ background: "#12182b" }} />
            <div className="overflow-hidden rounded-[2.2rem]">
              <div className="flex items-center justify-between px-6 pb-1 pt-3 text-xs font-bold">
                <span>9:41</span>
                <span className="flex items-center gap-1" aria-hidden>
                  <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
                  <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
                  <BatteryFull className="h-4 w-4" strokeWidth={2} />
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
                  <div className="relative h-[22rem] overflow-hidden rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
                    {current.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={current.photo} alt={`${current.firstName} ${current.lastName}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center">
                        <span aria-hidden className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
                        <span aria-hidden className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-white/10" />
                        <ServiceGlyph name={category} className="absolute bottom-3 right-3 h-24 w-24 text-white/15" />
                        <span className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-4xl font-extrabold text-white shadow-xl backdrop-blur">
                          {initialsOf(current)}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">{category}</span>
                    {current.verified && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white shadow" style={{ background: "var(--success)" }}>
                        <Icon name="check" className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="px-2 pt-5">
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
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-xl px-3 py-2 text-xs font-bold" style={{ background: "var(--primary-soft)", color: "var(--primary-dark)" }}>
                        0% commission
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} /> Ready now
                      </span>
                    </div>
                    <Link href={`/providers/${current.id}`} className="btn btn-primary mt-5 w-full !rounded-full">
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
