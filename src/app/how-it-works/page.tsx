"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/icon";

const FAQS = [
  {
    q: "Why do I need a membership to view contact details?",
    a: "Unlike traditional agencies that charge 1 to 2 months of helper salary (₹15,000 to ₹30,000) every time you hire, we charge a modest one-time membership starting at ₹499. This covers background verification, platform maintenance, and protects helpers from unsolicited spam calls.",
  },
  {
    q: "Are the helpers on MaidFinder verified?",
    a: "Yes. Every candidate profile undergoes identity verification using Aadhaar/Govt ID, recent photograph check, and previous employment verification before being awarded the verified badge.",
  },
  {
    q: "Do I have to pay any commission when I hire someone?",
    a: "Zero commission. Never. You negotiate salary and terms directly with the candidate. 100% of whatever wage you pay goes straight into the helper's hands.",
  },
  {
    q: "What if a helper I hire leaves after a few weeks?",
    a: "With our Standard and Premium passes, you have ongoing access to browse and contact as many replacement candidates as you need during your subscription period at no extra cost.",
  },
  {
    q: "Can I interview multiple candidates before deciding?",
    a: "Absolutely! Your membership unlocks unlimited calls and WhatsApp messages. We actively recommend speaking with 3 to 4 candidates, conducting video calls, and setting up a 2-day paid trial before confirming.",
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--surface-muted)] pb-20">
      {/* Hero Header */}
      <section className="border-b border-[var(--line)] bg-white py-16 sm:py-24">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            <Icon name="sparkles" className="h-3.5 w-3.5" /> Direct Domestic Staffing
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl mt-4" style={{ color: "var(--ink)" }}>
            The Transparent Way to Hire <br className="hidden sm:inline" />
            <span style={{ color: "var(--primary)" }}>Domestic Help in India</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Skip untrustworthy middlemen, inflated broker commissions, and false promises. Connect directly with verified maids, cooks, babysitters, and caregivers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/providers" className="btn btn-primary btn-lg">
              <Icon name="search" className="h-4 w-4" />
              Browse 1,200+ Verified Helpers
            </Link>
            <Link href="/membership" className="btn btn-secondary btn-lg">
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Step Walkthrough */}
      <section className="container-page py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--ink)" }}>
            How MaidFinder Works in 3 Simple Steps
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            From search to doorstep trial in less than 24 hours.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="card relative flex flex-col items-center text-center p-8 bg-white transition-all hover:shadow-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] mb-6 shadow-sm">
              <Icon name="search" className="h-7 w-7" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[var(--primary)] uppercase mb-1">
              Step 01
            </span>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
              Explore Pre-Vetted Profiles
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Filter by locality, service category, experience, language skills, and salary expectations without even creating an account.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card relative flex flex-col items-center text-center p-8 bg-white transition-all hover:shadow-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] mb-6 shadow-sm">
              <Icon name="unlock" className="h-7 w-7" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-1">
              Step 02
            </span>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
              Unlock Direct Contacts
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Get an affordable pass starting at ₹499 to immediately unlock candidates&apos; verified phone numbers and direct WhatsApp links.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card relative flex flex-col items-center text-center p-8 bg-white transition-all hover:shadow-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)] mb-6 shadow-sm">
              <Icon name="check-circle" className="h-7 w-7" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[var(--success)] uppercase mb-1">
              Step 03
            </span>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
              Interview & Hire Directly
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Speak directly with candidates, arrange a trial day, negotiate fair wages, and hire with 0% ongoing fees or commissions.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: MaidFinder vs Traditional Agencies */}
      <section className="container-page pb-16">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-wider uppercase text-[var(--primary)]">
              Smart Comparison
            </span>
            <h2 className="font-display text-2xl font-bold sm:text-3xl mt-1" style={{ color: "var(--ink)" }}>
              Why Families Choose MaidFinder
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2">
              Compare our direct marketplace model against traditional offline placement agencies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="pb-4 font-semibold text-[var(--muted)]">Feature</th>
                  <th className="pb-4 font-bold text-[var(--primary)]">MaidFinder Marketplace</th>
                  <th className="pb-4 font-semibold text-[var(--muted)]">Traditional Offline Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-light)]">
                <tr>
                  <td className="py-4 font-medium" style={{ color: "var(--ink)" }}>Brokerage Fee</td>
                  <td className="py-4 font-bold text-[var(--success)]">₹0 Commission (One-time pass from ₹499)</td>
                  <td className="py-4 text-[var(--error)]">₹15,000 – ₹35,000 upfront commission</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium" style={{ color: "var(--ink)" }}>Candidate Choice</td>
                  <td className="py-4 font-semibold text-[var(--ink)]">1,200+ searchable profiles with photos & bio</td>
                  <td className="py-4 text-[var(--muted)]">2 or 3 candidates pushed by the agent</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium" style={{ color: "var(--ink)" }}>Contact Method</td>
                  <td className="py-4 font-semibold text-[var(--ink)]">Direct Call & WhatsApp to helper</td>
                  <td className="py-4 text-[var(--muted)]">Through intermediate broker only</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium" style={{ color: "var(--ink)" }}>Salary Transparency</td>
                  <td className="py-4 font-semibold text-[var(--ink)]">Direct negotiation; helper keeps 100%</td>
                  <td className="py-4 text-[var(--muted)]">Agencies often pocket a chunk of salary</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium" style={{ color: "var(--ink)" }}>Replacement Speed</td>
                  <td className="py-4 font-semibold text-[var(--ink)]">Instant — pick another verified candidate</td>
                  <td className="py-4 text-[var(--muted)]">Weeks of waiting and follow-ups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verification Standard Section */}
      <section className="container-page pb-16">
        <div className="rounded-3xl p-8 sm:p-12 text-white shadow-lg" style={{ background: "var(--gradient-dark)" }}>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              <Icon name="shield" className="h-3.5 w-3.5 text-[var(--success)]" />
              Safety First
            </span>
            <h2 className="font-display text-2xl font-bold sm:text-4xl mt-3">
              Our 4-Point Verification Standard
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
              We inspect credentials before listing so you can invite domestic professionals into your home with confidence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
            <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <div className="font-display text-2xl font-bold text-[var(--primary)] mb-2">01</div>
              <h4 className="font-bold text-base mb-1">Aadhaar Verification</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                National identity card authenticity check and biometric profile match.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <div className="font-display text-2xl font-bold text-[var(--primary)] mb-2">02</div>
              <h4 className="font-bold text-base mb-1">Address & Reference</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Local residential proof check and previous employer telephone references.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <div className="font-display text-2xl font-bold text-[var(--primary)] mb-2">03</div>
              <h4 className="font-bold text-base mb-1">Skill & Cooking Test</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Evaluation of regional cuisines, cleaning technique, and equipment usage.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
              <div className="font-display text-2xl font-bold text-[var(--primary)] mb-2">04</div>
              <h4 className="font-bold text-base mb-1">Police Clearance Support</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Easy templates and assistance for local city police verification forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="container-page pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--ink)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              Everything you need to know about the platform and direct hiring.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[var(--line)] bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-sm sm:text-base"
                    style={{ color: "var(--ink)" }}
                  >
                    <span>{faq.q}</span>
                    <Icon
                      name="chevron-down"
                      className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: "var(--muted)" }}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-[var(--muted)] border-t border-[var(--line-light)] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-page">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-lg"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h2 className="font-display text-2xl font-bold sm:text-4xl">
            Ready to find your ideal household helper?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Browse verified maids, cooks, and nannies in your neighborhood right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/providers" className="btn btn-lg bg-white text-[var(--primary)] font-bold hover:bg-white/90">
              Start Browsing Free
            </Link>
            <Link href="/membership" className="btn btn-lg border border-white/30 text-white hover:bg-white/10">
              View All Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
