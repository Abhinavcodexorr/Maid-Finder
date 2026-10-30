import type { ReactNode } from "react";

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
    <section className="relative overflow-hidden text-white" style={{ background: "var(--gradient-dark)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)" }}
      />
      <div className="container-page relative py-12 text-center sm:py-16">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur">{eyebrow}</p>
        )}
        <h1 className="font-display text-h1 sm:text-display mt-3">
          {title}
          {accent && (
            <>
              {" "}
              <span style={{ background: "linear-gradient(90deg, #7dd3fc, #93c5fd 45%, #c4b5fd)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{accent}</span>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "rgba(255,255,255,0.72)" }}>
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
