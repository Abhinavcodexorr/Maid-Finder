"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCategoryById, isSaved, toggleSaved } from "@/lib/services";
import { maskProvider } from "@/lib/services/providers";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";
import type { Provider } from "@/types/marketplace";

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
        <div className="relative h-44 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-[var(--line-light)]">
          {!imgLoaded && !imgFailed && (
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
      <div className="relative h-52 w-full overflow-hidden bg-[var(--surface-muted)]">
        {!imgLoaded && !imgFailed && (
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
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            {provider.firstName[0]}{provider.lastName[0]}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

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

      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div>
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

          <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)] leading-relaxed">
            {provider.about}
          </p>

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

export { ProviderCardSkeleton } from "@/components/ui/shimmer";
