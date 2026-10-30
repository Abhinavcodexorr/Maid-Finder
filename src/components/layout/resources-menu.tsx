"use client";

import Link from "next/link";
import { HoverMenu } from "@/components/layout/hover-menu";
import { Icon } from "@/components/ui/icon";

export const RESOURCE_GUIDES = [
  { label: "How Help Zone works", note: "Step-by-step", href: "/how-it-works" },
  { label: "Our verification standard", note: "How we check every profile", href: "/how-it-works#verification" },
  { label: "Membership plans", note: "What you get and what it costs", href: "/membership" },
  { label: "Register as a provider", note: "List your profile for free", href: "/register-provider" },
];

export const RESOURCE_LEARN_MORE = [
  { label: "FAQs", href: "/faqs" },
  { label: "Customer reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "About Help Zone", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

/** "Resources" nav item: guides, learning links and a call to action, like a mega menu. */
export function ResourcesMenu({ active }: { active: boolean }) {
  return (
    <HoverMenu label="Resources" href="/blog" active={active} width="min(700px,92vw)" align="right">
      {(close) => (
        <div className="grid gap-4 p-2 md:grid-cols-[1fr_0.8fr_1fr]">
          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>Guides</p>
            {RESOURCE_GUIDES.map((item) => (
              <Link key={item.href} href={item.href} role="menuitem" onClick={close} className="block rounded-xl px-3 py-2 transition-colors hover:bg-[var(--primary-soft)]">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-xs" style={{ color: "var(--muted)" }}>{item.note}</span>
              </Link>
            ))}
          </div>

          <div>
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>Learn more</p>
            {RESOURCE_LEARN_MORE.map((item) => (
              <Link key={item.href} href={item.href} role="menuitem" onClick={close} className="block rounded-xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]">
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/providers" onClick={close} className="flex flex-col justify-between rounded-2xl p-5" style={{ background: "var(--surface-muted)" }}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>Start hiring</p>
              <p className="font-display mt-2 text-lg font-extrabold leading-snug">Find the right professional near you</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--primary)" }}>
              Browse professionals <Icon name="arrow-right" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </HoverMenu>
  );
}
