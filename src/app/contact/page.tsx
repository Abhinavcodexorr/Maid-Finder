import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon";

const HELP_LINKS = [
  { icon: "info", title: "Read the FAQs", body: "Quick answers on memberships, verification and hiring.", href: "/faqs", cta: "Open FAQs" },
  { icon: "compass", title: "How it works", body: "A short walkthrough from search to hiring directly.", href: "/how-it-works", cta: "See the steps" },
  { icon: "briefcase", title: "Are you a provider?", body: "List your profile for free and get found by families.", href: "/register-provider", cta: "Register as Provider" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="We're here" accent="to help" subtitle="Send us a message and our team will get back to you." />
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Send us a message</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input className="field" placeholder="Full name" aria-label="Full name" />
              <input className="field" type="email" placeholder="Email address" aria-label="Email address" />
              <input className="field md:col-span-2" placeholder="Subject" aria-label="Subject" />
              <textarea className="field min-h-36 md:col-span-2" placeholder="How can we help?" aria-label="Message" />
            </div>
            <button className="btn btn-primary btn-lg mt-5">
              <Icon name="mail" className="h-4 w-4" />
              Send Message
            </button>
          </div>

          <div className="space-y-4">
            {HELP_LINKS.map((item) => (
              <Link key={item.title} href={item.href} className="card card-hover flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{item.body}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    {item.cta} <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
