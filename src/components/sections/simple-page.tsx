import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

interface SimplePageProps {
  title: string;
  subtitle: string;
}

export function SimplePage({ title, subtitle }: SimplePageProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card">
          <p className="text-slate-700">
            This page is migrated to Next.js App Router with production layout and reusable components.
            Content can be expanded exactly as needed while preserving the same route and flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/search" className="btn btn-primary">
              Browse Maids
            </Link>
            <Link href="/contact" className="btn btn-soft">
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
