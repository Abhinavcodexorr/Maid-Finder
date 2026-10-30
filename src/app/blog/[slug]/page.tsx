import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ARTICLES, getArticle } from "@/data/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return article ? { title: `${article.title} | Help Zone`, description: article.summary } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const more = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <article className="container-page max-w-3xl py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--muted)" }}>
        <Icon name="arrow-left" className="h-4 w-4" /> All articles
      </Link>
      <span className="pill pill-primary mt-6 text-xs font-semibold">{article.category}</span>
      <h1 className="font-display text-h1 mt-3">{article.title}</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{article.readMinutes} min read</p>

      <div className="mt-8 space-y-5 text-base leading-relaxed" style={{ color: "var(--ink-light)" }}>
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 rounded-3xl p-8 text-white" style={{ background: "var(--gradient-primary)" }}>
        <h2 className="font-display text-2xl font-extrabold">Ready to find someone you can trust?</h2>
        <p className="mt-2 text-white/85">Browse verified professionals for free and contact them directly.</p>
        <Link href="/providers" className="btn btn-lg mt-5 bg-white font-bold" style={{ color: "var(--primary-dark)" }}>
          Browse professionals
        </Link>
      </div>

      <h2 className="font-display mt-12 text-xl font-extrabold">Keep reading</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {more.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="card card-hover">
            <p className="font-display text-base font-extrabold leading-snug">{a.title}</p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{a.readMinutes} min read</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
