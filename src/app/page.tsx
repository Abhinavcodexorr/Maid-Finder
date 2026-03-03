"use client";

import { MaidsGrid } from "@/components/sections/maids-grid";
import { PageHeader } from "@/components/layout/page-header";
import { EMIRATES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [emirate, setEmirate] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (skills) params.set("skills", skills);
    if (emirate) params.set("emirate", emirate);
    if (minSalary) params.set("minSalary", minSalary);
    params.set("page", "1");
    params.set("limit", "20");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <PageHeader
        title="Find Your Perfect Maid"
        subtitle="Connect with trusted, verified domestic helpers in the UAE with a premium, smooth user experience."
      />

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-2xl border border-slate-100 bg-white/85 p-6 shadow-xl md:grid-cols-3">
          <select className="field" value={skills} onChange={(e) => setSkills(e.target.value)}>
            <option value="">Select Skills</option>
            <option value="childcare">Childcare</option>
            <option value="cooking">Cooking</option>
            <option value="cleaning">Cleaning</option>
            <option value="laundry">Laundry</option>
          </select>
          <select className="field" value={emirate} onChange={(e) => setEmirate(e.target.value)}>
            <option value="">Select Location</option>
            {EMIRATES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            className="field"
            placeholder="Min Salary (AED)"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button type="button" onClick={onSearch} className="btn btn-primary">
            Search Maids
          </button>
          <button
            type="button"
            onClick={() => {
              setSkills("");
              setEmirate("");
              setMinSalary("");
            }}
            className="btn btn-soft"
          >
            Reset
          </button>
        </div>
      </section>

      <MaidsGrid />
    </>
  );
}
