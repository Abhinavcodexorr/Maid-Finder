"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getCategories, getAllProviders } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";

const CATEGORY_DETAILS: Record<
  string,
  {
    emoji: string;
    startingPrice: string;
    popularSkills: string[];
    highlights: string[];
  }
> = {
  "cat-cook": {
    emoji: "🍳",
    startingPrice: "₹5,500/mo",
    popularSkills: ["North Indian", "South Indian", "Jain Food", "Tiffin Service"],
    highlights: ["Hygiene certified", "Dietary customisation", "Trial tasting allowed"],
  },
  "cat-maid": {
    emoji: "🧹",
    startingPrice: "₹4,000/mo",
    popularSkills: ["Deep Cleaning", "Utensils", "Sweeping & Mopping", "Laundry & Ironing"],
    highlights: ["Background checked", "Punctual & verified", "Flexible morning/evening"],
  },
  "cat-babysitter": {
    emoji: "👶",
    startingPrice: "₹8,500/mo",
    popularSkills: ["Infant Care", "Toddler Care", "Night Shifts", "Play Activities"],
    highlights: ["Patient & trained", "First aid aware", "Live-in or part-time"],
  },
  "cat-elderly-care": {
    emoji: "👵",
    startingPrice: "₹9,500/mo",
    popularSkills: ["Mobility Support", "Medication Reminders", "Dementia Care", "Companionship"],
    highlights: ["Compassionate staff", "Post-op assistance", "24x7 residency options"],
  },
  "cat-driver": {
    emoji: "🚗",
    startingPrice: "₹16,000/mo",
    popularSkills: ["City Commute", "Manual & Automatic", "Outstation", "Commercial License"],
    highlights: ["Clean driving record", "Route familiarity", "Day & night shifts"],
  },
  "cat-plumber": {
    emoji: "🔧",
    startingPrice: "₹300/visit",
    popularSkills: ["Leak Repair", "Pipe Fitting", "Bathroom Fittings", "Water Tank"],
    highlights: ["Same-day emergency", "Standard toolsets", "Clear labor rates"],
  },
  "cat-electrician": {
    emoji: "⚡",
    startingPrice: "₹280/visit",
    popularSkills: ["Wiring", "Switchboards", "Appliance Repair", "Safety Audits"],
    highlights: ["Certified technicians", "Circuit diagnostics", "Emergency repair"],
  },
  "cat-carpenter": {
    emoji: "🪚",
    startingPrice: "₹400/visit",
    popularSkills: ["Furniture Repair", "Door & Window", "Modular Kitchen", "Polishing"],
    highlights: ["Accurate measurements", "Wood finishing", "Custom work"],
  },
  "cat-painter": {
    emoji: "🎨",
    startingPrice: "₹500/day",
    popularSkills: ["Interior Painting", "Texture Work", "Waterproofing", "Wood Polish"],
    highlights: ["Clean prep work", "Neat edges", "Material guidance"],
  },
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const categories = useMemo(() => getCategories(), []);
  const allProviders = useMemo(() => getAllProviders(), []);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((c) => {
      const details = CATEGORY_DETAILS[c.id];
      const matchesName = c.name.toLowerCase().includes(q);
      const matchesDesc = c.shortDescription.toLowerCase().includes(q);
      const matchesSkills = details?.popularSkills.some((s) => s.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesSkills;
    });
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--surface-muted)] pb-20">
      {/* Hero Header */}
      <section className="border-b border-[var(--line)] bg-white py-14 sm:py-20">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Icon name="check-badge" className="h-3.5 w-3.5" /> Full Marketplace Directory
          </span>
          <h1
            className="font-display text-3xl font-extrabold sm:text-5xl mt-3 tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Verified Domestic Services <br className="hidden sm:inline" />
            <span style={{ color: "var(--primary)" }}>Across India</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            Directly connect with 1,200+ background-screened maids, cooks, babysitters, drivers, and home professionals across all Indian cities. Zero agency commissions.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="flex items-center rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-2 shadow-sm transition-all focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)] focus-within:bg-white">
              <Icon name="search" className="h-5 w-5 text-[var(--muted)] ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search services (e.g. Deep Cleaning, Jain Cook, Nanny)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-page py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
              Explore Service Categories
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5">
              Select a service to view verified candidate profiles, experience, and pricing.
            </p>
          </div>

          <Link href="/providers" className="btn btn-secondary btn-sm text-xs shrink-0">
            <Icon name="search" className="h-3.5 w-3.5" />
            View All {allProviders.length} Candidates
          </Link>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)]">
              <Icon name="search" className="h-7 w-7" />
            </div>
            <h3 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
              No services match &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1">Try searching for cleaning, cooking, plumbing, or driver.</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="btn btn-primary btn-sm mt-4 text-xs"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <ScrollStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => {
              const details = CATEGORY_DETAILS[cat.id] ?? {
                emoji: "🧹",
                startingPrice: "₹4,000/mo",
                popularSkills: cat.skills.slice(0, 4),
                highlights: ["Identity checked", "Direct contact", "Free trial"],
              };

              // Count providers in this category
              const count = allProviders.filter((p) => p.categoryId === cat.id).length;

              return (
                <ScrollStaggerItem key={cat.id}>
                  <div className="card group flex flex-col justify-between overflow-hidden p-6 bg-white transition-all hover:shadow-lg hover:border-[var(--primary)] h-full">
                  <div>
                    {/* Top Row: Emoji Icon + Count Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-3xl shadow-sm transition-transform group-hover:scale-110">
                        {details.emoji}
                      </div>

                      <span className="pill pill-primary text-xs font-semibold">
                        {count} Verified Available
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-5">
                      <h3 className="font-display text-xl font-bold group-hover:text-[var(--primary)] transition-colors" style={{ color: "var(--ink)" }}>
                        {cat.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                        {cat.shortDescription}
                      </p>
                    </div>

                    {/* Pricing Benchmark */}
                    <div className="mt-4 rounded-xl bg-[var(--surface-muted)] p-3 border border-[var(--line-light)]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[var(--muted)]">Market Salary / Rate:</span>
                        <span className="font-bold text-[var(--primary)]">{details.startingPrice}</span>
                      </div>
                    </div>

                    {/* Popular Skills */}
                    <div className="mt-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        Specialties:
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {details.popularSkills.map((sk) => (
                          <span
                            key={sk}
                            className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 border-t border-[var(--line-light)] pt-4">
                    <Link
                      href={`/services/${cat.slug}`}
                      className="btn btn-primary w-full text-xs font-bold group-hover:shadow-md"
                    >
                      Browse {cat.name} Profiles ({count})
                      <Icon name="arrow-right" className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </ScrollStaggerItem>
            );
          })}
          </ScrollStagger>
        )}
      </section>

      {/* Staffing Arrangements Section */}
      <section className="container-page py-12">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Flexible Arrangements
            </span>
            <h2 className="font-display text-2xl font-bold sm:text-3xl mt-1" style={{ color: "var(--ink)" }}>
              Hire on Your Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1.5">
              Choose the exact working arrangement that fits your household routine.
            </p>
          </div>

          <ScrollStagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollStaggerItem>
              <div className="rounded-2xl border border-[var(--line-light)] p-5 bg-[var(--surface-muted)]/50 h-full">
                <span className="text-3xl mb-3 block">☀️</span>
                <h4 className="font-display text-base font-bold mb-1" style={{ color: "var(--ink)" }}>
                  Part-Time
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  2 to 4 hours daily for morning or evening cooking, sweeping, mopping, and utensils.
                </p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <div className="rounded-2xl border border-[var(--line-light)] p-5 bg-[var(--surface-muted)]/50 h-full">
                <span className="text-3xl mb-3 block">🏡</span>
                <h4 className="font-display text-base font-bold mb-1" style={{ color: "var(--ink)" }}>
                  Full-Time (Live-Out)
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  8 to 10 hours daily comprehensive house care, meal preparation, and childcare support.
                </p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <div className="rounded-2xl border border-[var(--line-light)] p-5 bg-[var(--surface-muted)]/50 h-full">
                <span className="text-3xl mb-3 block">🛏️</span>
                <h4 className="font-display text-base font-bold mb-1" style={{ color: "var(--ink)" }}>
                  Live-In (24x7)
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Round-the-clock residency for dedicated infant care, elderly assistance, or expansive estates.
                </p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem>
              <div className="rounded-2xl border border-[var(--line-light)] p-5 bg-[var(--surface-muted)]/50 h-full">
                <span className="text-3xl mb-3 block">⚡</span>
                <h4 className="font-display text-base font-bold mb-1" style={{ color: "var(--ink)" }}>
                  On-Demand / One-Time
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Per-visit plumbing emergencies, party cooking relief, deep cleaning, or driver bookings.
                </p>
              </div>
            </ScrollStaggerItem>
          </ScrollStagger>
        </div>
      </section>

      {/* Safety & Zero Brokerage Highlights */}
      <section className="container-page pb-8">
        <ScrollReveal direction="zoom" distance={20}>
          <div
            className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Icon name="shield" className="h-3.5 w-3.5" /> 100% Commission-Free
            </span>
            <h2 className="font-display text-2xl font-bold sm:text-4xl mt-3">
              Why Hire Through Help Zone?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
              Traditional placement agencies charge you 1 to 2 months of helper salary (₹15,000 to ₹35,000) every time you hire. With Help Zone, you pay an affordable one-time pass and connect with candidates directly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mt-8 pt-6 border-t border-white/20">
            <div>
              <div className="font-display text-2xl font-bold text-white mb-1">0% Brokerage</div>
              <p className="text-xs text-white/80">Every rupee of the agreed salary goes straight to your helper.</p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white mb-1">ID Verified</div>
              <p className="text-xs text-white/80">National Aadhaar, address, and reference checks conducted upfront.</p>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white mb-1">Free Replacements</div>
              <p className="text-xs text-white/80">Browse and interview replacements at no extra charge during your pass.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/providers" className="btn btn-lg bg-white text-[var(--primary)] font-bold hover:bg-white/90">
              Browse 1,200+ Candidates
            </Link>
            <Link href="/membership" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
              View Membership Plans
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
    </div>
  );
}
