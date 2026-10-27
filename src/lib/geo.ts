import type { Provider } from "@/types/marketplace";

/** The visitor's chosen place. Coordinates are present when it came from the device or a pincode lookup. */
export interface UserLocation {
  city: string;
  state: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

/** "Any" means no radius limit — everyone is shown, nearest first. */
export const RADIUS_OPTIONS = [5, 10, 25, 50, 100] as const;
export const DEFAULT_RADIUS_KM = 25;

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in km. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

const sameText = (a?: string, b?: string) => Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase());

/**
 * Adds `distanceKm` to every provider that has coordinates, and — when a
 * radius is given — keeps only providers inside it. A provider with no
 * stored coordinates (older registrations) can't be measured, so it stays
 * if it is in the visitor's city, and is dropped otherwise.
 */
export function applyLocation(providers: Provider[], location: UserLocation | null, radiusKm: number | null): Provider[] {
  if (!location) return providers;

  const measured = providers.map((p) => {
    if (location.lat === undefined || location.lng === undefined || p.latitude === undefined || p.longitude === undefined) return p;
    return { ...p, distanceKm: haversineKm(location.lat, location.lng, p.latitude, p.longitude) };
  });

  // Same-city providers without coordinates still need a rank, so they count as "in the city" (distance 0).
  const ranked = measured.map((p) =>
    p.distanceKm === undefined && sameText(p.city, location.city) ? { ...p, distanceKm: 0 } : p
  );

  if (radiusKm === null) return ranked;
  return ranked.filter((p) => p.distanceKm !== undefined && p.distanceKm <= radiusKm);
}

/** "2.4 km away" / "In your city" — empty when the distance is unknown. */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined) return "";
  if (distanceKm < 1) return "In your area";
  return `${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km away`;
}
