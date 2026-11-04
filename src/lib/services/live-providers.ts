"use client";

// Bridges the real Help Zone API (Maid Finder BE, providers collection) into
// the frontend's existing `Provider` shape, so the listing pages that were
// built against mock data (src/data/providers.ts) can render real
// registrations with no further changes to their filter/sort/render logic.
//
// The live API has no rating/review system and no structured
// `availabilityType` enum — those are adapted/omitted rather than
// fabricated. See `mapApiProviderToProvider` for every mapping decision.

import { getCategoryById } from "./categories";
import { getCustomerToken } from "./live-customer-auth";
import type { AvailabilityType, Gender, Provider } from "@/types/marketplace";

/** The customer's token, so the server can tell a member (who may see contact numbers) from a visitor. */
function memberHeaders(): HeadersInit | undefined {
  const token = typeof window === "undefined" ? null : getCustomerToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

/** Shape returned by the live API for one provider document (trimmed to the fields we use). */
export interface ApiProvider {
  id?: string;
  _id?: string;
  email?: string;
  fullName?: string;
  gender?: "Male" | "Female";
  nationality?: string;
  categoryIds?: string[];
  area?: string;
  /** GeoJSON Point, [longitude, latitude]. */
  location?: { type?: string; coordinates?: number[] };
  city?: string;
  state?: string;
  emirate?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  experienceYears?: number;
  monthlySalary?: number;
  skills?: string[];
  imageUrl?: string;
  phone?: string;
  bio?: string;
  jobDescription?: string;
  age?: number;
  languages?: string[];
  duration?: string;
  education?: string;
  introVideoUrl?: string;
  lastWorkingExperience?: { jobTitle?: string; workingCity?: string; duration?: string; familySize?: string };
  applicationStatus?: "pending" | "approved" | "rejected";
  profileComplete?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

/**
 * Only providers who finished the complete-profile step, were approved by
 * review, and haven't been deactivated should ever reach a family's view —
 * a pending/rejected/incomplete/deactivated provider stays invisible on the
 * public site even though the backend returns it (it only excludes
 * hard-deactivated rows itself).
 */
function isPubliclyVisible(raw: ApiProvider): boolean {
  return raw.profileComplete === true && raw.applicationStatus === "approved" && raw.isActive !== false;
}

interface ListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: ApiProvider[];
}

interface OneResponse {
  success: boolean;
  data: ApiProvider;
}

function categoryName(id: string): string | undefined {
  return getCategoryById(id)?.name;
}

function mapAvailabilityType(duration?: string): AvailabilityType {
  const d = (duration || "").toLowerCase();
  if (d.includes("part")) return "part-time";
  if (d.includes("live")) return "live-in";
  if (d.includes("full")) return "full-time";
  return "one-time";
}

/** Some records hold a whole list as one JSON string (e.g. '["Cooking","Cleaning"]'); expand those. */
function flattenList(values?: string[]): string[] {
  return (values ?? []).flatMap((v) => {
    const t = typeof v === "string" ? v.trim() : "";
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const parsed = JSON.parse(t);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch { /* not JSON — keep as typed */ }
    }
    return t ? [t] : [];
  });
}

