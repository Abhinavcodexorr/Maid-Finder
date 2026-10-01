"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSavedProviders, getRecentlyViewed, getCategories } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";

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

export default function DashboardOverviewPage() {
  const { user, isSubscribed, subscription, daysRemaining } = useAuth();

  const categories = useMemo(() => getCategories(), []);

  const savedProviders = useMemo(() => {
    if (!user) return [];
    return getSavedProviders(user.id);
  }, [user]);

  const recentProviders = useMemo(() => {
    if (!user) return [];
    return getRecentlyViewed(user.id, 4);
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Welcome & Status Banner */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--ink)" }}>
                Welcome back, {user.firstName}!
              </h1>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Manage your saved domestic helpers, track inquiries, and discover verified talent across India.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link href="/providers" className="btn btn-primary">
              <Icon name="search" className="h-4 w-4" />
              Find Helpers
            </Link>
          </div>
        </div>

        {/* Membership Banner */}
        <div
          className="mt-6 rounded-2xl p-5 border"
          style={
            isSubscribed
              ? {
                  backgroundColor: "var(--success-soft)",
                  borderColor: "rgba(16, 185, 129, 0.2)",
                }
              : {
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(14, 165, 233, 0.08) 100%)",
                  borderColor: "var(--primary-soft)",
                }
          }
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isSubscribed ? "var(--success)" : "var(--primary)",
                  color: "#fff",
                }}
              >
                <Icon name={isSubscribed ? "check-circle" : "unlock"} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--ink)" }}>
                  {isSubscribed
                    ? `${subscription?.planName} Membership Active`
                    : "Unlock Direct Phone Numbers & WhatsApp"}
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                  {isSubscribed
                    ? `You have ${daysRemaining} days remaining of full contact access to all verified helpers.`
                    : "Free members can preview profiles. Subscribe to contact candidates directly with 0% brokerage."}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {isSubscribed ? (
                <Link href="/dashboard/membership" className="btn btn-secondary btn-sm text-xs">
                  Manage Plan
                </Link>
              ) : (
                <Link href="/membership" className="btn btn-primary btn-sm text-xs">
                  Upgrade for ₹499
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>Membership</span>
            <Icon name="award" className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </div>
          <div className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: "var(--ink)" }}>
            {isSubscribed ? "Active" : "Free"}
          </div>
          <p className="mt-1 text-[11px]" style={{ color: isSubscribed ? "var(--success)" : "var(--muted)" }}>
            {isSubscribed ? `${daysRemaining} days left` : "Basic browsing"}
          </p>
        </div>

        <Link
          href="/dashboard/saved"
          className="group rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm transition-all hover:border-[var(--primary)] sm:p-5"
        >
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>Saved Helpers</span>
            <Icon name="heart" className="h-4 w-4 transition-colors group-hover:text-[var(--error)]" />
          </div>
          <div className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: "var(--ink)" }}>
            {savedProviders.length}
          </div>
          <p className="mt-1 text-[11px] text-[var(--primary)] group-hover:underline">
            View saved list →
          </p>
        </Link>

        <Link
          href="/dashboard/recent"
          className="group rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm transition-all hover:border-[var(--primary)] sm:p-5"
        >
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>Recently Viewed</span>
            <Icon name="clock" className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </div>
          <div className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: "var(--ink)" }}>
            {recentProviders.length}
          </div>
          <p className="mt-1 text-[11px] text-[var(--primary)] group-hover:underline">
            View history →
          </p>
        </Link>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
            <span>Brokerage Saved</span>
            <Icon name="shield" className="h-4 w-4" style={{ color: "var(--success)" }} />
          </div>
          <div className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: "var(--success)" }}>
            ₹15,000+
          </div>
          <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
            Zero agency commission
          </p>
        </div>
      </div>

      {/* Quick Category Jump */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
            Search by Service
          </h2>
          <Link href="/providers" className="text-xs font-semibold text-[var(--primary)] hover:underline">
            View all categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {categories.map((cat) => {
            const emoji = CATEGORY_EMOJIS[cat.id] ?? "🧹";
            return (
              <Link
                key={cat.id}
                href={`/providers?category=${cat.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--line)] p-3 text-center transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/20"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">{emoji}</span>
                <span className="text-xs font-medium text-[var(--ink-secondary)] group-hover:text-[var(--ink)]">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Saved Helpers & Recently Viewed */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Saved Helpers Preview */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="heart" className="h-5 w-5" style={{ color: "var(--error)" }} />
              <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                Saved Helpers ({savedProviders.length})
              </h2>
            </div>
            <Link href="/dashboard/saved" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              See all
            </Link>
          </div>

          {savedProviders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--muted)] mb-3">
                <Icon name="heart" className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>No saved helpers yet</p>
              <p className="mt-1 text-xs max-w-xs" style={{ color: "var(--muted)" }}>
                Bookmark candidates while browsing to review their credentials later.
              </p>
              <Link href="/providers" className="btn btn-secondary btn-sm mt-4 text-xs">
                Browse Candidates
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProviders.slice(0, 3).map((provider) => {
                const cat = categories.find((c) => c.id === provider.categoryId);
                const fullName = `${provider.firstName} ${provider.lastName}`;
                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-3 transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                        imageUrl={provider.photo}
                        className="h-10 w-10 text-xs"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/providers/${provider.id}`}
                          className="truncate block text-sm font-semibold hover:text-[var(--primary)]"
                          style={{ color: "var(--ink)" }}
                        >
                          {fullName}
                        </Link>
                        <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                          {cat?.name ?? "Professional"} • {provider.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/providers/${provider.id}`}
                        className="btn btn-secondary btn-sm text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Viewed Helpers Preview */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon name="clock" className="h-5 w-5" style={{ color: "var(--primary)" }} />
              <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                Recently Viewed ({recentProviders.length})
              </h2>
            </div>
            <Link href="/dashboard/recent" className="text-xs font-semibold text-[var(--primary)] hover:underline">
              See all
            </Link>
          </div>

          {recentProviders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--muted)] mb-3">
                <Icon name="eye" className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>No profile history yet</p>
              <p className="mt-1 text-xs max-w-xs" style={{ color: "var(--muted)" }}>
                Start searching to view detailed helper bios, skillsets, and ratings.
              </p>
              <Link href="/providers" className="btn btn-secondary btn-sm mt-4 text-xs">
                Explore Directory
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProviders.slice(0, 3).map((provider) => {
                const cat = categories.find((c) => c.id === provider.categoryId);
                const fullName = `${provider.firstName} ${provider.lastName}`;
                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] p-3 transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        initials={`${provider.firstName[0]}${provider.lastName[0]}`}
                        imageUrl={provider.photo}
                        className="h-10 w-10 text-xs"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/providers/${provider.id}`}
                          className="truncate block text-sm font-semibold hover:text-[var(--primary)]"
                          style={{ color: "var(--ink)" }}
                        >
                          {fullName}
                        </Link>
                        <p className="truncate text-xs" style={{ color: "var(--muted)" }}>
                          {cat?.name ?? "Professional"} • ⭐ {provider.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/providers/${provider.id}`}
                        className="btn btn-secondary btn-sm text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Safety & Hiring Guide Banner */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold mb-4" style={{ color: "var(--ink)" }}>
          Direct Hiring Checklist & Safety Tips
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--line-light)] p-4 bg-[var(--surface-muted)]/50">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1.5" style={{ color: "var(--ink)" }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[11px] font-bold">1</span>
              Conduct a Video Call
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Verify communication skills, prior working habits, and schedule expectations before in-person trials.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line-light)] p-4 bg-[var(--surface-muted)]/50">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1.5" style={{ color: "var(--ink)" }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[11px] font-bold">2</span>
              Check Government ID
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Always request Aadhaar or voter card copies and keep domestic police verification forms handy.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line-light)] p-4 bg-[var(--surface-muted)]/50">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1.5" style={{ color: "var(--ink)" }}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[11px] font-bold">3</span>
              Paid 2-Day Trial
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Agree on daily trial wages to evaluate cooking taste, cleaning thoroughness, and punctuality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
