import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Customer reviews | Help Zone",
  description: "Read what families say about hiring through Help Zone.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHeader eyebrow="Reviews" title="What our users" accent="say" subtitle="Stories from families who found trusted help through Help Zone." />
      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="flex h-full flex-col rounded-3xl border bg-white p-7 shadow-sm transition-shadow hover:shadow-lg" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-center justify-between">
                <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="h-5 w-5" style={{ color: i < t.rating ? "var(--accent)" : "var(--line)" }} />
                  ))}
                </div>
                <span aria-hidden className="font-display text-5xl font-extrabold leading-none" style={{ color: "var(--primary-soft)" }}>&rdquo;</span>
              </div>
              <blockquote className="mt-4 flex-1 text-[15.5px] leading-[1.7]" style={{ color: "var(--ink-light)" }}>&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3.5 border-t pt-5" style={{ borderColor: "var(--line-light)" }}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                  {t.name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold" style={{ color: "var(--ink)" }}>{t.name}</span>
                  <span className="block truncate text-[13px]" style={{ color: "var(--muted)" }}>{t.area}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/providers" className="btn btn-primary btn-lg">Find a professional</Link>
        </div>
      </section>
    </>
  );
}
