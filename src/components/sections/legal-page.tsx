import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: Array<{ heading: string; body: string[] }> }) {
  return (
    <>
      <PageHeader title={title} subtitle={`Last updated ${updated}`} />
      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border bg-white p-6 shadow-sm sm:p-10" style={{ borderColor: "var(--line)" }}>
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-h3 mb-3">{s.heading}</h2>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Questions? <Link href="/contact" className="font-semibold" style={{ color: "var(--primary)" }}>Contact our team</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
