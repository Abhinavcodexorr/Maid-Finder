import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { FaqList } from "@/components/sections/faq-list";
import { FAQS } from "@/data/faqs";

export default function FaqsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help Centre"
        title="Frequently Asked"
        accent="Questions"
        subtitle="Everything about memberships, verification and hiring directly — answered."
      />
      <section className="container-page py-12">
        <FaqList items={FAQS} />
        <div className="card mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="font-display text-lg font-bold">Still have a question?</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Our team is happy to help.</p>
          </div>
          <Link href="/contact" className="btn btn-primary shrink-0">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
