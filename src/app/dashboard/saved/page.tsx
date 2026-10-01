"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSavedProviders, toggleSaved, getCategories } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toaster";

const CATEGORY_EMOJIS: Record<string, string> = {
  "cat-cook": "🍳",
  "cat-maid": "🧹",
  "cat-plumber": "🔧",
  "cat-electrician": "⚡",
  "cat-carpenter": "🪚",
  "cat-driver": "🚗",
  "cat-babysitter": "👶",
  "cat-elderly-care": "👵",
};

export default function SavedHelpersPage() {
  const { user, isSubscribed } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tick, setTick] = useState(0);

  const categories = useMemo(() => getCategories(), []);

  const savedProviders = useMemo(() => {
    if (!user) return [];
    void tick; // depend on state updates
    return getSavedProviders(user.id);
  }, [user, tick]);

  const filteredProviders = useMemo(() => {
    if (selectedCategory === "all") return savedProviders;
    return savedProviders.filter((p) => p.categoryId === selectedCategory);
  }, [savedProviders, selectedCategory]);

  const handleRemove = (providerId: string, name: string) => {
    if (!user) return;
    toggleSaved(user.id, providerId);
    setTick((t) => t + 1);
    toast({
      title: "Removed from saved",
      description: `${name} has been removed from your saved list.`,
      variant: "info",
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
            Saved Helpers ({savedProviders.length})
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Shortlist and compare candidates you are interested in hiring.
          </p>
        </div>

        <Link href="/providers" className="btn btn-secondary shrink-0">
          <Icon name="search" className="h-4 w-4" />
          Browse More Helpers
        </Link>
      </div>

      {/* Category Filter Chips */}
      {savedProviders.length > 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
            }`}
          >
            All Services ({savedProviders.length})
          </button>
          {categories.map((cat) => {
            const count = savedProviders.filter((p) => p.categoryId === cat.id).length;
            if (count === 0) return null;
            const emoji = CATEGORY_EMOJIS[cat.id] ?? "🧹";
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "border border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                }`}
              >
                {emoji} {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Helper Grid or Empty State */}
      {filteredProviders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white py-16 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)] mb-4">
            <Icon name="heart" className="h-8 w-8" />
          </div>
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
            {savedProviders.length === 0 ? "You haven't saved any helpers yet" : "No helpers match this category"}
          </h2>
          <p className="mt-1 text-sm max-w-sm" style={{ color: "var(--muted)" }}>
            {savedProviders.length === 0
              ? "Browse through hundreds of verified housemaids, cooks, and babysitters and click the heart icon to save."
              : "Try switching to 'All Services' to view all your shortlisted candidates."}
          </p>
          <Link href="/providers" className="btn btn-primary mt-6">
            <Icon name="search" className="h-4 w-4" />
            Discover Verified Helpers
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredProviders.map((provider) => {
            const fullName = `${provider.firstName} ${provider.lastName}`;
            const cat = categories.find((c) => c.id === provider.categoryId);
            return (
              <div
                key={provider.id}
                className="card flex flex-col justify-between overflow-hidden p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar
                        initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                        imageUrl={provider.photo}
                        className="h-12 w-12 text-sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/providers/${provider.id}`}
                            className="font-display text-base font-bold hover:text-[var(--primary)]"
                            style={{ color: "var(--ink)" }}
                          >
                            {fullName}
                          </Link>
                          {provider.verified && (
                            <span title="Identity Verified" className="text-[var(--primary)]">
                              <Icon name="check-circle" className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                          {cat?.name ?? "Helper"} • {provider.experienceYears} yrs exp.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(provider.id, fullName)}
                      className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--error-soft)] hover:text-[var(--error)]"
                      title="Remove from saved"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs" style={{ color: "var(--ink-secondary)" }}>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1">
                      <Icon name="map-pin" className="h-3 w-3 text-[var(--muted)]" />
                      {provider.area}, {provider.city}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1 font-semibold text-[var(--primary)]">
                      ₹{provider.price.toLocaleString("en-IN")} {provider.priceUnit}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--surface-muted)] px-2 py-1">
                      ⭐ {provider.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {provider.about}
                  </p>
                </div>

                {/* Action Bar */}
                <div className="mt-5 border-t border-[var(--line-light)] pt-4">
                  <div className="flex items-center gap-2">
                    {isSubscribed ? (
                      <>
                        <a
                          href={`tel:${provider.phone}`}
                          className="btn btn-primary btn-sm flex-1 text-xs"
                        >
                          <Icon name="phone" className="h-3.5 w-3.5" />
                          Call Now
                        </a>
                        <a
                          href={`https://wa.me/${provider.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm flex-1 text-xs text-white"
                          style={{ background: "#25D366" }}
                        >
                          <Icon name="whatsapp" className="h-3.5 w-3.5" />
                          WhatsApp
                        </a>
                      </>
                    ) : (
                      <Link
                        href={`/membership?redirect=${encodeURIComponent(`/providers/${provider.id}`)}`}
                        className="btn btn-primary btn-sm flex-1 text-xs"
                      >
                        <Icon name="lock" className="h-3.5 w-3.5" />
                        Unlock Contact
                      </Link>
                    )}
                    <Link
                      href={`/providers/${provider.id}`}
                      className="btn btn-secondary btn-sm text-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
