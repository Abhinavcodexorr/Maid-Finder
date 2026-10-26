"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { getCategories, getFeaturedProvidersFrom, fetchLiveProviders } from "@/lib/services";
import { ProviderCardSkeleton } from "@/components/ui/shimmer";
import { TESTIMONIALS } from "@/data/testimonials";
import { Avatar } from "@/components/ui/avatar";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import { colorForCategory, colorForIndex } from "@/lib/category-colors";
import { TiltCard } from "@/components/ui/tilt-card";
import type { Provider } from "@/types/marketplace";

/* ================================================================
   CONSTANTS
   ================================================================ */
const POPULAR_SERVICES = [
  { emoji: "🧹", label: "Cleaning", slug: "cat-maid" },
  { emoji: "🍳", label: "Cooking", slug: "cat-cook" },
  { emoji: "🔧", label: "Plumbing", slug: "cat-plumber" },
  { emoji: "⚡", label: "Electrical", slug: "cat-electrician" },
  { emoji: "🌱", label: "Gardening", slug: "" },
  { emoji: "👶", label: "Babysitting", slug: "cat-babysitter" },
  { emoji: "🛠", label: "Handyman", slug: "cat-carpenter" },
  { emoji: "❄️", label: "AC Repair", slug: "" },
  { emoji: "🎨", label: "Painting", slug: "cat-painter" },
  { emoji: "🚗", label: "Driver", slug: "cat-driver" },
  { emoji: "👴", label: "Elder Care", slug: "cat-elderly-care" },
  { emoji: "🏠", label: "Home Maintenance", slug: "" },
];

const STEPS = [
  { n: "01", title: "Tell us what you need", icon: "search", body: "Pick a service and your area to see verified professionals near you." },
  { n: "02", title: "Browse profiles — free", icon: "users", body: "Compare experience, skills and verification status without signing up." },
  { n: "03", title: "Unlock & connect", icon: "unlock", body: "Get a membership once, then call or WhatsApp any professional directly." },
];

const FEATURES = [
  { icon: "shield", title: "Identity verified", body: "Every professional submits Aadhaar and PAN, plus an intro video, before they go live." },
  { icon: "eye", title: "Transparent profiles", body: "See experience, skills and languages up front — no surprises after you connect." },
  { icon: "phone", title: "Direct contact, 0% commission", body: "Call or WhatsApp the professional yourself. No agency, no middleman, no booking fee." },
  { icon: "lock", title: "Free to browse, pay once", body: "Explore every profile for free. One membership unlocks contact details for all of them." },
];

const HELPER_PERKS = [
  { icon: "check-circle", title: "Free to list", body: "Create your profile at no cost." },
  { icon: "phone", title: "Get calls directly", body: "Families contact you, not an agency." },
  { icon: "trending-up", title: "Keep 100% of your earnings", body: "We never take a commission." },
];

const HERO_SERVICE_COUNT = 8;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const heroAnim = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/* ================================================================
   COMPONENT
   ================================================================ */
