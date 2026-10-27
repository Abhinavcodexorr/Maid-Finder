import type { ReactNode } from "react";
import { Underlined } from "@/components/ui/underlined";

interface PageHeaderProps {
  title: string;
  /** Second part of the title, shown in the brand colour. */
  accent?: string;
  subtitle?: string;
  eyebrow?: string;
  /** Buttons, search box or other content shown under the subtitle. */
  children?: ReactNode;
}

export function PageHeader({ title, accent, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b" style={{ background: "var(--gradient-hero)", borderColor: "var(--line)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.30), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.22), transparent 70%)" }}
      />
      <div className="container-page relative py-12 text-center sm:py-16">
        {eyebrow && (
          <p className="eyebrow">{eyebrow}</p>
        )}
        <h1 className="font-display text-h1 sm:text-display mt-3">
          {title}
          {accent && (
            <>
              {" "}
              <Underlined>{accent}</Underlined>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
