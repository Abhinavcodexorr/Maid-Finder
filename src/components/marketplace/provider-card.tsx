"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ServiceGlyph } from "@/components/ui/service-glyph";
import { getCategoryById, getCachedFavouriteIds, toggleFavouriteCached } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";
import { formatDistance } from "@/lib/geo";
import { colorForCategory } from "@/lib/category-colors";
import type { Provider } from "@/types/marketplace";

const AVAILABILITY_LABEL: Record<Provider["availabilityType"], string> = {
  "full-time": "Full time",
  "part-time": "Part time",
  "live-in": "Live-in",
  "one-time": "Flexible",
};

const MAX_SKILLS = 4;

const titleCase = (value: string) => value.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase());

export function ProviderCard({
  provider,
  viewMode = "grid",
}: {
  provider: Provider;
  /** "grid" sits in a two-column grid, "list" spans the full row — same card either way. */
  viewMode?: "grid" | "list";
}) {
  const router = useRouter();
  const { user, isSubscribed } = useAuth();
  const cat = getCategoryById(provider.categoryId);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getCachedFavouriteIds()
      .then((ids) => { if (!cancelled) setSaved(ids.has(provider.id)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, provider.id]);

  const onToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/providers/${provider.id}`)}`);
      return;
    }
    try {
      const next = await toggleFavouriteCached(provider.id, saved);
      setSaved(next);
      toast({
        title: next ? "Professional Saved" : "Professional Removed",
        description: next
          ? `${provider.firstName} ${provider.lastName} added to your shortlist.`
          : `${provider.firstName} ${provider.lastName} removed from your shortlist.`,
        variant: next ? "success" : "info",
      });
    } catch (err) {
      toast({ title: "Couldn't update saved list", description: err instanceof Error ? err.message : undefined, variant: "error" });
    }
  };

  const onUnlock = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const redir = `/providers/${provider.id}`;
    router.push(user ? `/membership?redirect=${encodeURIComponent(redir)}` : `/login?redirect=${encodeURIComponent(redir)}`);
  };

  const fullName = titleCase(`${provider.firstName} ${provider.lastName}`.trim());
  const catColor = colorForCategory(provider.categoryId);
  const location = [provider.area, provider.city].filter((v, i, arr) => v && arr.indexOf(v) === i).join(", ");
  const stayLabel = (provider.stay ?? []).map((s) => (s === "live-in" ? "Live-in" : "Live-out")).join(" & ");
  const skills = provider.skills.length > 0 ? provider.skills : cat ? [cat.name] : [];

  // Only facts the profile actually has are listed — nothing is padded with placeholders.
  const facts = [
    { label: "Availability", value: AVAILABILITY_LABEL[provider.availabilityType] },
    provider.experienceYears > 0 ? { label: "Experience", value: `${provider.experienceYears} ${provider.experienceYears === 1 ? "yr" : "yrs"}` } : null,
    provider.age > 0 ? { label: "Age", value: String(provider.age) } : null,
    provider.education ? { label: "Education", value: provider.education } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <Link
      href={`/providers/${provider.id}`}
      className={`group flex h-full flex-col rounded-3xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${
        viewMode === "list" ? "lg:flex-row lg:gap-6" : ""
      }`}
      style={{ borderColor: "var(--line)" }}
    >
      <div className={`flex gap-4 ${viewMode === "list" ? "lg:w-[46%] lg:shrink-0" : ""}`}>
        {/* Photo */}
        <div className="relative h-[150px] w-[118px] shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-muted)] sm:h-[170px] sm:w-[136px]">
          {provider.photo && !imgLoaded && !imgFailed && <div className="shimmer absolute inset-0 z-0" />}
          {provider.photo && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.photo}
              alt={fullName}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
              className={`h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center" style={{ background: catColor.gradient }}>
              <ServiceGlyph name={cat?.name ?? ""} className="absolute bottom-2 right-2 h-14 w-14 text-white/15" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-xl font-extrabold text-white shadow-lg">
                {provider.firstName[0]}{provider.lastName[0]}
              </span>
            </div>
          )}

          {provider.introVideoUrl && (
            <span
              className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md"
              style={{ background: "var(--primary)" }}
              title="Has a video introduction"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            </span>
          )}
        </div>

        {/* Identity */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex min-w-0 items-center gap-1.5 font-display text-xl font-extrabold leading-tight sm:text-2xl" style={{ color: "var(--ink)" }}>
              <span className="truncate group-hover:text-[var(--primary)]">{fullName}</span>
              {provider.verified && <Icon name="check-circle" className="h-5 w-5 shrink-0" style={{ color: "var(--primary)" }} />}
            </h3>
            <button
              type="button"
              onClick={onToggleSave}
              aria-label={saved ? "Remove from saved" : "Save professional"}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-90 ${
                saved ? "text-[var(--error)]" : "text-[var(--muted)] hover:text-[var(--error)]"
              }`}
              style={{ borderColor: "var(--line)", background: saved ? "var(--error-soft)" : "white" }}
            >
              <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[13px] text-[var(--muted)]">
            <Icon name="map-pin" className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--primary)" }} />
            <span className="truncate">{location || "India"}</span>
            {provider.distanceKm !== undefined && <span className="font-semibold text-[var(--primary)]">· {formatDistance(provider.distanceKm)}</span>}
          </p>

          {cat?.name && (
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
              {cat.name}
              {stayLabel && <span style={{ color: "var(--ink-light)" }}> · {stayLabel}</span>}
            </p>
          )}

          <div className="mt-auto pt-3">
            {provider.price > 0 ? (
              <p className="font-display text-[28px] font-extrabold leading-none" style={{ color: "var(--ink)" }}>
                ₹{provider.price.toLocaleString("en-IN")}
                <span className="ml-1.5 text-[13px] font-medium text-[var(--muted)]">/ month</span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-[var(--muted)]">Salary on request</p>
            )}
          </div>
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${viewMode === "list" ? "lg:border-l lg:pl-6" : ""}`} style={{ borderColor: "var(--line-light)" }}>
        {/* Facts */}
        <dl className={`flex flex-wrap gap-x-9 gap-y-3 mt-5 border-t pt-4 ${viewMode === "list" ? "lg:mt-0 lg:border-t-0 lg:pt-0" : ""}`} style={{ borderColor: "var(--line-light)" }}>
          {facts.slice(0, 3).map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{f.label}</dt>
              <dd className="mt-1 text-[15px] font-semibold" style={{ color: "var(--ink)" }}>{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, MAX_SKILLS).map((s) => (
              <span key={s} className="rounded-full border px-4 py-1.5 text-[13px] font-medium" style={{ borderColor: "var(--line)", color: "var(--ink-light)" }}>
                {s}
              </span>
            ))}
            {skills.length > MAX_SKILLS && (
              <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: "var(--line)", color: "var(--primary)" }}>
                +{skills.length - MAX_SKILLS}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <span className="btn btn-outline !rounded-full !border-2 !py-3 !text-[15px]">View profile</span>
          {isSubscribed ? (
            <span className="btn btn-primary !rounded-full !py-3 !text-[15px]">View contact</span>
          ) : (
            <motion.button type="button" onClick={onUnlock} whileTap={{ scale: 0.97 }} className="btn btn-primary !rounded-full !py-3 !text-[15px]">
              <Icon name="lock" className="h-3.5 w-3.5" />
              Unlock contact
            </motion.button>
          )}
        </div>
      </div>
    </Link>
  );
}

export { ProviderCardSkeleton } from "@/components/ui/shimmer";
