"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import {
  fetchCatalogServices,
  fetchLivePlans,
  fetchLiveProviders,
} from "@/lib/services";
import type { CatalogService } from "@/lib/services";
import { TESTIMONIALS } from "@/data/testimonials";
import { FAQS } from "@/data/faqs";
import { useAuth } from "@/context/AuthContext";
import { useTypewriter } from "@/lib/use-typewriter";
import { FaqList } from "@/components/sections/faq-list";
import { PlanCards } from "@/components/sections/plan-cards";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import { ServiceGlyph, pickShowcaseServices, serviceGradient, serviceImage } from "@/components/ui/service-glyph";
import { CountUp } from "@/components/ui/count-up";
import { Underlined } from "@/components/ui/underlined";
import { ServiceMarquee } from "@/components/sections/service-marquee";
import { ProfileShowcase } from "@/components/sections/profile-showcase";
import type { Plan, Provider } from "@/types/marketplace";

/* ================================================================
   CONSTANTS
   ================================================================ */
const STEPS = [
  { n: "01", title: "Register & search for free", body: "Pick a service and your area, then browse every verified profile — no payment needed to look." },
  { n: "02", title: "Compare & shortlist", body: "See experience, skills and verification status side by side, and save the professionals you like." },
  { n: "03", title: "Unlock & hire directly", body: "Get a membership once, then call or WhatsApp any professional yourself and agree terms directly." },
];

const FEATURES = [
  { icon: "shield", title: "Identity verified", body: "Every professional submits Aadhaar and PAN, plus an intro video, before they go live." },
  { icon: "eye", title: "Transparent profiles", body: "See experience, skills and languages up front — no surprises after you connect." },
  { icon: "phone", title: "Direct contact, 0% commission", body: "Call or WhatsApp the professional yourself. No agency, no middleman, no booking fee." },
  { icon: "lock", title: "Free to browse, pay once", body: "Explore every profile for free. One membership unlocks contact details for all of them." },
];

const PROVIDER_PERKS = [
  { icon: "check-circle", title: "Free to list", body: "Create your profile at no cost." },
  { icon: "phone", title: "Get calls directly", body: "Families contact you, not an agency." },
  { icon: "trending-up", title: "Keep 100% of your earnings", body: "We never take a commission." },
];

