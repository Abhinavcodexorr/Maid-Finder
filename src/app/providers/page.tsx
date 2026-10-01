"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCategories,
  getDistinctAreas,
  getDistinctCities,
  getDistinctLanguages,
  getSkillsForCategory,
  getProviders,
  isSaved,
  toggleSaved,
} from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { getCategoryById } from "@/lib/services/categories";
import { maskProvider } from "@/lib/services/providers";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";
import { ProviderCardSkeleton } from "@/components/ui/shimmer";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from "@/components/ui/scroll-reveal";
import type { AvailabilityType, Gender, Provider, ProviderFilters } from "@/types/marketplace";

const CATEGORY_EMOJIS: Record<string, string> = {
  "cat-cook": "🍳",
  "cat-maid": "🧹",
  "cat-plumber": "🔧",
  "cat-electrician": "⚡",
  "cat-carpenter": "🪚",
  "cat-driver": "🚗",
  "cat-babysitter": "👶",
  "cat-elderly-care": "👵",
  "cat-painter": "🎨",
};

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
   PROVIDER CARD COMPONENT
   ================================================================ */
function ProviderCard({
  provider,
  viewMode = "grid",
}: {
  provider: Provider;
  viewMode?: "grid" | "list";
}) {
  const router = useRouter();
  const { user, isSubscribed } = useAuth();
  const cat = getCategoryById(provider.categoryId);
  const masked = maskProvider(provider, isSubscribed);
  const [imgFailed, setImgFailed] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setSaved(isSaved(user.id, provider.id));
    }
  }, [user, provider.id]);

  const onToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/providers/${provider.id}`)}`);
      return;
    }
    const next = toggleSaved(user.id, provider.id);
    setSaved(next);
    toast({
      title: next ? "Helper Saved" : "Helper Removed",
      description: next
        ? `${provider.firstName} ${provider.lastName} added to your shortlist.`
        : `${provider.firstName} ${provider.lastName} removed from your shortlist.`,
      variant: next ? "success" : "info",
    });
  };

  const onUnlock = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const redir = `/providers/${provider.id}`;
    router.push(user ? `/membership?redirect=${encodeURIComponent(redir)}` : `/login?redirect=${encodeURIComponent(redir)}`);
  };

  const emoji = CATEGORY_EMOJIS[provider.categoryId] ?? "🧹";
  const fullName = `${provider.firstName} ${provider.lastName}`;

  if (viewMode === "list") {
    return (
      <Link
        href={`/providers/${provider.id}`}
        className="card card-hover group flex flex-col sm:flex-row gap-5 overflow-hidden p-5 transition-all"
      >
        {/* Photo Container */}
        <div className="relative h-44 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-[var(--line-light)]">
          {provider.photo && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.photo}
              alt={fullName}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              {provider.firstName[0]}{provider.lastName[0]}
            </div>
          )}

          {provider.verified && (
            <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[var(--primary)] shadow-sm backdrop-blur-sm">
              <Icon name="check-circle" className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold group-hover:text-[var(--primary)]" style={{ color: "var(--ink)" }}>
                    {fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)] font-semibold">
                    {emoji} {cat?.name}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                    <Icon name="star" className="h-3.5 w-3.5 text-amber-500" />
                    {provider.rating.toFixed(1)}
                  </span>
                  <span>{provider.experienceYears} years exp.</span>
                  <span className="flex items-center gap-1">
                    <Icon name="map-pin" className="h-3.5 w-3.5 text-[var(--muted)]" />
                    {provider.area}, {provider.city}
                  </span>
                  <span className="capitalize font-medium text-[var(--ink-secondary)]">
                    {provider.availabilityType}
                  </span>
                </div>
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={onToggleSave}
                aria-label={saved ? "Remove from saved" : "Save helper"}
                className={`rounded-xl p-2 transition-colors ${
                  saved
                    ? "bg-[var(--error-soft)] text-[var(--error)]"
                    : "bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--error)]"
                }`}
              >
                <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs line-clamp-2 text-[var(--muted)] leading-relaxed">
              {provider.about}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {provider.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink-secondary)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--line-light)] pt-3">
            <div>
              {isSubscribed ? (
                <div>
                  <span className="font-display text-base font-bold" style={{ color: "var(--ink)" }}>
                    ₹{provider.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[var(--muted)]"> {provider.priceUnit}</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--locked)]">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Salary Protected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSubscribed ? (
                <span className="btn btn-primary btn-sm text-xs">
                  View Contact Number
                </span>
              ) : (
                <button type="button" onClick={onUnlock} className="btn btn-primary btn-sm text-xs">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Unlock Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid Card View (Default)
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="card card-hover group flex flex-col overflow-hidden p-0 transition-all hover:shadow-md"
    >
      {/* Photo Header */}
      <div className="relative h-52 w-full overflow-hidden bg-[var(--surface-muted)]">
        {provider.photo && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={provider.photo}
            alt={fullName}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            {provider.firstName[0]}{provider.lastName[0]}
          </div>
        )}

        {/* Gradient Scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--success)] shadow-sm backdrop-blur-sm pointer-events-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            Available Now
          </span>

          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Remove from saved" : "Save helper"}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-transform active:scale-90 ${
              saved
                ? "bg-white text-[var(--error)]"
                : "bg-black/30 text-white hover:bg-white hover:text-[var(--error)]"
            }`}
          >
            <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom overlay text on photo */}
        <div className="absolute bottom-3 inset-x-3 pointer-events-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold leading-tight drop-shadow-sm">
                {fullName}
              </h3>
              <p className="text-xs text-white/90 drop-shadow-sm font-medium">
                {emoji} {cat?.name}
              </p>
            </div>

            {provider.verified && (
              <span
                title="Identity & Police Verified"
                className="flex items-center gap-1 rounded-md bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
              >
                <Icon name="check-circle" className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div>
          {/* Key Details Bar */}
          <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
              <Icon name="star" className="h-3.5 w-3.5 text-amber-500" />
              {provider.rating.toFixed(1)}
            </span>
            <span>{provider.experienceYears} yrs experience</span>
            <span className="flex items-center gap-1">
              <Icon name="map-pin" className="h-3 w-3 text-[var(--muted)]" />
              {provider.area}
            </span>
          </div>

          {/* Bio snippet */}
          <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)] leading-relaxed">
            {provider.about}
          </p>

          {/* Skill chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--ink-secondary)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Contact Footer */}
        <div className="border-t border-[var(--line-light)] pt-3 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              {isSubscribed ? (
                <div>
                  <span className="font-display text-base font-bold" style={{ color: "var(--ink)" }}>
                    ₹{provider.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]"> {provider.priceUnit}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-semibold text-[var(--locked)]">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  <span>Salary Protected</span>
                </div>
              )}
            </div>

            {isSubscribed ? (
              <span className="btn btn-primary btn-sm text-xs font-semibold">
                View Contact
              </span>
            ) : (
              <button
                type="button"
                onClick={onUnlock}
                className="btn btn-primary btn-sm text-xs font-semibold"
              >
                <Icon name="lock" className="h-3 w-3" />
                Unlock
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
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
    <div className="space-y-6">
      {/* Service Categories */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Service</p>
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
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {categories.map((c) => {
            const checked = categoryIds.includes(c.id) || categoryIds.includes(c.slug);
            const emoji = CATEGORY_EMOJIS[c.id] ?? "🧹";
            return (
              <label
                key={c.id}
                className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                  checked ? "bg-[var(--primary-soft)] text-[var(--primary)] font-semibold" : "hover:bg-[var(--surface-muted)] text-[var(--ink)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCsv("category", c.id, categoryIds)}
                  className="rounded accent-[var(--primary)] cursor-pointer"
                />
                <span>{emoji} {c.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Specific Skills if single category selected */}
      {availableSkills.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Skills & Speciality</p>
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
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Location / City</p>
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

      {/* Working Arrangement */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Work Schedule</p>
        <select
          className="field text-xs"
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
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Experience</p>
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
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Gender Preference</p>
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
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Languages Spoken</p>
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
  const categories = useMemo(() => getCategories(), []);
  const areas = useMemo(() => getDistinctAreas(), []);
  const cities = useMemo(() => getDistinctCities(), []);
  const languages = useMemo(() => getDistinctLanguages(), []);

  const [loading, setLoading] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Search parameters
  const categoryIds = csv(searchParams.get("category"));
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

  // Suggested candidates in case of 0 results
  const suggested = useMemo(() => {
    if (result.total > 0) return [];
    return getProviders({ pageSize: 6, sort: "rating" }).items;
  }, [result.total]);

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
      <section className="border-b border-[var(--line)] bg-white py-8">
        <div className="container-page space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-soft)] px-3 py-0.5 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <Icon name="check-circle" className="h-3.5 w-3.5" /> 100% Pre-Screened Talent
              </span>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl mt-2" style={{ color: "var(--ink)" }}>
                Find Domestic Help Across India
              </h1>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                Connect directly with verified housemaids, cooks, babysitters, and home helpers across all Indian cities with 0% commission.
              </p>
            </div>

            {/* Quick Live Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full md:w-auto md:min-w-[340px] items-center rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-1.5 shadow-sm transition-all focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)] focus-within:bg-white"
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Icon name="search" className="h-4 w-4 text-[var(--muted)] shrink-0" />
                <input
                  type="text"
                  placeholder="Search maid, cook, skill..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted)] border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-xl px-4 text-xs font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Category Tabs Bar */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pt-1 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                categoryIds.length === 0
                  ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                  : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
              }`}
            >
              🌟 All Helpers ({getProviders().total})
            </button>
            {categories.map((c) => {
              const active = categoryIds.includes(c.id) || categoryIds.includes(c.slug);
              const emoji = CATEGORY_EMOJIS[c.id] ?? "🧹";
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateParams({ category: active ? null : c.id })}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                      : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{c.name}</span>
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
                <div className="flex items-center gap-2">
                  <Icon name="filter" className="h-4 w-4 text-[var(--primary)]" />
                  <span className="font-display text-sm font-bold" style={{ color: "var(--ink)" }}>
                    Filter Candidates
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
            <div className="mb-5 hidden items-center justify-between rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:flex">
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Showing <span className="text-[var(--primary)] font-bold">{result.total}</span> verified candidates
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
                  {SORT_OPTIONS.map((o) => (
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
                    We couldn&apos;t find any professionals matching all selected filters. Try broadening your location or service requirements.
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
                  <p className="text-xs text-[var(--muted)]">Narrow down verified domestic helpers</p>
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
