"use client";

// Bridges the real Maid Finder BE favourites API (POST/DELETE/GET
// /api/v1/user/favourites) into the frontend's existing `Provider` shape,
// replacing the old localStorage-only `saved.ts`. Requires the signed-in
// customer's Bearer token (see live-customer-auth.ts), since every
// favourites endpoint is protected server-side.

import { ApiError } from "@/lib/api-client";
import { getCustomerToken } from "@/lib/services/live-customer-auth";
import { mapApiProviderToProvider, type ApiProvider } from "@/lib/services/live-providers";
import type { Provider } from "@/types/marketplace";

interface ListResponse {
  success: boolean;
  count: number;
  data: ApiProvider[];
}

interface MutateResponse {
  success: boolean;
  message?: string;
}

function authHeaders(): HeadersInit {
  const token = getCustomerToken();
  if (!token) throw new ApiError("You need to be logged in to do that.", 401, null);
  return { Authorization: `Bearer ${token}` };
}

/** Every provider the signed-in customer has favourited, in the shared `Provider` shape. */
export async function fetchFavouriteProviders(): Promise<Provider[]> {
  const response = await fetch("/api/customers/favourites", {
    headers: authHeaders(),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  const res = data as ListResponse;
  return (res.data || []).map(mapApiProviderToProvider);
}

export async function addFavourite(providerId: string): Promise<void> {
  const response = await fetch(`/api/customers/favourites/${providerId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data: MutateResponse = await response.json().catch(() => ({ success: false }));
  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
  }
}

export async function removeFavourite(providerId: string): Promise<void> {
  const response = await fetch(`/api/customers/favourites/${providerId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data: MutateResponse = await response.json().catch(() => ({ success: false }));
  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `Request failed with status ${response.status}`, response.status, data);
  }
}

/** Adds or removes the favourite depending on its current state, and returns the new state. */
export async function toggleFavourite(providerId: string, currentlySaved: boolean): Promise<boolean> {
  if (currentlySaved) {
    await removeFavourite(providerId);
    return false;
  }
  await addFavourite(providerId);
  return true;
}

// ---------------------------------------------------------------------
// Shared in-memory cache of the signed-in customer's favourite provider
// ids. A provider grid can render dozens of ProviderCards at once, and
// each one needs to know whether it's saved — without this, every card
// would fire its own GET /favourites. Fetched once per session, mutated
// in place by toggles, and cleared on logout (see AuthContext.logout).
// ---------------------------------------------------------------------
let idsCache: Promise<Set<string>> | null = null;

/** The favourite id set, fetched once and reused across every ProviderCard on the page. */
export function getCachedFavouriteIds(): Promise<Set<string>> {
  if (!idsCache) {
    idsCache = fetchFavouriteProviders()
      .then((list) => new Set(list.map((p) => p.id)))
      .catch((err) => {
        idsCache = null;
        throw err;
      });
  }
  return idsCache;
}

/** Toggles a favourite and keeps the shared id cache in sync, so every other card reflects it without a refetch. */
export async function toggleFavouriteCached(providerId: string, currentlySaved: boolean): Promise<boolean> {
  const next = await toggleFavourite(providerId, currentlySaved);
  const ids = await getCachedFavouriteIds().catch(() => new Set<string>());
  if (next) ids.add(providerId);
  else ids.delete(providerId);
  return next;
}

/** Drops the cached favourite ids — call on logout so a different (or no) customer never sees a stale list. */
export function clearFavouritesCache(): void {
  idsCache = null;
}
