import Link from "next/link";
import { MaidsGrid } from "@/components/sections/maids-grid";
import { PageHeader } from "@/components/layout/page-header";

export default function Home() {
  return (
    <>
      <PageHeader
        title="Find Your Perfect Maid"
        subtitle="Connect with trusted, verified domestic helpers in the UAE with a premium, smooth user experience."
      />

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-2xl bg-white/85 p-6 shadow-xl md:grid-cols-3">
          <select className="field">
            <option>Select Nationality</option>
            <option>Filipino</option>
            <option>Indian</option>
            <option>Sri Lankan</option>
          </select>
          <select className="field">
            <option>Select Skills</option>
            <option>Childcare</option>
            <option>Cooking</option>
            <option>Cleaning</option>
          </select>
          <select className="field">
            <option>Select Location</option>
            <option>Dubai</option>
            <option>Abu Dhabi</option>
            <option>Sharjah</option>
          </select>
        </div>
        <div className="mt-4 flex justify-center">
          <Link href="/search" className="btn btn-primary">
            Search Maids
          </Link>
        </div>
      </section>

      <MaidsGrid />
    </>
  );
}
