import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon";

const STATS = [
  { label: "ID Verified Professionals", value: "100%" },
  { label: "Service Categories", value: "12+" },
  { label: "Commission Charged", value: "0%" },
  { label: "To Browse Profiles", value: "Free" },
];

const VALUES = [
  {
    icon: "shield" as const,
    title: "Verification first",
    body: "Every professional on Help Zone goes through identity verification — government ID checks and a photo match — before their profile goes live.",
  },
  {
    icon: "heart" as const,
    title: "Zero commission, always",
    body: "Traditional agencies charge 1–2 months of salary as a placement fee. We don't. You pay professionals directly, and 100% of it reaches them.",
  },
  {
    icon: "zap" as const,
    title: "Direct, not brokered",
    body: "No middlemen relaying calls. Once you're a member, you call or WhatsApp candidates yourself and set terms directly.",
  },
  {
    icon: "users" as const,
    title: "Built for both sides",
    body: "Families get a vetted, searchable directory. Professionals get free listing and direct job requests — no agency cut out of their wages either.",
  },
];

const STEPS = [
  { title: "Browse for free", body: "Search verified cooks, maids, babysitters, drivers and more by city, service and experience — no sign-up required to look." },
  { title: "Become a member", body: "A one-time membership unlocks phone numbers and WhatsApp for every verified professional on the platform, not just one." },
  { title: "Hire directly", body: "Call, chat, interview, and agree on terms yourself. We stay out of the negotiation — it's your hire, your relationship." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="About"
        accent="Help Zone"
        subtitle="A direct-hire marketplace connecting Indian families with verified home-service professionals — no agencies, no commission."
      />

      <section className="container-page py-12">
        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
            Finding a trustworthy cook, maid, babysitter, or driver in India usually means going through an
            agency that charges a hefty placement fee, often a full month of the professional&apos;s wages, for a
            single introduction. Help Zone exists to remove that cost on both sides: families get a free,
            searchable directory of identity-verified professionals, and professionals get free, direct exposure to
            job requests instead of losing a cut of their income to a middleman.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="card card-hover py-5 text-center">
              <p className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--primary)" }}>{s.value}</p>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works, short form */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card card-hover">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold" style={{ color: "var(--ink)" }}>{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{step.body}</p>
              </div>
            ))}
          </div>
          <Link href="/how-it-works" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--primary)" }}>
            Read the full walkthrough <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        {/* Values */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>What we stand for</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="card card-hover flex gap-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--ink)" }}>{v.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ background: "var(--gradient-primary)" }}>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Ready to find the right professional?</h2>
            <p className="mt-1 text-sm text-white/80">Browse free. Pay once. Hire directly.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/providers" className="btn" style={{ background: "white", color: "var(--primary)" }}>
              Browse Providers
            </Link>
            <Link href="/register-provider" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              List Your Profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
