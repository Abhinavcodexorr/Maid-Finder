"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCategories,
  getDistinctAreasFrom,
  getDistinctCitiesFrom,
  getDistinctLanguagesFrom,
  getSkillsForCategory,
  getProvidersFrom,
  fetchLiveProviders,
} from "@/lib/services";
import { useLocation } from "@/context/LocationContext";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { applyLocation } from "@/lib/geo";
import { fetchCatalogServices } from "@/lib/services/provider-applications";
import { ServiceGlyph, serviceGradient } from "@/components/ui/service-glyph";
import { Icon } from "@/components/ui/icon";
import { ProviderCardSkeleton } from "@/components/ui/shimmer";
import { ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import type { AvailabilityType, Gender, Provider, ProviderFilters } from "@/types/marketplace";


const EXP_OPTIONS: { id: NonNullable<ProviderFilters["experience"]>; label: string }[] = [
  { id: "0-1", label: "0 – 1 years" },
  { id: "1-3", label: "1 – 3 years" },
  { id: "3-5", label: "3 – 5 years" },
  { id: "5+", label: "5+ years" },
];

const AVAIL_OPTIONS: { id: AvailabilityType; label: string }[] = [
  { id: "full-time", label: "Full-time (8-10h)" },
  { id: "part-time", label: "Part-time (2-4h)" },
  { id: "live-in", label: "Live-in (24h)" },
  { id: "one-time", label: "One-time / Relief" },
];

const SORT_OPTIONS: { id: NonNullable<ProviderFilters["sort"]>; label: string }[] = [
  { id: "rating", label: "Highest Rated" },
  { id: "experience", label: "Most Experienced" },
  { id: "newest", label: "Recently Added" },
  { id: "price-asc", label: "Salary: Low to High" },
  { id: "price-desc", label: "Salary: High to Low" },
];

function csv(p: string | null): string[] {
  return p ? p.split(",").filter(Boolean) : [];
}

/* ================================================================
   FILTER SIDEBAR PANEL
   ================================================================ */
function FilterPanel({
  categories,
  areas,
  cities,
  languages,
  categoryIds,
  area,
  experience,
  availabilityType,
  gender,
  selectedLanguages,
  selectedSkills,
  verifiedOnly,
  availableSkills,
  updateParams,
  toggleCsv,
  clearAll,
  activeCount,
}: {
  categories: ReturnType<typeof getCategories>;
  areas: string[];
  cities: string[];
  languages: string[];
  categoryIds: string[];
  area: string;
  experience: ProviderFilters["experience"];
  availabilityType: AvailabilityType | undefined;
  gender: Gender | undefined;
  selectedLanguages: string[];
  selectedSkills: string[];
  verifiedOnly: boolean;
  availableSkills: string[];
  updateParams: (p: Record<string, string | null>) => void;
  toggleCsv: (key: string, val: string, curr: string[]) => void;
  clearAll: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-7 [&>div+div]:border-t [&>div+div]:border-[var(--line-light)] [&>div+div]:pt-6">
      {/* Service Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Service</p>
          {categoryIds.length > 0 && (
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
          {categories.map((c) => {
            const checked = categoryIds.includes(c.id) || categoryIds.includes(c.slug);
            return (
              <label
                key={c.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition-colors ${
                  checked ? "bg-[var(--primary-soft)] font-semibold text-[var(--primary-dark)]" : "text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCsv("category", c.id, categoryIds)}
                  className="sr-only"
                />
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={checked ? { background: "var(--primary)", color: "white" } : { background: "var(--line-light)", color: "var(--ink-light)" }}
                >
                  <ServiceGlyph name={c.name} className="h-4 w-4" />
                </span>
                <span className="flex-1">{c.name}</span>
                {checked && <Icon name="check" className="h-4 w-4 text-[var(--primary)]" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* Specific Skills if single category selected */}
      {availableSkills.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Skills & Speciality</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSkills.map((sk) => {
              const active = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleCsv("skills", sk, selectedSkills)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Location / Area */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Location / City</p>
        <select
          className="field !rounded-xl text-sm"
          value={area}
          onChange={(e) => updateParams({ area: e.target.value || null })}
        >
          <option value="">All Locations Across India</option>
          <optgroup label="Major Cities">
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </optgroup>
          <optgroup label="Localities / Neighborhoods">
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Working Arrangement */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Work Schedule</p>
        <select
          className="field !rounded-xl text-sm"
          value={availabilityType ?? ""}
          onChange={(e) => updateParams({ availability: e.target.value || null })}
        >
          <option value="">Any Schedule</option>
          {AVAIL_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Range */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Experience</p>
        <div className="space-y-1.5">
          {EXP_OPTIONS.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="experience"
                checked={experience === o.id}
                onChange={() => updateParams({ experience: o.id })}
                className="accent-[var(--primary)]"
              />
              <span style={{ color: "var(--ink)" }}>{o.label}</span>
            </label>
          ))}
          {experience && (
            <button
              type="button"
              onClick={() => updateParams({ experience: null })}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
            >
              Clear experience
            </button>
          )}
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Gender Preference</p>
        <div className="flex gap-2">
          {(["female", "male"] as Gender[]).map((g) => {
            const active = gender === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => updateParams({ gender: active ? null : g })}
                className={`flex-1 rounded-xl py-1.5 text-xs font-semibold capitalize transition-all border ${
                  active
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                    : "border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified Only Toggle */}
      <label className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] p-3 text-xs font-semibold cursor-pointer bg-[var(--surface-muted)]/50">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => updateParams({ verified: e.target.checked ? "1" : null })}
          className="h-4 w-4 rounded accent-[var(--primary)]"
        />
        <div className="flex items-center gap-1.5">
          <Icon name="check-circle" className="h-4 w-4 text-[var(--primary)]" />
          <span>Show Verified Only</span>
        </div>
      </label>

      {/* Languages */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Languages Spoken</p>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => {
            const active = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleCsv("languages", lang, selectedLanguages)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-outline w-full text-xs font-semibold"
        >
          Reset All Filters ({activeCount})
        </button>
      )}
    </div>
  );
}

/* ================================================================
   MAIN PROVIDERS CONTENT
   ================================================================ */
function ProvidersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // The admin-managed catalog is the source of truth for service names/keys
// (what providers register under); the bundled list is only the fallback.
const [categories, setCategories] = useState(() => getCategories());
  useEffect(() => {
    let cancelled = false;
    fetchCatalogServices()
      .then((services) => {
        if (cancelled || services.length === 0) return;
        setCategories(
          services.map((svc) => ({
            id: svc.key,
            slug: svc.key.replace(/^cat-/, ""),
            name: svc.name,
            icon: "briefcase",
            shortDescription: "",
            skills: [],
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { location, radiusKm } = useLocation();
  const [liveProviders, setLiveProviders] = useState<Provider[] | null>(null);
  // Distances (and the radius cut-off) are worked out once here, so filters, sorting and paging all see them.
  const nearbyProviders = useMemo(() => applyLocation(liveProviders ?? [], location, radiusKm), [liveProviders, location, radiusKm]);
  const sortOptions = location ? [{ id: "nearest" as const, label: "Nearest First" }, ...SORT_OPTIONS] : SORT_OPTIONS;
  const areas = useMemo(() => getDistinctAreasFrom(liveProviders ?? []), [liveProviders]);
  const cities = useMemo(() => getDistinctCitiesFrom(liveProviders ?? []), [liveProviders]);
  const languages = useMemo(() => getDistinctLanguagesFrom(liveProviders ?? []), [liveProviders]);
  useEffect(() => {
    let cancelled = false;
    fetchLiveProviders()
      .then((list) => { if (!cancelled) setLiveProviders(list); })
      .catch(() => { if (!cancelled) setLiveProviders([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Search parameters
  const categoryIds = csv(searchParams.get("category"));
  const area = searchParams.get("area") ?? "";
  const experience = (searchParams.get("experience") as ProviderFilters["experience"]) ?? undefined;
  const availabilityType = (searchParams.get("availability") as AvailabilityType) ?? undefined;
  const gender = (searchParams.get("gender") as Gender) ?? undefined;
  const selectedLanguages = csv(searchParams.get("languages"));
  const selectedSkills = csv(searchParams.get("skills"));
  const verifiedOnly = searchParams.get("verified") === "1";
  const sort = (searchParams.get("sort") as ProviderFilters["sort"]) ?? (location ? "nearest" : "rating");
  const page = Number(searchParams.get("page") ?? "1");
  const q = searchParams.get("q") ?? "";

  // Local search query input for real-time responsiveness
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const availableSkills = useMemo(() => {
    if (categoryIds.length !== 1) return [];
    return getSkillsForCategory(categoryIds[0]);
  }, [categoryIds]);

  const result = useMemo(
    () =>
      getProvidersFrom(nearbyProviders, {
        q,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        area: area || undefined,
        experience,
        availabilityType,
        gender,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        verifiedOnly: verifiedOnly || undefined,
        sort,
        page,
        pageSize: 9,
      }),
    [nearbyProviders, q, categoryIds, area, experience, availabilityType, gender, selectedLanguages, selectedSkills, verifiedOnly, sort, page]
  );

  // Suggested candidates in case of 0 results
  const suggested = useMemo(() => {
    if (result.total > 0 || !liveProviders) return [];
    return getProvidersFrom(liveProviders, { pageSize: 6, sort: "rating" }).items;
  }, [result.total, liveProviders]);

  const updateParams = (patch: Record<string, string | null>) => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    if (!("page" in patch)) params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    setTimeout(() => setLoading(false), 260);
  };

  const toggleCsv = (key: string, val: string, curr: string[]) => {
    const next = curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const activeCount =
    (q ? 1 : 0) +
    (area ? 1 : 0) +
    (experience ? 1 : 0) +
    (availabilityType ? 1 : 0) +
    (gender ? 1 : 0) +
    selectedLanguages.length +
    selectedSkills.length +
    (verifiedOnly ? 1 : 0) +
    categoryIds.length;

  const clearAll = () => router.push(pathname);

  // Active filter chips
  const chips: { label: string; onClear: () => void }[] = [];
  if (q) chips.push({ label: `"${q}"`, onClear: () => updateParams({ q: null }) });
  categoryIds.forEach((id) => {
    const c = categories.find((cat) => cat.id === id || cat.slug === id);
    if (c) chips.push({ label: c.name, onClear: () => toggleCsv("category", id, categoryIds) });
  });
  if (area) chips.push({ label: area, onClear: () => updateParams({ area: null }) });
  if (experience) chips.push({ label: `${experience} yrs exp`, onClear: () => updateParams({ experience: null }) });
  if (availabilityType) chips.push({ label: availabilityType, onClear: () => updateParams({ availability: null }) });
  if (gender) chips.push({ label: gender, onClear: () => updateParams({ gender: null }) });
  if (verifiedOnly) chips.push({ label: "Verified Only", onClear: () => updateParams({ verified: null }) });
  selectedSkills.forEach((sk) => {
    chips.push({ label: sk, onClear: () => toggleCsv("skills", sk, selectedSkills) });
  });

  const filterProps = {
    categories,
    areas,
    cities,
    languages,
    categoryIds,
    area,
    experience,
    availabilityType,
    gender,
    selectedLanguages,
    selectedSkills,
    verifiedOnly,
    availableSkills,
    updateParams,
    toggleCsv,
    clearAll,
    activeCount,
  };

  return (
    <div className="min-h-screen bg-[var(--surface-muted)] pb-16">
      {/* Hero Header with Search Bar */}
      <section className="relative overflow-hidden border-b pb-6 pt-10 sm:pt-14" style={{ borderColor: "var(--line)", background: "var(--gradient-hero)" }}>
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-60 blur-3xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.30), transparent 70%)" }} />
        <div className="container-page relative space-y-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] shadow-sm" style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: "var(--primary)" }}>
                  <Icon name="check" className="h-3 w-3" />
                </span>
                100% pre-screened talent
              </span>
              <h1 className="font-display text-display mt-4 !text-4xl sm:!text-5xl">
                Find trusted <span style={{ color: "var(--primary)" }}>professionals</span> across India
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                Connect directly with verified maids, cooks, nannies, drivers and skilled professionals in your city — 0% commission.
              </p>
            </div>

            {/* Quick Live Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center rounded-full border bg-white p-2 shadow-xl transition-all focus-within:ring-4 focus-within:ring-[var(--primary-soft)] lg:max-w-md"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex flex-1 items-center gap-3 px-4">
                <Icon name="search" className="h-5 w-5 shrink-0 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search maid, cook, skill..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
              <button type="submit" className="btn btn-primary px-6 font-bold">
                Search
              </button>
            </form>
          </div>

          {/* Quick Category Tabs Bar */}
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-5 text-sm font-bold transition-all ${
                categoryIds.length === 0
                  ? "text-white shadow-lg"
                  : "border bg-white text-[var(--ink-secondary)] hover:-translate-y-0.5 hover:shadow-md"
              }`}
              style={categoryIds.length === 0 ? { background: "var(--gradient-primary)" } : { borderColor: "var(--line)" }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${categoryIds.length === 0 ? "bg-white/25" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>
                <Icon name="grid" className="h-4 w-4" />
              </span>
              All ({(liveProviders ?? []).length})
            </button>
            {categories.map((c, i) => {
              const active = categoryIds.includes(c.id) || categoryIds.includes(c.slug);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateParams({ category: active ? null : c.id })}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-5 text-sm font-bold transition-all ${
                    active
                      ? "text-white shadow-lg"
                      : "border bg-white text-[var(--ink-secondary)] hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                  style={active ? { background: "var(--gradient-primary)" } : { borderColor: "var(--line)" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: active ? "rgba(255,255,255,0.25)" : serviceGradient(i) }}>
                    <ServiceGlyph name={c.name} className="h-4 w-4" />
                  </span>
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Filter Chips */}
      {chips.length > 0 && (
        <div className="container-page flex flex-wrap items-center gap-2 py-3">
          <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            Active filters:
          </span>
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)]"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onClear}
                className="hover:opacity-70 transition-opacity"
                title="Remove filter"
              >
                <Icon name="x" className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[var(--primary)] hover:underline ml-2"
          >
            Clear all ({chips.length})
          </button>
        </div>
      )}

      {/* Main Two-Column Content */}
      <div className="container-page pt-4">
        {/* Mobile filter button */}
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="btn btn-secondary flex flex-1 items-center justify-center gap-2 text-xs font-semibold"
          >
            <Icon name="filter" className="h-4 w-4" />
            Filters {activeCount > 0 ? `(${activeCount})` : ""}
          </button>

          <select
            className="field w-auto text-xs"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line-light)] mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="filter" className="h-4 w-4 text-[var(--primary)]" />
                  <span className="font-display text-sm font-bold" style={{ color: "var(--ink)" }}>
                    Filters
                  </span>
                </div>
                {activeCount > 0 && (
                  <span className="pill pill-primary text-[10px] font-bold">
                    {activeCount} active
                  </span>
                )}
              </div>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Results Area */}
          <div>
            {/* Top Toolbar */}
            <div className="mb-5 hidden items-center justify-between rounded-3xl border border-[var(--line)] bg-white px-5 py-4 shadow-sm sm:flex">
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Showing <span className="text-[var(--primary)] font-bold">{result.total}</span> professionals
                {location && (
                  <span className="font-normal" style={{ color: "var(--muted)" }}>
                    {" "}{radiusKm ? `within ${radiusKm} km of` : "near"} {location.city || "you"}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center rounded-xl bg-[var(--surface-muted)] p-1 border border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-[var(--primary)] shadow-sm font-bold"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                    title="Grid view"
                  >
                    <Icon name="grid" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-1.5 transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-[var(--primary)] shadow-sm font-bold"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                    title="List view"
                  >
                    <Icon name="list" className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Selector */}
                <select
                  className="field w-auto text-xs py-1.5"
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                >
                  {sortOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Grid or Empty State with Suggestions */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProviderCardSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : result.items.length === 0 ? (
              <div className="space-y-8">
                <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)]">
                    <Icon name="search" className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>
                    No candidates match your current filters
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
                    {location ? `No professionals match these filters ${radiusKm ? `within ${radiusKm} km of` : "near"} ${location.city || "you"}. Try a wider distance from the bar at the top, or loosen the filters.` : "We couldn't find any professionals matching all selected filters. Try broadening your location or service requirements."}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={clearAll}
                      className="btn btn-primary text-xs font-semibold"
                    >
                      <Icon name="refresh-cw" className="h-3.5 w-3.5" />
                      Reset All Filters
                    </button>
                  </div>
                </div>

                {/* Suggested Alternatives */}
                {suggested.length > 0 && (
                  <div>
                    <h4 className="font-display text-base font-bold mb-4" style={{ color: "var(--ink)" }}>
                      Top-Rated Candidates Available Across India
                    </h4>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {suggested.map((p) => (
                        <ProviderCard key={p.id} provider={p} viewMode="grid" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ScrollStagger
                  className={
                    viewMode === "grid"
                      ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {result.items.map((p) => (
                    <ScrollStaggerItem key={p.id}>
                      <ProviderCard provider={p} viewMode={viewMode} />
                    </ScrollStaggerItem>
                  ))}
                  {viewMode === "grid" && page === result.totalPages && (
                    <ScrollStaggerItem>
                      <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl p-7 text-white shadow-lg" style={{ background: "var(--gradient-dark)" }}>
                        <div aria-hidden className="absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-60 blur-2xl" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.7), transparent 70%)" }} />
                        <div className="relative">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <Icon name="briefcase" className="h-6 w-6" />
                          </span>
                          <p className="font-display mt-5 text-2xl font-extrabold leading-snug">Are you a professional?</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/70">Register free, get verified and be found by families looking for trusted help. Keep 100% of your earnings.</p>
                        </div>
                        <Link href="/register-provider" className="btn relative mt-6 w-full bg-white font-bold" style={{ color: "var(--primary-dark)" }}>
                          Register as Provider <Icon name="arrow-right" className="h-4 w-4" />
                        </Link>
                      </div>
                    </ScrollStaggerItem>
                  )}
                </ScrollStagger>

                {/* Pagination Controls */}
                {result.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <button
                        type="button"
                        onClick={() => updateParams({ page: String(page - 1) })}
                        className="btn btn-secondary btn-sm text-xs"
                      >
                        <Icon name="chevron-left" className="h-4 w-4" /> Prev
                      </button>
                    )}
                    {Array.from({ length: result.totalPages }).map((_, i) => {
                      const p = i + 1;
                      const isCurrent = p === page;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateParams({ page: String(p) })}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                            isCurrent
                              ? "bg-[var(--primary)] text-white shadow-sm"
                              : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {page < result.totalPages && (
                      <button
                        type="button"
                        onClick={() => updateParams({ page: String(page + 1) })}
                        className="btn btn-secondary btn-sm text-xs"
                      >
                        Next <Icon name="chevron-right" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide-in Drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between pb-3 border-b border-[var(--line-light)]">
                <div>
                  <h3 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                    Filter Candidates
                  </h3>
                  <p className="text-xs text-[var(--muted)]">Narrow down verified professionals</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilters(false)}
                  className="rounded-full p-2 bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  <Icon name="x" className="h-4 w-4" />
                </button>
              </div>

              <FilterPanel {...filterProps} />

              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="btn btn-primary mt-6 w-full font-bold"
              >
                View {result.total} Candidates
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProviderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProvidersContent />
    </Suspense>
  );
}
