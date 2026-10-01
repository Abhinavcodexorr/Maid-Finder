"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCategories,
  getDistinctAreas,
  getDistinctCities,
  getDistinctLanguages,
  getSkillsForCategory,
  getProviders,
} from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { ProviderCard, ProviderCardSkeleton } from "@/components/marketplace/provider-card";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import type { AvailabilityType, Gender, ProviderFilters } from "@/types/marketplace";

const EXPERIENCE_OPTIONS: { id: NonNullable<ProviderFilters["experience"]>; label: string }[] = [
  { id: "0-1", label: "0 – 1 years" },
  { id: "1-3", label: "1 – 3 years" },
  { id: "3-5", label: "3 – 5 years" },
  { id: "5+", label: "5+ years" },
];

const AVAILABILITY_OPTIONS: { id: AvailabilityType; label: string }[] = [
  { id: "full-time", label: "Full-time (8-10h)" },
  { id: "part-time", label: "Part-time (2-4h)" },
  { id: "live-in", label: "Live-in (24h)" },
  { id: "one-time", label: "One-time" },
];

const SORT_OPTIONS: { id: NonNullable<ProviderFilters["sort"]>; label: string }[] = [
  { id: "rating", label: "Highest Rated" },
  { id: "experience", label: "Most Experienced" },
  { id: "newest", label: "Recently Added" },
  { id: "price-asc", label: "Salary: Low to High" },
  { id: "price-desc", label: "Salary: High to Low" },
];

function csv(param: string | null): string[] {
  return param ? param.split(",").filter(Boolean) : [];
}