export default function HomePage() {
  const router = useRouter();
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const [liveProviders, setLiveProviders] = useState<Provider[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetchLiveProviders()
      .then((list) => { if (!cancelled) setLiveProviders(list); })
      .catch(() => { if (!cancelled) setLiveProviders([]); });
    return () => { cancelled = true; };
  }, []);

  const featured = liveProviders ? getFeaturedProvidersFrom(liveProviders, 6) : [];
  const categories = getCategories();

  const onSearch = () => {
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set("q", serviceQuery.trim());
    if (locationQuery.trim()) params.set("area", locationQuery.trim());
    router.push(`/providers?${params.toString()}`);
  };

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.25), transparent 70%)" }}
        />
        <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="text-center lg:text-left">
            <motion.p {...heroAnim(0)} className="eyebrow">
              Trusted Service Marketplace
            </motion.p>
            <motion.h1 {...heroAnim(0.08)} className="font-display text-display mt-4">
              Find the Right Professional{" "}
              <span style={{ color: "var(--primary)" }}>for Every Job</span>
            </motion.h1>
            <motion.p
              {...heroAnim(0.16)}
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed lg:mx-0"
              style={{ color: "var(--muted)" }}
            >
              Verified maids, cooks, nannies and more — browse free, then connect directly with 0% commission.
            </motion.p>

            {/* Search Box */}
            <motion.div
              {...heroAnim(0.24)}
              className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-xl transition-all focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)] lg:mx-0"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 border-b px-4 py-3.5 sm:border-b-0 sm:border-r" style={{ borderColor: "var(--line)" }}>
                  <Icon name="search" className="h-5 w-5 shrink-0" style={{ color: "var(--faint)" }} />
                  <input
                    className="w-full bg-transparent text-sm border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-[var(--faint)]"
                    placeholder="What service do you need?"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    aria-label="Search for a service"
                  />
                </div>
                <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
                  <Icon name="map-pin" className="h-5 w-5 shrink-0" style={{ color: "var(--faint)" }} />
                  <input
                    className="w-full bg-transparent text-sm border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-[var(--faint)]"
                    placeholder="Where do you need it?"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    aria-label="Enter location"
                  />
                </div>
                <div className="p-2 sm:shrink-0">
                  <button type="button" onClick={onSearch} className="btn btn-primary btn-lg w-full sm:w-auto">
                    <Icon name="search" className="h-4 w-4" />
                    Search
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Quick service chips */}
            <motion.div {...heroAnim(0.3)} className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Popular:</span>
              {POPULAR_SERVICES.slice(0, 5).map((svc) => (
                <Link
                  key={svc.label}
                  href={svc.slug ? `/providers?category=${svc.slug}` : "/providers"}
                  className="rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}
                >
                  {svc.emoji} {svc.label}
                </Link>
              ))}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              {...heroAnim(0.36)}
              className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t pt-6 text-center lg:text-left"
              style={{ borderColor: "var(--line)" }}
            >
              {[
                { v: "100%", l: "ID verified" },
                { v: "0%", l: "Commission" },
                { v: "12+", l: "Service categories" },
              ].map((t) => (
                <div key={t.l}>
                  <p className="font-display text-2xl font-bold" style={{ color: "var(--primary)" }}>{t.v}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{t.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div {...heroAnim(0.2)} className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -inset-3 rounded-[2rem] opacity-70 blur-xl" style={{ background: "var(--gradient-primary)" }} />
            <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/auth-service-hero.jpg"
                alt="A verified Help Zone professional at work"
                className="h-[480px] w-full object-cover"
              />
            </div>
            <div className="absolute -left-8 top-10 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl" style={{ border: "1px solid var(--line)" }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>Identity verified</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>Aadhaar &amp; PAN checked</p>
              </div>
            </div>
            <div className="absolute -right-6 bottom-12 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl" style={{ border: "1px solid var(--line)" }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Icon name="phone" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>Call directly</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>No agency in between</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== POPULAR SERVICES ====== */}
      <section className="container-page py-16">
        <motion.div {...fadeUp()} className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="font-display text-h2 mt-2">What can we help you with?</h2>
          </div>
          <Link href="/services" className="shrink-0 text-sm font-semibold" style={{ color: "var(--primary)" }}>
            All services →
          </Link>
        </motion.div>

        <ScrollStagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {POPULAR_SERVICES.slice(0, HERO_SERVICE_COUNT).map((svc, i) => {
            const swatch = svc.slug ? colorForCategory(svc.slug) : colorForIndex(i);
            return (
              <ScrollStaggerItem key={svc.label}>
                <TiltCard maxTilt={8} scale={1.03} className="h-full">
                  <Link
                    href={svc.slug ? `/providers?category=${svc.slug}` : "/providers"}
                    className="card card-hover flex h-full items-center gap-4 p-4"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ background: swatch.soft }}
                    >
                      {svc.emoji}
                    </span>
                    <span className="flex-1 text-sm font-semibold">{svc.label}</span>
                    <Icon name="arrow-right" className="h-4 w-4 shrink-0" style={{ color: "var(--faint)" }} />
                  </Link>
                </TiltCard>
              </ScrollStaggerItem>
            );
          })}
        </ScrollStagger>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section style={{ background: "var(--primary-soft)" }}>
        <div className="container-page py-16">
          <motion.div {...fadeUp()} className="text-center">
            <p className="eyebrow">How It Works</p>
            <h2 className="font-display text-h2 mt-3">Three simple steps</h2>
          </motion.div>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="absolute left-[16.7%] right-[16.7%] top-8 hidden border-t-2 border-dashed md:block"
              style={{ borderColor: "var(--primary)", opacity: 0.25 }}
            />
            <ScrollStagger className="grid gap-10 md:grid-cols-3 md:gap-6">
              {STEPS.map((step) => (
                <ScrollStaggerItem key={step.n}>
                  <div className="relative flex flex-col items-center text-center">
                    <span
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg ring-8 ring-[var(--primary-soft)]"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Icon name={step.icon} className="h-7 w-7" />
                      <span
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow"
                        style={{ color: "var(--primary)" }}
                      >
                        {step.n.replace(/^0/, "")}
                      </span>
                    </span>
                    <h3 className="font-display mt-5 text-lg font-bold leading-snug">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.body}</p>
                  </div>
                </ScrollStaggerItem>
              ))}
            </ScrollStagger>
          </div>
        </div>
      </section>

      {/* ====== WHY HELP ZONE ====== */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <motion.div {...fadeUp()}>
            <p className="eyebrow">Why Help Zone</p>
            <h2 className="font-display text-h1 mt-3">Built for trust and transparency</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              Hiring someone for your home should feel safe. We check every professional, show you everything up front and
              stay out of the way when you connect.
            </p>
            <Link href="/how-it-works" className="btn btn-outline mt-6">
              See how it works
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </motion.div>

          <ScrollStagger className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <ScrollStaggerItem key={f.title}>
                <div className="card card-hover h-full">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                  >
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.body}</p>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </div>
      </section>

      {/* ====== FEATURED PROFESSIONALS ====== */}
      <section style={{ background: "var(--line-light)" }}>
        <div className="container-page py-16">
          <motion.div {...fadeUp()} className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">Featured Professionals</p>
              <h2 className="font-display text-h2 mt-2">Top-rated in your area</h2>
            </div>
            <Link href="/providers" className="hidden text-sm font-semibold sm:block" style={{ color: "var(--primary)" }}>
              View all →
            </Link>
          </motion.div>

          {liveProviders === null && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)}
            </div>
          )}

          {liveProviders !== null && featured.length === 0 && (
            <div className="card py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
              No providers yet — be the first to{" "}
              <Link href="/register-helper" className="font-semibold" style={{ color: "var(--primary)" }}>register as a helper</Link>.
            </div>
          )}

          <ScrollStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((provider) => {
              const cat = categories.find((c) => c.id === provider.categoryId);
              const catColor = colorForCategory(provider.categoryId);
              return (
                <ScrollStaggerItem key={provider.id}>
                  <TiltCard maxTilt={6} className="h-full">
                  <Link
                    href={`/providers/${provider.id}`}
                    className="card card-hover flex gap-4 h-full"
                  >
                    <Avatar
                      initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                      imageUrl={provider.photo}
                      color={catColor.color}
                      soft={catColor.soft}
                      className="h-16 w-16 shrink-0 text-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{provider.firstName} {provider.lastName[0]}.</p>
                        {provider.verified && (
                          <Icon name="check-circle" className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} />
                        )}
                      </div>
                      <p className="text-xs font-medium" style={{ color: "var(--primary)" }}>{cat?.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
                        {typeof provider.rating === "number" && (
                          <span className="flex items-center gap-1">
                            <Icon name="star" className="h-3 w-3" style={{ color: "var(--accent)" }} />
                            {provider.rating.toFixed(1)}
                          </span>
                        )}
                        <span>{provider.experienceYears} yrs exp</span>
                        <span className="flex items-center gap-1">
                          <Icon name="map-pin" className="h-3 w-3" />
                          {provider.area}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="pill pill-locked">
                          <Icon name="lock" className="h-3 w-3" /> Contact Protected
                        </span>
                      </div>
                    </div>
                  </Link>
                  </TiltCard>
                </ScrollStaggerItem>
              );
            })}
          </ScrollStagger>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/providers" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
              View all professionals →
            </Link>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="overflow-hidden py-16">
        <motion.div {...fadeUp()} className="container-page text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="font-display text-h2 mt-3">What our users say</h2>
        </motion.div>

        <div className="mt-10">
          <TestimonialsCarousel items={TESTIMONIALS} />
        </div>
      </section>

      {/* ====== HELPER CTA ====== */}
      <section className="container-page pb-16 lg:pb-20">
        <ScrollReveal direction="up">
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-12"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">For helpers</p>
                <h2 className="font-display text-h1 mt-3">Are you a maid, cook or skilled professional?</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                  Join Help Zone and get found by families looking for trusted help in your city.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/register-helper" className="btn btn-lg" style={{ background: "white", color: "var(--primary-dark)" }}>
                    Register as Helper
                  </Link>
                  <Link
                    href="/providers"
                    className="btn btn-lg"
                    style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    <Icon name="search" className="h-4 w-4" />
                    Find Professionals
                  </Link>
                </div>
              </div>
              <ul className="grid gap-3">
                {HELPER_PERKS.map((perk) => (
                  <li key={perk.title} className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <Icon name={perk.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{perk.title}</p>
                      <p className="text-xs text-white/70">{perk.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
