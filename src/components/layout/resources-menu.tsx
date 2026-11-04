"use client";

import Link from "next/link";
import { HoverMenu, MenuHeading, MenuItem } from "@/components/layout/hover-menu";
import { Icon } from "@/components/ui/icon";

export const RESOURCE_GUIDES = [
  { label: "How Help Zone works", note: "Step-by-step", href: "/how-it-works" },
  { label: "Hire a professional", note: "The full step-by-step guide", href: "/blog/hire-a-professional-step-by-step" },
  { label: "Interview questions & tips", note: "Before you meet", href: "/blog/interview-questions-and-tips" },
  { label: "Agreeing salary and terms", note: "What to cover directly", href: "/blog/agreeing-salary-and-terms-directly" },
];

export const RESOURCE_LEARN_MORE = [
  { label: "Find my match", href: "/find-my-match" },
  { label: "Offers", href: "/offers" },
  { label: "FAQs", href: "/faqs" },
  { label: "Customer reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "About Help Zone", href: "/about" },
];

/** "Resources" nav item: guides, learning links and a call to action, like a mega menu. */
export function ResourcesMenu({ active }: { active: boolean }) {
  return (
    <HoverMenu label="Resources" href="/blog" active={active}>
      {(close) => (
        <div className="grid gap-10 md:grid-cols-[1fr_1fr_340px]">
          <div>
            <MenuHeading>Guides</MenuHeading>
            {RESOURCE_GUIDES.map((item) => (
              <MenuItem key={item.href} href={item.href} title={item.label} note={item.note} onClick={close} />
            ))}
          </div>

          <div>
            <MenuHeading>Learn more</MenuHeading>
            {RESOURCE_LEARN_MORE.map((item) => (
              <MenuItem key={item.href} href={item.href} title={item.label} onClick={close} />
            ))}
          </div>

          <Link href="/providers" onClick={close} className="flex flex-col rounded-3xl p-6" style={{ background: "var(--surface-muted)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--primary)" }}>Start hiring</p>
            <p className="font-display mt-2 text-2xl font-extrabold leading-snug" style={{ color: "var(--ink)" }}>Find the right professional near you</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-base font-bold" style={{ color: "var(--primary)" }}>
              Browse professionals <Icon name="arrow-right" className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </HoverMenu>
  );
}
