"use client";

// Bridges the real Help Zone API (Maid Finder BE, providers collection) into
// the frontend's existing `Provider` shape, so the listing pages that were
// built against mock data (src/data/providers.ts) can render real
// registrations with no further changes to their filter/sort/render logic.
//
// The live API has no rating/review system and no structured
// `availabilityType` enum — those are adapted/omitted rather than
// fabricated. See `mapApiProviderToProvider` for every mapping decision.

import { CATEGORIES } from "@/data/categories";
import type { AvailabilityType, Gender, Provider } from "@/types/marketplace";

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
  return CATEGORIES.find((c) => c.id === id)?.name;
}

function mapAvailabilityType(duration?: string): AvailabilityType {
  const d = (duration || "").toLowerCase();
  if (d.includes("part")) return "part-time";
  if (d.includes("live")) return "live-in";
  if (d.includes("full")) return "full-time";
  return "one-time";
}

/** Converts one raw API provider document into the frontend's `Provider` shape. */
export function mapApiProviderToProvider(raw: ApiProvider): Provider {
  const id = raw.id || raw._id || "";
  const [firstName, ...rest] = (raw.fullName || "Help Zone Provider").trim().split(/\s+/);
  const lastName = rest.join(" ");
  const categoryIds = raw.categoryIds ?? [];
  const skills = raw.skills && raw.skills.length > 0
    ? raw.skills
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
    languages: raw.languages ?? [],
    area: raw.area || raw.emirate || raw.city || "",
    city: raw.city || raw.emirate || "",
    availabilityType: mapAvailabilityType(raw.duration),
    price: raw.monthlySalary ?? 0,
    priceUnit: "per month",
    phone: raw.phone || raw.mobileNumber || "",
    about: raw.bio || raw.jobDescription || "",
    verified: raw.applicationStatus === "approved",
    // No rating field on the real API — left undefined rather than faked.
    rating: undefined,
    joinedDate: raw.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetches every live provider in one call (the UI's existing filter/sort/
 * pagination logic already works client-side over a full in-memory list —
 * see src/lib/services/providers.ts — so there's no need to page server-side
 * for a catalog this size).
 */
export async function fetchLiveProviders(): Promise<Provider[]> {
  // Goes through our own /api/providers/list route (src/app/api/providers/list/route.ts),
  // not the external API directly — same-origin, so no CORS dependency on the
  // backend's allowlist.
  const response = await fetch("/api/providers/list?limit=500", { cache: "no-store" });
  const res: ListResponse = await response.json();
  if (!res.success) throw new Error("Could not load providers.");
  return (res.data || []).filter(isPubliclyVisible).map(mapApiProviderToProvider);
}

export async function fetchLiveProviderById(id: string): Promise<Provider | null> {
  try {
    const response = await fetch(`/api/providers/${id}`, { cache: "no-store" });
    if (!response.ok) return null;
    const res: OneResponse = await response.json();
    if (!res.success || !res.data || !isPubliclyVisible(res.data)) return null;
    return mapApiProviderToProvider(res.data);
  } catch {
    return null;
  }
}
