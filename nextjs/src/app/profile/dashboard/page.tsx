import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your account activity and shortcuts." />
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="card">
            <h3 className="text-sm font-semibold text-slate-500">Saved Profiles</h3>
            <p className="mt-2 text-3xl font-extrabold text-brand">12</p>
          </article>
          <article className="card">
            <h3 className="text-sm font-semibold text-slate-500">Active Subscription</h3>
            <p className="mt-2 text-3xl font-extrabold text-brand">Pro</p>
          </article>
          <article className="card">
            <h3 className="text-sm font-semibold text-slate-500">Messages</h3>
            <p className="mt-2 text-3xl font-extrabold text-brand">5</p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/search" className="btn btn-primary">
            Find Maids
          </Link>
          <Link href="/subscriptions" className="btn btn-soft">
            Manage Subscription
          </Link>
        </div>
      </section>
    </>
  );
}
