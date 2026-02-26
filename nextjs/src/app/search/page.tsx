import { PageHeader } from "@/components/layout/page-header";
import { MaidsGrid } from "@/components/sections/maids-grid";

export default function SearchPage() {
  return (
    <>
      <PageHeader title="Search Maids" subtitle="Filter by skills, visa status, and location." />
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-2xl bg-white/90 p-5 shadow md:grid-cols-4">
          <input className="field" placeholder="Nationality" />
          <input className="field" placeholder="Skill" />
          <input className="field" placeholder="Location" />
          <button className="btn btn-primary">Apply Filters</button>
        </div>
      </section>
      <MaidsGrid />
    </>
  );
}