export function BrowseProviders({
  lockedCategoryId,
  title,
  subtitle,
}: {
  lockedCategoryId?: string;
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categories = useMemo(() => getCategories(), []);
  const areas = useMemo(() => getDistinctAreas(), []);
  const cities = useMemo(() => getDistinctCities(), []);
  const languages = useMemo(() => getDistinctLanguages(), []);

  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryIds = lockedCategoryId ? [lockedCategoryId] : csv(searchParams.get("category"));
  const area = searchParams.get("area") ?? "";
  const experience = (searchParams.get("experience") as ProviderFilters["experience"]) ?? undefined;
  const availabilityType = (searchParams.get("availability") as AvailabilityType) ?? undefined;
  const gender = (searchParams.get("gender") as Gender) ?? undefined;
  const selectedLanguages = csv(searchParams.get("languages"));
  const selectedSkills = csv(searchParams.get("skills"));
  const verifiedOnly = searchParams.get("verified") === "1";
  const sort = (searchParams.get("sort") as ProviderFilters["sort"]) ?? "rating";
  const page = Number(searchParams.get("page") ?? "1");
  const q = searchParams.get("q") ?? "";

  const availableSkills = useMemo(() => {
    if (categoryIds.length !== 1) return [];
    return getSkillsForCategory(categoryIds[0]);
  }, [categoryIds]);

  const result = useMemo(
    () =>
      getProviders({
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
    [q, categoryIds, area, experience, availabilityType, gender, selectedLanguages, selectedSkills, verifiedOnly, sort, page]
  );

  const updateParams = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    });
    if (!("page" in patch)) params.delete("page");
    setLoading(true);
    router.push(`${pathname}?${params.toString()}`);
    setTimeout(() => setLoading(false), 200);
  };

  const toggleCsvParam = (key: string, value: string, current: string[]) => {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(",") : null });
  };

  const activeFilterCount =
    (q ? 1 : 0) +
    (area ? 1 : 0) +
    (experience ? 1 : 0) +
    (availabilityType ? 1 : 0) +
    (gender ? 1 : 0) +
    selectedLanguages.length +
    selectedSkills.length +
    (verifiedOnly ? 1 : 0) +
    (!lockedCategoryId ? categoryIds.length : 0);

  const clearAll = () => {
    router.push(pathname);
  };

  // Filter chips
  const chips: { label: string; onClear: () => void }[] = [];
  if (!lockedCategoryId) {
    categoryIds.forEach((id) => {
      const c = categories.find((cat) => cat.id === id || cat.slug === id);
      if (c) chips.push({ label: c.name, onClear: () => toggleCsvParam("category", id, categoryIds) });
    });
  }
  if (area) chips.push({ label: area, onClear: () => updateParams({ area: null }) });
  if (experience) chips.push({ label: `${experience} yrs exp`, onClear: () => updateParams({ experience: null }) });
  if (availabilityType) chips.push({ label: availabilityType, onClear: () => updateParams({ availability: null }) });
  if (gender) chips.push({ label: gender, onClear: () => updateParams({ gender: null }) });
  if (verifiedOnly) chips.push({ label: "Verified Only", onClear: () => updateParams({ verified: null }) });
  selectedSkills.forEach((sk) => {
    chips.push({ label: sk, onClear: () => toggleCsvParam("skills", sk, selectedSkills) });
  });

  const filtersPanel = (
    <div className="space-y-6">
      {!lockedCategoryId && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Service</p>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-[var(--surface-muted)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={categoryIds.includes(c.id) || categoryIds.includes(c.slug)}
                  onChange={() => toggleCsvParam("category", c.id, categoryIds)}
                  className="rounded accent-[var(--primary)] cursor-pointer"
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {availableSkills.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Specialties</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSkills.map((sk) => {
              const active = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleCsvParam("skills", sk, selectedSkills)}
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

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Location</p>
        <select
          className="field text-xs"
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

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Schedule</p>
        <select
          className="field text-xs"
          value={availabilityType ?? ""}
          onChange={(e) => updateParams({ availability: e.target.value || null })}
        >
          <option value="">Any Schedule</option>
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Experience</p>
        <div className="space-y-1.5">
          {EXPERIENCE_OPTIONS.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="experience_browse"
                checked={experience === o.id}
                onChange={() => updateParams({ experience: o.id })}
                className="accent-[var(--primary)]"
              />
              <span>{o.label}</span>
            </label>
          ))}
          {experience && (
            <button
              type="button"
              onClick={() => updateParams({ experience: null })}
              className="text-[11px] font-semibold text-[var(--primary)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Gender</p>
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

      <label className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] p-3 text-xs font-semibold cursor-pointer bg-[var(--surface-muted)]/50">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => updateParams({ verified: e.target.checked ? "1" : null })}
          className="h-4 w-4 rounded accent-[var(--primary)]"
        />
        <div className="flex items-center gap-1.5">
          <Icon name="check-circle" className="h-4 w-4 text-[var(--primary)]" />
          <span>Verified Only</span>
        </div>
      </label>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Languages</p>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => {
            const active = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleCsvParam("languages", lang, selectedLanguages)}
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

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-outline w-full text-xs font-semibold"
        >
          Reset All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--surface-muted)] pb-16">
      {/* Category Header */}
      <section className="border-b border-[var(--line)] bg-white py-8">
        <div className="container-page">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <Link href="/services" className="hover:text-[var(--primary)] font-medium">
              Services Directory
            </Link>
            <span>/</span>
            <span className="font-semibold text-[var(--ink)]">{title}</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold sm:text-4xl" style={{ color: "var(--ink)" }}>
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            <Link href="/membership" className="btn btn-primary btn-sm text-xs shrink-0">
              <Icon name="award" className="h-3.5 w-3.5" />
              Membership Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Active Filter Chips */}
      {chips.length > 0 && (
        <div className="container-page flex flex-wrap items-center gap-2 py-3">
          <span className="text-xs font-semibold text-[var(--muted)]">Active:</span>
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

      {/* Main Grid */}
      <div className="container-page pt-4">
        {/* Mobile Filter Button */}
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="btn btn-secondary flex flex-1 items-center justify-center gap-2 text-xs font-semibold"
          >
            <Icon name="filter" className="h-4 w-4" /> Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>

          <select
            className="field w-auto text-xs"
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line-light)] mb-4">
                <span className="font-display text-sm font-bold" style={{ color: "var(--ink)" }}>
                  Filter Candidates
                </span>
                {activeFilterCount > 0 && (
                  <span className="pill pill-primary text-[10px] font-bold">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {filtersPanel}
            </div>
          </aside>

          {/* Results Column */}
          <div>
            {/* Top Toolbar */}
            <div className="mb-5 hidden items-center justify-between rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:flex">
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Showing <span className="text-[var(--primary)] font-bold">{result.total}</span> candidates
              </p>

              <div className="flex items-center gap-4">
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

                <select
                  className="field w-auto text-xs py-1.5"
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
              <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)]">
                  <Icon name="search" className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold" style={{ color: "var(--ink)" }}>
                  No candidates match these filters
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
                  Try clearing filters or checking other cities across India.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="btn btn-primary text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                  <Link href="/services" className="btn btn-secondary text-xs">
                    View All Services
                  </Link>
                </div>
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
                </ScrollStagger>

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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between pb-3 border-b border-[var(--line-light)]">
                <h3 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                  Filter Candidates
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 bg-[var(--surface-muted)] text-[var(--muted)]"
                >
                  <Icon name="x" className="h-4 w-4" />
                </button>
              </div>

              {filtersPanel}

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
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
