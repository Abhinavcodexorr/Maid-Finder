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
          <p className="text-[var(--muted)]">
            This page can be expanded with the final copy while keeping the same route and layout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/search" className="btn btn-primary">
              Browse Providers
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