/** Converts one raw API provider document into the frontend's `Provider` shape. */
export function mapApiProviderToProvider(raw: ApiProvider): Provider {
  const id = raw.id || raw._id || "";
  const [firstName, ...rest] = (raw.fullName || "Help Zone Provider").trim().split(/\s+/);
  const lastName = rest.join(" ");
  const categoryIds = raw.categoryIds ?? [];
  const rawSkills = flattenList(raw.skills);
  const skills = rawSkills.length > 0
    ? rawSkills
    : categoryIds.map((c) => categoryName(c)).filter((n): n is string => Boolean(n));

  return {
    id,
    firstName: firstName || "Provider",
    lastName,
    photo: raw.imageUrl,
    categoryId: categoryIds[0] ?? "",
    skills,
    experienceYears: raw.experienceYears ?? 0,
    gender: (raw.gender?.toLowerCase() as Gender) || "female",
    age: raw.age ?? 0,
    languages: flattenList(raw.languages),
    area: raw.area || raw.emirate || raw.city || "",
    city: raw.city || raw.emirate || "",
    state: raw.state,
    longitude: raw.location?.coordinates?.[0],
    latitude: raw.location?.coordinates?.[1],
    availabilityType: mapAvailabilityType(raw.duration),
    price: raw.monthlySalary ?? 0,
    priceUnit: "per month",
    phone: raw.phone || raw.mobileNumber || "",
    about: raw.bio || raw.jobDescription || "",
    verified: raw.applicationStatus === "approved",
    // No rating field on the real API — left undefined rather than faked.
    rating: undefined,
    joinedDate: raw.createdAt || new Date().toISOString(),
    education: raw.education || undefined,
    nationality: raw.nationality || undefined,
    introVideoUrl: raw.introVideoUrl || undefined,
    previousWork: raw.lastWorkingExperience && (raw.lastWorkingExperience.jobTitle || raw.lastWorkingExperience.workingCity)
      ? {
          title: raw.lastWorkingExperience.jobTitle || undefined,
          city: raw.lastWorkingExperience.workingCity || undefined,
          years: raw.lastWorkingExperience.duration || undefined,
          familySize: raw.lastWorkingExperience.familySize || undefined,
        }
      : undefined,
  };
}

/**
 * Fetches every live provider in one call (the UI's existing filter/sort/
 * pagination logic already works client-side over a full in-memory list —
 * see src/lib/services/providers.ts — so there's no need to page server-side
 * for a catalog this size).
 */
// Every page and menu asks for the full list; share one request between them for a short while.
// Keyed by the customer token so a member never sees a visitor's copy (or the other way round).
const LIST_TTL_MS = 30_000;
let listCache: { key: string; at: number; promise: Promise<Provider[]> } | null = null;

// The last public list is kept for the browser session so a page can paint at once and refresh quietly behind it.
// Only visitors' (no token) lists are stored — a member's list may carry phone numbers and must not be kept.
const SNAPSHOT_KEY = "helpzone_providers_snapshot";

export function getProvidersSnapshot(): Provider[] | null {
  if (typeof window === "undefined" || getCustomerToken()) return null;
  try {
    const raw = window.sessionStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as Provider[]) : null;
  } catch {
    return null;
  }
}

function saveProvidersSnapshot(list: Provider[]) {
  if (typeof window === "undefined" || getCustomerToken()) return;
  try {
    window.sessionStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list));
  } catch { /* storage full or blocked — just skip the snapshot */ }
}

export function fetchLiveProviders(): Promise<Provider[]> {
  const key = typeof window === "undefined" ? "" : getCustomerToken() ?? "";
  if (listCache && listCache.key === key && Date.now() - listCache.at < LIST_TTL_MS) return listCache.promise;

  // Goes through our own /api/providers/list route (src/app/api/providers/list/route.ts),
  // not the external API directly — same-origin, so no CORS dependency on the
  // backend's allowlist.
  const promise = (async () => {
    const response = await fetch("/api/providers/list?limit=500", { cache: "no-store", headers: memberHeaders() });
    const res: ListResponse = await response.json();
    if (!res.success) throw new Error("Could not load providers.");
    const list = (res.data || []).filter(isPubliclyVisible).map(mapApiProviderToProvider);
    saveProvidersSnapshot(list);
    return list;
  })();
  listCache = { key, at: Date.now(), promise };
  // A failed request must not be served from the cache next time.
  promise.catch(() => { if (listCache?.promise === promise) listCache = null; });
  return promise;
}

export async function fetchLiveProviderById(id: string): Promise<Provider | null> {
  try {
    const response = await fetch(`/api/providers/${id}`, { cache: "no-store", headers: memberHeaders() });
    if (!response.ok) return null;
    const res: OneResponse = await response.json();
    if (!res.success || !res.data || !isPubliclyVisible(res.data)) return null;
    return mapApiProviderToProvider(res.data);
  } catch {
    return null;
  }
}