const HOME_SERVICE_COUNT = 8;
const HOME_FAQ_COUNT = 5;

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
  const { user, isSubscribed } = useAuth();

  const [serviceKey, setServiceKey] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const [catalog, setCatalog] = useState<CatalogService[] | null>(null);
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [liveProviders, setLiveProviders] = useState<Provider[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogServices()
      .then((list) => { if (!cancelled) setCatalog(list); })
      .catch(() => { if (!cancelled) setCatalog([]); });
    fetchLiveProviders()
      .then((list) => { if (!cancelled) setLiveProviders(list); })
      .catch(() => {});
    fetchLivePlans()
      .then((list) => { if (!cancelled) setPlans(list); })
      .catch(() => { if (!cancelled) setPlans([]); });
    return () => { cancelled = true; };
  }, []);

  const marqueeWords = (catalog ?? []).map((svc) => svc.name);

  const onSearch = () => {
    const params = new URLSearchParams();
    if (serviceKey) params.set("category", serviceKey);
    if (locationQuery.trim()) params.set("area", locationQuery.trim());
    router.push(`/providers?${params.toString()}`);
  };

  const onSelectPlan = (planId: string) => {
    router.push(user ? `/checkout?plan=${planId}&redirect=${encodeURIComponent("/providers")}` : `/login?redirect=${encodeURIComponent("/membership")}`);
  };

  const typedService = useTypewriter(marqueeWords);

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <motion.p {...heroAnim(0)} className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] shadow-sm" style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: "var(--primary)" }}>
                <Icon name="check" className="h-3 w-3" />
              </span>
              India&apos;s trusted home-help platform
            </motion.p>
            <motion.h1 {...heroAnim(0.08)} className="font-display text-display mt-5">
              Hire verified <span style={{ color: "var(--primary)" }}>professionals</span> for every job
            </motion.h1>
            <motion.p {...heroAnim(0.16)} className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              Browse verified maids, cooks, nannies, drivers and more across India. No agency fees — contact professionals directly and hire today.
            </motion.p>

            {/* Search bar */}
            <motion.div {...heroAnim(0.24)} className="mt-8 max-w-2xl rounded-[1.75rem] border bg-white p-2.5 shadow-xl sm:rounded-full" style={{ borderColor: "var(--line)" }}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                <div className="flex-1 px-4 py-1.5 sm:border-r sm:border-[var(--line)]">
                  <label htmlFor="heroService" className="block text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
                    Expertise
                  </label>
                  <select
                    id="heroService"
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold outline-none"
                    style={{ color: "var(--ink)" }}
                    value={serviceKey}
                    onChange={(e) => setServiceKey(e.target.value)}
                  >
                    <option value="">{typedService || "Any expertise"}</option>
                    {(catalog ?? []).map((svc) => (
                      <option key={svc.key} value={svc.key}>{svc.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 px-4 py-1.5">
                  <label htmlFor="heroLocation" className="block text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
                    Location
                  </label>
                  <input
                    id="heroLocation"
                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-medium"
                    style={{ color: "var(--ink)" }}
                    placeholder="Anywhere in India"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  />
                </div>
                <button type="button" onClick={onSearch} className="btn btn-primary btn-lg w-full sm:w-auto">
                  <Icon name="search" className="h-4 w-4" />
                  Search
                </button>
              </div>
            </motion.div>

            <motion.div {...heroAnim(0.32)} className="mt-5 flex flex-wrap gap-2.5">
              {[
                { href: "/providers", label: "Search profiles" },
                { href: "/membership", label: "Buy access package" },
                { href: "/register-provider", label: "Register as Provider" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="rounded-full border bg-white/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white" style={{ borderColor: "var(--line)" }}>
                  {l.label}
                </Link>
              ))}
            </motion.div>

            <motion.ul {...heroAnim(0.4)} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium" style={{ color: "var(--ink-light)" }}>
              {["100% ID verified", "0% commission", "Free to browse"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Icon name="check-circle" className="h-4 w-4" style={{ color: "var(--success)" }} />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Hero artwork: blue arch with family, verified seal and stat cards */}
          <motion.div {...heroAnim(0.2)} className="relative mx-auto w-full max-w-sm lg:max-w-[34rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/helpzone-hero-arch.webp"
              alt="A caregiver with a happy family, with a verified background-checked seal"
              className="block h-auto w-full"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent), linear-gradient(to bottom, transparent, #000 4%, #000 96%, transparent)",
                WebkitMaskComposite: "source-in",
                maskImage: "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent), linear-gradient(to bottom, transparent, #000 4%, #000 96%, transparent)",
                maskComposite: "intersect",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ====== SERVICE MARQUEE ====== */}
      <ServiceMarquee services={catalog ?? []} />

      {/* ====== SERVICES ====== */}
      <section className="container-page py-16 lg:py-20">
        <motion.div {...fadeUp()} className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="font-display text-h1 mt-3">
              What can we <Underlined>help</Underlined> you with?
            </h2>
          </div>
          <Link href="/services" className="btn btn-outline btn-sm shrink-0">
            All services <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </motion.div>

        {catalog === null && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: HOME_SERVICE_COUNT }).map((_, i) => (
              <div key={i} className="shimmer h-44 rounded-3xl" />
            ))}
          </div>
        )}

        {catalog !== null && catalog.length === 0 && (
          <div className="card py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
            Services are unavailable right now. Please try again shortly.
          </div>
        )}

        <ScrollStagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {pickShowcaseServices(catalog ?? [], HOME_SERVICE_COUNT).map((svc) => {
            const photo = serviceImage(svc);
            return (
              <ScrollStaggerItem key={svc.key}>
                <Link
                  href={`/providers?category=${svc.key}`}
                  className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-64"
                  style={{ borderColor: "var(--line)", background: photo ? "#0f172a" : "var(--surface)" }}
                >
                  {photo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    </>
                  ) : (
                    <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                      <ServiceGlyph name={svc.name} className="h-6 w-6" />
                    </span>
                  )}
                  <div className="relative flex items-end justify-between gap-2">
                    <p className="font-display text-lg font-extrabold leading-tight sm:text-xl" style={{ color: photo ? "white" : "var(--ink)" }}>
                      {svc.name}
                    </p>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
                      style={photo ? { background: "rgba(255,255,255,0.9)", color: "var(--ink)" } : { background: "var(--primary)", color: "white" }}
                    >
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </ScrollStaggerItem>
            );
          })}
        </ScrollStagger>
      </section>

      {/* ====== VERIFIED PROFILES ====== */}
      <ProfileShowcase providers={liveProviders} />

      {/* ====== STATS BAND ====== */}
      <section className="text-white" style={{ background: "var(--gradient-dark)" }}>
        <div className="container-page py-16 text-center">
          <motion.h2 {...fadeUp()} className="font-display text-h1">
            Hiring made <Underlined>direct</Underlined>
          </motion.h2>
          <div className="mt-10 grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
            {[
              { value: "Free", label: "To browse every profile" },
              { value: "Pan-India", label: "Cities and areas covered" },
              { value: "100%", label: "Profiles ID-verified" },
              { value: "0%", label: "Commission, always" },
            ].map((stat) => (
              <div key={stat.label} className="px-4">
                <p className="font-display text-3xl font-extrabold sm:text-5xl">
                  <CountUp key={stat.value} value={stat.value} />
                </p>
                <p className="mx-auto mt-2 max-w-[11rem] text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div {...fadeUp()}>
            <p className="eyebrow">How it works</p>
            <h2 className="font-display text-h1 mt-3">
              Hire trusted professionals in <Underlined>3 simple steps</Underlined>
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--muted)" }}>After you register — it takes just a few days.</p>
            <Link href="/how-it-works" className="btn btn-outline btn-lg mt-7">
              Step-by-step guide <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </motion.div>

          <ol className="relative space-y-8">
            <span aria-hidden className="absolute bottom-8 left-[27px] top-8 w-0.5" style={{ background: "var(--line)" }} />
            {STEPS.map((step, i) => (
              <motion.li key={step.n} {...fadeUp(i * 0.1)} className="relative flex gap-6">
                <span
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-white shadow-lg"
                  style={{ background: i === 0 ? "var(--gradient-primary)" : "var(--ink)" }}
                >
                  {step.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      {plans !== null && plans.length > 0 && (
        <section style={{ background: "var(--surface-muted)" }}>
          <div className="container-page py-16 lg:py-24">
            <motion.div {...fadeUp()} className="mb-12 text-center">
              <p className="eyebrow">Hiring packages</p>
              <h2 className="font-display text-h1 mt-3">
                Simple, one-time <Underlined>pricing</Underlined>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base" style={{ color: "var(--muted)" }}>
                One payment, direct access to every profile. No hidden fees.
              </p>
            </motion.div>
            <PlanCards plans={plans} onSelect={onSelectPlan} disabled={isSubscribed} ctaLabel="Get access" />
          </div>
        </section>
      )}

      {/* ====== WHY HELP ZONE ====== */}
      <section className="container-page py-16 lg:py-24">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Why Help Zone</p>
          <h2 className="font-display text-h1 mt-3">
            Built for <span style={{ color: "var(--primary)" }}>trust</span> and transparency
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
            Hiring someone for your home should feel safe. We check every professional, show you everything up front and
            stay out of the way when you connect.
          </p>
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Photo panel */}
          <motion.div {...fadeUp(0.05)} className="relative min-h-[360px] overflow-hidden rounded-[2rem] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/services/elderly.jpg" alt="A caregiver smiling with an elderly woman" className="absolute inset-0 h-full w-full object-cover object-[28%_center]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1530]/90 via-[#0d1530]/20 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="font-display text-2xl font-extrabold leading-snug">Every professional is checked before going live.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {["Aadhaar", "PAN", "Intro video"].map((chip) => (
                  <li key={chip} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <Icon name="check" className="h-3 w-3 text-emerald-300" /> {chip}
                  </li>
                ))}
              </ul>
              <Link href="/how-it-works#verification" className="mt-5 inline-flex items-center gap-2 text-sm font-bold">
                See how we verify <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Feature cards */}
          <ScrollStagger className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <ScrollStaggerItem key={f.title}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ borderColor: "var(--line)" }}>
                  <span aria-hidden className="font-display absolute -right-2 -top-4 text-8xl font-extrabold opacity-[0.05] transition-opacity group-hover:opacity-10">
                    0{i + 1}
                  </span>
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ background: serviceGradient([0, 2, 1, 3][i]) }}
                  >
                    <Icon name={f.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-extrabold">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.body}</p>
                  <span aria-hidden className="mt-5 block h-1 w-10 rounded-full transition-all duration-300 group-hover:w-20" style={{ background: serviceGradient([0, 2, 1, 3][i]) }} />
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="overflow-hidden py-16" style={{ background: "var(--surface-muted)" }}>
        <motion.div {...fadeUp()} className="container-page text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="font-display text-h1 mt-3">
            What our <Underlined>users</Underlined> say
          </h2>
        </motion.div>

        <div className="mt-10">
          <TestimonialsCarousel items={TESTIMONIALS} />
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="container-page py-16 lg:py-24">
        <motion.div {...fadeUp()} className="mb-8 text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="font-display text-h1 mt-3">
            Questions, <Underlined>answered</Underlined>
          </h2>
        </motion.div>
        <FaqList items={FAQS.slice(0, HOME_FAQ_COUNT)} />
        <p className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
          Still curious?{" "}
          <Link href="/contact" className="font-semibold" style={{ color: "var(--primary)" }}>Contact us →</Link>
        </p>
      </section>

      {/* ====== PROVIDER CTA ====== */}
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
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">For providers</p>
                <h2 className="font-display text-h1 mt-3">Are you a maid, cook or skilled professional?</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                  Join Help Zone and get found by families looking for trusted help in your city.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/register-provider" className="btn btn-lg" style={{ background: "white", color: "var(--primary-dark)" }}>
                    Register as Provider
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
                {PROVIDER_PERKS.map((perk) => (
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
