"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { getFeaturedProviders, getCategories } from "@/lib/services";
import { TESTIMONIALS } from "@/data/testimonials";
import { Avatar } from "@/components/ui/avatar";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";

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
  { n: "01", title: "Tell us what you need", text: "Choose a service and location to find professionals near you.", icon: "search" },
  { n: "02", title: "Explore professionals", text: "Browse profiles, experience, ratings and reviews — all free.", icon: "users" },
  { n: "03", title: "Unlock & connect", text: "Choose a membership plan to access protected contact information.", icon: "unlock" },
];

const TRUST_ITEMS = [
  { icon: "shield", title: "Verified Professionals", text: "Professionals with verified badges have their ID checked by our team." },
  { icon: "eye", title: "Transparent Profiles", text: "Browse full profiles, experience, skills and reviews before committing." },
  { icon: "lock", title: "Secure Membership", text: "Contact details are protected — unlocked only for active members." },
  { icon: "search", title: "Easy Discovery", text: "Powerful filters help you find exactly who you need, fast." },
  { icon: "layers", title: "Multiple Services", text: "One membership unlocks access across all service categories." },
];

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const featured = getFeaturedProviders(6);
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
      <section style={{ background: "var(--gradient-hero)" }}>
        <div className="container-page py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p {...heroAnim(0)} className="eyebrow">
              Trusted Service Marketplace
            </motion.p>
            <motion.h1
              {...heroAnim(0.08)}
              className="font-display text-display mt-4"
            >
              Find the Right Professional{" "}
              <span style={{ color: "var(--primary)" }}>for Every Job</span>
            </motion.h1>
            <motion.p
              {...heroAnim(0.16)}
              className="mx-auto mt-5 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Discover trusted professionals for cleaning, cooking, plumbing, maintenance, childcare and more.
            </motion.p>

            {/* Search Box */}
            <motion.div
              {...heroAnim(0.24)}
              className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-lg transition-all focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)]"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex flex-col sm:flex-row">
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
              </div>
              <div className="border-t px-3 pb-3 pt-0 sm:px-3 sm:pb-3" style={{ borderColor: "var(--line)" }}>
                <button type="button" onClick={onSearch} className="btn btn-primary btn-lg mt-3 w-full sm:w-auto sm:px-10">
                  <Icon name="search" className="h-4 w-4" />
                  Find Professionals
                </button>
              </div>
            </motion.div>

            {/* Trust Strip */}
            <motion.div
              {...heroAnim(0.32)}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
              style={{ color: "var(--muted)" }}
            >
              <span className="flex items-center gap-1.5 font-medium" style={{ color: "var(--success)" }}>
                <Icon name="shield" className="h-4 w-4" /> Verified Professionals
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="star" className="h-4 w-4" style={{ color: "var(--accent)" }} /> Highly Rated
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="lock" className="h-4 w-4" style={{ color: "var(--locked)" }} /> Secure Membership
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== POPULAR SERVICES ====== */}
      <section className="container-page py-16">
        <motion.div {...fadeUp()} className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-h2">What can we help you with?</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Browse popular service categories
            </p>
          </div>
          <Link href="/services" className="hidden text-sm font-semibold sm:block" style={{ color: "var(--primary)" }}>
            All services →
          </Link>
        </motion.div>

        <ScrollStagger
          className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-6"
        >
          {POPULAR_SERVICES.map((svc) => (
            <ScrollStaggerItem key={svc.label}>
              <Link
                href={svc.slug ? `/providers?category=${svc.slug}` : "/providers"}
                className="card card-hover flex min-w-[130px] flex-col items-center gap-3 px-4 py-5 text-center sm:min-w-0 h-full"
              >
                <span className="text-3xl">{svc.emoji}</span>
                <span className="text-sm font-semibold">{svc.label}</span>
              </Link>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>

        <Link href="/services" className="mt-4 block text-center text-sm font-semibold sm:hidden" style={{ color: "var(--primary)" }}>
          View all services →
        </Link>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section style={{ background: "var(--primary-soft)" }}>
        <div className="container-page py-16">
          <motion.div {...fadeUp()} className="text-center">
            <p className="eyebrow">How It Works</p>
            <h2 className="font-display text-h2 mt-3">Three simple steps</h2>
          </motion.div>

          <ScrollStagger className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <ScrollStaggerItem key={step.n}>
                <div className="card relative overflow-hidden h-full">
                  <span
                    className="absolute -right-2 -top-2 font-display text-[4.5rem] font-extrabold leading-none pointer-events-none"
                    style={{ color: "var(--primary)", opacity: 0.06 }}
                  >
                    {step.n}
                  </span>
                  <span
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                  >
                    <Icon name={step.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-h3">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {step.text}
                  </p>
                </div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </div>
      </section>

      {/* ====== TRUST SECTION ====== */}
      <section className="container-page py-16">
        <motion.div {...fadeUp()} className="text-center">
          <p className="eyebrow">Why Help Zone</p>
          <h2 className="font-display text-h2 mt-3">Built for trust and transparency</h2>
        </motion.div>

        <ScrollStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_ITEMS.map((item) => (
            <ScrollStaggerItem key={item.title}>
              <div className="text-center p-2">
                <span
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--line-light)", color: "var(--primary)" }}
                >
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.text}
                </p>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
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

          <ScrollStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((provider) => {
              const cat = categories.find((c) => c.id === provider.categoryId);
              return (
                <ScrollStaggerItem key={provider.id}>
                  <Link
                    href={`/providers/${provider.id}`}
                    className="card card-hover flex gap-4 h-full"
                  >
                    <Avatar
                      initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                      imageUrl={provider.photo}
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
                        <span className="flex items-center gap-1">
                          <Icon name="star" className="h-3 w-3" style={{ color: "var(--accent)" }} />
                          {provider.rating.toFixed(1)}
                        </span>
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
      <section className="container-page py-16">
        <motion.div {...fadeUp()} className="text-center">
          <p className="eyebrow">Testimonials</p>
          <h2 className="font-display text-h2 mt-3">What our users say</h2>
        </motion.div>

        <ScrollStagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <ScrollStaggerItem key={t.id}>
              <div className="card h-full">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon
                      key={j}
                      name="star"
                      className="h-4 w-4"
                      fill={j < t.rating ? "var(--accent)" : "none"}
                      style={{ color: j < t.rating ? "var(--accent)" : "var(--line)" }}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar initials={t.name[0]} imageUrl={t.avatar} className="h-9 w-9 text-xs" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{t.area}</p>
                  </div>
                </div>
              </div>
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section style={{ background: "var(--gradient-dark)" }}>
        <ScrollReveal direction="zoom" distance={20}>
          <div className="container-page py-16 text-center text-white">
            <h2 className="font-display text-h1">Ready to find help?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
              Browse professionals for free. Purchase a membership when you&apos;re ready to connect.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/providers" className="btn btn-primary btn-lg">
                <Icon name="search" className="h-4 w-4" />
                Find Professionals
              </Link>
              <Link href="/membership" className="btn btn-lg" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                View Membership Plans
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
