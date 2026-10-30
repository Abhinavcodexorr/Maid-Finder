import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="card break-inside-avoid">
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="h-4 w-4" style={{ color: i < t.rating ? "var(--accent)" : "var(--line)" }} />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatar ? (
                  <Image src={t.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
                    {t.name[0]}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="block text-xs" style={{ color: "var(--muted)" }}>{t.area}</span>
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
