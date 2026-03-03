"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MaidsGridContent, type MaidQuery } from "@/components/sections/maids-grid";
import { EMIRATES } from "@/lib/constants";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [skills, setSkills] = useState(searchParams.get("skills") ?? "");
  const [emirate, setEmirate] = useState(searchParams.get("emirate") ?? "");
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") ?? "");
  const [maxSalary, setMaxSalary] = useState(searchParams.get("maxSalary") ?? "");
  const [page, setPage] = useState(searchParams.get("page") ?? "1");
  const [limit, setLimit] = useState(searchParams.get("limit") ?? "20");
  const [filterError, setFilterError] = useState<string | null>(null);

  useEffect(() => {
    setSkills(searchParams.get("skills") ?? "");
    setEmirate(searchParams.get("emirate") ?? "");
    setMinSalary(searchParams.get("minSalary") ?? "");
    setMaxSalary(searchParams.get("maxSalary") ?? "");
    setPage(searchParams.get("page") ?? "1");
    setLimit(searchParams.get("limit") ?? "20");
  }, [searchParams]);

  const query = useMemo<MaidQuery>(
    () => ({
      skills: searchParams.get("skills") || undefined,
      emirate: searchParams.get("emirate") || undefined,
      minSalary: Number(searchParams.get("minSalary")) || undefined,
      maxSalary: Number(searchParams.get("maxSalary")) || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    }),
    [searchParams],
  );

  const applyFilters = (event?: FormEvent) => {
    event?.preventDefault();
    setFilterError(null);

    const min = minSalary ? Number(minSalary) : undefined;
    const max = maxSalary ? Number(maxSalary) : undefined;
    if (min !== undefined && max !== undefined && min > max) {
      setFilterError("Min salary must be less than or equal to max salary.");
      return;
    }

    const params = new URLSearchParams();
    if (skills) params.set("skills", skills);
    if (emirate) params.set("emirate", emirate);
    if (minSalary) params.set("minSalary", minSalary);
    if (maxSalary) params.set("maxSalary", maxSalary);
    params.set("page", page || "1");
    params.set("limit", limit || "20");
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSkills("");
    setEmirate("");
    setMinSalary("");
    setMaxSalary("");
    setPage("1");
    setLimit("20");
    setFilterError(null);
    router.push("/search?page=1&limit=20");
  };

  return (
    <>
      <PageHeader title="Search Maids" subtitle="Filter by skills, visa status, and location." />
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <form className="grid gap-3 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-lg md:grid-cols-4" onSubmit={applyFilters}>
          <input className="field" placeholder="Skills (cleaning,cooking)" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <select className="field" value={emirate} onChange={(e) => setEmirate(e.target.value)}>
            <option value="">Location</option>
            {EMIRATES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="field" placeholder="Min Salary" type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
          <input className="field" placeholder="Max Salary" type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
          <input className="field" placeholder="Page" type="number" min={1} value={page} onChange={(e) => setPage(e.target.value)} />
          <input className="field" placeholder="Limit" type="number" min={1} value={limit} onChange={(e) => setLimit(e.target.value)} />
          <button className="btn btn-primary" type="submit">
            Apply Filters
          </button>
          <button className="btn btn-soft" type="button" onClick={clearFilters}>
            Clear Filters
          </button>
        </form>
        {filterError ? <p className="mt-3 text-sm text-red-600">{filterError}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {skills ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Skills: {skills}</span> : null}
          {emirate ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Emirate: {emirate}</span> : null}
          {minSalary ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Min: AED {minSalary}</span> : null}
          {maxSalary ? <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Max: AED {maxSalary}</span> : null}
        </div>
      </section>
      <MaidsGridContent query={query} />
    </>
  );
}
