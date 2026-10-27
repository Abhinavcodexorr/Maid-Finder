"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { colorForCategory } from "@/lib/category-colors";
import { formatDistance } from "@/lib/geo";
import type { Provider } from "@/types/marketplace";

const AVAILABILITY_LABEL: Record<Provider["availabilityType"], string> = {
  "full-time": "Full time",
  "part-time": "Part time",
  "live-in": "Live-in",
  "one-time": "One-time",
};

/** Browse-style profile card: photo with chips, a one-line summary, city, salary and a "View profile" button. */
export function ProfileCard({ provider, serviceName }: { provider: Provider; serviceName: string }) {
  const { isSubscribed } = useAuth();
  const color = colorForCategory(provider.categoryId);
  const fullName = `${provider.firstName} ${provider.lastName ? `${provider.lastName[0]}.` : ""}`.trim();
  const summary = [AVAILABILITY_LABEL[provider.availabilityType], provider.experienceYears ? `${provider.experienceYears} yrs` : "New"].join(" · ");

  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: color.soft }}>
        <Avatar
          initials={`${provider.firstName[0]}${provider.lastName[0] ?? ""}`}
          imageUrl={provider.photo}
          color={color.color}
          soft={color.soft}
          rounded="rounded-none"
          ring={false}
          className="h-full w-full text-4xl transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold shadow-sm" style={{ color: "var(--ink-light)" }}>
          {serviceName}
        </span>
        {provider.verified && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold shadow-sm" style={{ color: "var(--success)" }}>
            <Icon name="check-circle" className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold">{fullName}</h3>
        <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>{summary}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
          <Icon name="map-pin" className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--faint)" }} />
          {provider.city || provider.area}
          {provider.distanceKm !== undefined && <span className="font-semibold" style={{ color: "var(--primary)" }}> · {formatDistance(provider.distanceKm)}</span>}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="rounded-lg px-3 py-1.5 text-sm font-bold" style={{ background: "var(--line-light)" }}>
            {isSubscribed ? `₹${provider.price.toLocaleString("en-IN")}` : (
              <span className="flex items-center gap-1.5 whitespace-nowrap text-xs" style={{ color: "var(--primary)" }}>
                <Icon name="lock" className="h-3.5 w-3.5" />
                Salary protected
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium" style={{ color: "var(--ink-light)" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} />
            Ready now
          </span>
        </div>

        <span className="btn btn-primary mt-5 w-full">View profile</span>
      </div>
    </Link>
  );
}
