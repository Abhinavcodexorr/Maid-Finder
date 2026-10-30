"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ServiceGlyph } from "@/components/ui/service-glyph";
import { getCategoryById, getCachedFavouriteIds, toggleFavouriteCached } from "@/lib/services";
import { maskProvider } from "@/lib/services/providers";
import { ProviderVideo } from "@/components/ui/provider-video";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";
import { formatDistance } from "@/lib/geo";
import { colorForCategory } from "@/lib/category-colors";
import { TiltCard } from "@/components/ui/tilt-card";
import type { Provider } from "@/types/marketplace";

const AVAILABILITY_LABEL: Record<Provider["availabilityType"], string> = {
  "full-time": "Full time",
  "part-time": "Part time",
  "live-in": "Live-in",
  "one-time": "One-time",
};


export function ProviderCard({
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

  const fullName = `${provider.firstName} ${provider.lastName}`.trim().replace(/\b\w/g, (c) => c.toUpperCase());
  const catColor = colorForCategory(provider.categoryId);

  if (viewMode === "list") {
    return (
      <Link
        href={`/providers/${provider.id}`}
        className="card card-hover group flex flex-col sm:flex-row gap-5 overflow-hidden p-5 transition-all"
      >
        <div className="relative h-44 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-[var(--line-light)]">
          {provider.photo && !imgLoaded && !imgFailed && (
            <div className="absolute inset-0 shimmer z-0" />
          )}
          {provider.photo && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.photo}
              alt={fullName}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : provider.introVideoUrl ? (
            <ProviderVideo src={provider.introVideoUrl} size="sm" className="h-full w-full" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
              style={{ background: catColor.gradient }}
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

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold group-hover:text-[var(--primary)]" style={{ color: "var(--ink)" }}>
                    {fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--primary)] font-semibold">
                    <ServiceGlyph name={cat?.name ?? ""} className="h-3.5 w-3.5" /> {cat?.name}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                  {typeof provider.rating === "number" && (
                    <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                      <Icon name="star" className="h-3.5 w-3.5 text-amber-500" />
                      {provider.rating.toFixed(1)}
                    </span>
                  )}
                  <span>{provider.experienceYears} years exp.</span>
                  <span className="flex items-center gap-1">
                    <Icon name="map-pin" className="h-3.5 w-3.5 text-[var(--muted)]" />
                    {provider.area}, {provider.city}
                    {provider.distanceKm !== undefined && <span className="font-semibold text-[var(--primary)]"> · {formatDistance(provider.distanceKm)}</span>}
                  </span>
                  <span className="capitalize font-medium text-[var(--ink-secondary)]">
                    {provider.availabilityType}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleSave}
                aria-label={saved ? "Remove from saved" : "Save professional"}
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
                <motion.button
                  type="button"
                  onClick={onUnlock}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn btn-primary btn-sm text-xs"
                >
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Unlock Contact
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid Card View (Default) — photo with chips, one-line summary, city, salary and a pill button.
  const summary = [AVAILABILITY_LABEL[provider.availabilityType], provider.experienceYears ? `${provider.experienceYears} yrs` : "New"].join(" · ");

  return (
    <TiltCard className="h-full" maxTilt={5}>
      <Link
        href={`/providers/${provider.id}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-white transition-shadow duration-300 hover:shadow-xl"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface-muted)]">
          {provider.photo && !imgLoaded && !imgFailed && <div className="shimmer absolute inset-0 z-0" />}
          {provider.photo && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.photo}
              alt={fullName}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgFailed(true)}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          ) : provider.introVideoUrl ? (
            <ProviderVideo src={provider.introVideoUrl} className="h-full w-full" />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center" style={{ background: catColor.gradient }}>
              <span aria-hidden className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
              <span aria-hidden className="absolute -bottom-10 -right-6 h-44 w-44 rounded-full bg-white/10" />
              <ServiceGlyph name={cat?.name ?? ""} className="absolute bottom-3 right-3 h-20 w-20 text-white/15" />
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-3xl font-extrabold text-white shadow-xl backdrop-blur">
                {provider.firstName[0]}{provider.lastName[0]}
              </span>
            </div>
          )}

          <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold shadow-sm" style={{ color: "var(--ink-light)" }}>
            <ServiceGlyph name={cat?.name ?? ""} className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{cat?.name ?? "Professional"}</span>
          </span>
          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            {provider.verified ? (
              <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-sm" style={{ color: "var(--success)" }}>
                <Icon name="check-circle" className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onToggleSave}
              aria-label={saved ? "Remove from saved" : "Save professional"}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md transition-transform active:scale-90 ${
                saved ? "bg-white text-[var(--error)]" : "bg-white/95 text-[var(--muted)] hover:text-[var(--error)]"
              }`}
            >
              <Icon name={saved ? "heart-filled" : "heart"} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-extrabold leading-tight" style={{ color: "var(--ink)" }}>{fullName}</h3>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{summary}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--muted)]">
            <Icon name="map-pin" className="h-3.5 w-3.5 shrink-0 text-[var(--faint)]" />
            {provider.area}
            {provider.distanceKm !== undefined && <span className="font-semibold text-[var(--primary)]"> · {formatDistance(provider.distanceKm)}</span>}
          </p>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="rounded-lg bg-[var(--line-light)] px-3 py-1.5 text-sm font-bold">
              {isSubscribed ? (
                <>₹{provider.price.toLocaleString("en-IN")} <span className="text-[11px] font-medium text-[var(--muted)]">{provider.priceUnit}</span></>
              ) : (
                <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-[var(--primary)]">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Salary protected
                </span>
              )}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[var(--ink-light)]">
              <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              Ready now
            </span>
          </div>

          {isSubscribed ? (
            <span className="btn btn-primary mt-5 w-full">View contact</span>
          ) : (
            <motion.button type="button" onClick={onUnlock} whileTap={{ scale: 0.97 }} className="btn btn-primary mt-5 w-full">
              <Icon name="lock" className="h-3.5 w-3.5" />
              Unlock contact
            </motion.button>
          )}
        </div>
      </Link>
    </TiltCard>
  );
}

export { ProviderCardSkeleton } from "@/components/ui/shimmer";
