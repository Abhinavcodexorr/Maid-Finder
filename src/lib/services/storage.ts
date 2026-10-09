// Thin localStorage wrapper shared by every service module. Centralizing it
// here means swapping the mock layer for real API calls later only touches
// the individual service files, never the pages that call them.

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export const STORAGE_KEYS = {
  users: "helpzone_mkt_users",
  session: "helpzone_mkt_session",
  subscriptions: "helpzone_mkt_subscriptions",
  payments: "helpzone_mkt_payments",
  saved: "helpzone_mkt_saved",
  contactViews: "helpzone_mkt_contact_views",
  resetFlow: "helpzone_mkt_reset_flow",
  providerApplications: "helpzone_mkt_provider_applications",
  providerSession: "helpzone_mkt_provider_session",
} as const;
