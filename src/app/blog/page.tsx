import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Icon } from "@/components/ui/icon";
import { ARTICLES } from "@/data/articles";

export const metadata: Metadata = {
  title: "Blog | Help Zone",
  description: "Hiring tips, safety guides and home-service insights from Help Zone.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Blog" title="Hiring tips &" accent="guides" subtitle="Practical advice on finding, hiring and working with trusted home professionals." />
      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="card card-hover flex flex-col">
              <span className="pill pill-primary self-start text-xs font-semibold">{article.category}</span>
              <h2 className="font-display mt-4 text-xl font-extrabold leading-snug">{article.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{article.summary}</p>
              <div className="mt-5 flex items-center justify-between text-xs font-semibold">
                <span style={{ color: "var(--muted)" }}>{article.readMinutes} min read</span>
                <span className="inline-flex items-center gap-1" style={{ color: "var(--primary)" }}>
                  Read <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
