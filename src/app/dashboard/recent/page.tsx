"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getRecentlyViewed, getCategories } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function RecentlyViewedPage() {
  const { user, isSubscribed } = useAuth();
  const categories = useMemo(() => getCategories(), []);

  const recentList = useMemo(() => {
    if (!user) return [];
    return getRecentlyViewed(user.id, 20);
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
            Recently Viewed Profiles ({recentList.length})
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Profiles you looked at recently across web and mobile.
          </p>
        </div>

        <Link href="/providers" className="btn btn-secondary shrink-0">
          <Icon name="search" className="h-4 w-4" />
          Find More Candidates
        </Link>
      </div>

      {recentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white py-16 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--muted)] mb-4">
            <Icon name="clock" className="h-8 w-8" />
          </div>
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
            No browsing history yet
          </h2>
          <p className="mt-1 text-sm max-w-sm" style={{ color: "var(--muted)" }}>
            Whenever you inspect a helper profile, it will be automatically recorded here for quick reference.
          </p>
          <Link href="/providers" className="btn btn-primary mt-6">
            <Icon name="search" className="h-4 w-4" />
            Explore Verified Directory
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--line-light)] rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
          {recentList.map((item) => {
            const fullName = `${item.firstName} ${item.lastName}`;
            const cat = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={`${item.id}-${item.viewedAt}`}
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-[var(--surface-muted)]/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar
                    initials={`${item.firstName[0]}${item.lastName[0]}`}
                    imageUrl={item.photo}
                    className="h-12 w-12 text-sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/providers/${item.id}`}
                        className="font-display text-base font-bold hover:text-[var(--primary)] truncate"
                        style={{ color: "var(--ink)" }}
                      >
                        {fullName}
                      </Link>
                      {item.verified && (
                        <span title="Verified" className="text-[var(--primary)]">
                          <Icon name="check-circle" className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {cat?.name ?? "Professional"} • {item.city} • {item.experienceYears} yrs exp.
                    </p>
                    <p className="mt-1 text-[11px] font-medium" style={{ color: "var(--faint)" }}>
                      Viewed {formatRelativeTime(item.viewedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSubscribed ? (
                    <>
                      <a
                        href={`tel:${item.phone}`}
                        className="btn btn-primary btn-sm text-xs"
                      >
                        <Icon name="phone" className="h-3.5 w-3.5" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm text-xs text-white"
                        style={{ background: "#25D366" }}
                      >
                        <Icon name="whatsapp" className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </>
                  ) : (
                    <Link
                      href={`/membership?redirect=${encodeURIComponent(`/providers/${item.id}`)}`}
                      className="btn btn-primary btn-sm text-xs"
                    >
                      <Icon name="lock" className="h-3.5 w-3.5" />
                      Unlock Contact
                    </Link>
                  )}
                  <Link
                    href={`/providers/${item.id}`}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
