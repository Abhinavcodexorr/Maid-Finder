import { PROVIDERS } from "@/data/providers";
import type { MaskedProvider, Provider, ProviderFilters } from "@/types/marketplace";

const EXPERIENCE_RANGES: Record<NonNullable<ProviderFilters["experience"]>, [number, number]> = {
  "0-1": [0, 1],
  "1-3": [1, 3],
  "3-5": [3, 5],
  "5+": [5, Infinity],
};

/**
 * Masks price/phone unless the viewer has an active plan. In this
 * frontend-only build the check happens here (not just CSS) so the exact
 * same function signature can later be moved server-side without pages
 * needing to change — they only ever see the masked shape unless unlocked.
 */
export function maskProvider(provider: Provider, hasAccess: boolean): MaskedProvider {
  const priceMasked = `₹ ${"•".repeat(2)},${"•".repeat(3)}`;
  const phoneMasked = "+91 98XXX XXXXX";

  if (hasAccess) {
    return {
      ...provider,
      price: provider.price,
      phone: provider.phone,
      priceMasked: `₹${provider.price.toLocaleString("en-IN")} ${provider.priceUnit}`,
      phoneMasked: provider.phone,
    };
  }

  return {
    ...provider,
    price: null,
    phone: null,
    priceMasked,
    phoneMasked,
  };
}

import { CATEGORIES } from "@/data/categories";

function matchesFilters(p: Provider, filters: ProviderFilters): boolean {
  // 1. Resolve categoryIds and categorySlug
  const targetCategoryIds = new Set<string>();
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    for (const cid of filters.categoryIds) {
      if (cid.startsWith("cat-")) {
        targetCategoryIds.add(cid);
      } else {
        const matched = CATEGORIES.find(
          (c) => c.slug === cid || c.id === cid || c.name.toLowerCase() === cid.toLowerCase()
        );
        if (matched) targetCategoryIds.add(matched.id);
        else targetCategoryIds.add(cid);
      }
    }
  }
  if (filters.categorySlug) {
    const matched = CATEGORIES.find(
      (c) => c.slug === filters.categorySlug || c.id === filters.categorySlug
    );
    if (matched) targetCategoryIds.add(matched.id);
  }
  if (targetCategoryIds.size > 0 && !targetCategoryIds.has(p.categoryId)) return false;

  // 2. Keyword search (q)
  if (filters.q && filters.q.trim()) {
    const query = filters.q.trim().toLowerCase();
    const cat = CATEGORIES.find((c) => c.id === p.categoryId);
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchesName = fullName.includes(query);
    const matchesCategory = cat
      ? cat.name.toLowerCase().includes(query) || cat.slug.toLowerCase().includes(query)
      : false;
    const matchesSkills = p.skills.some((s) => s.toLowerCase().includes(query));
    const matchesLocation = p.area.toLowerCase().includes(query) || p.city.toLowerCase().includes(query);
    const matchesAbout = p.about.toLowerCase().includes(query);
    if (!matchesName && !matchesCategory && !matchesSkills && !matchesLocation && !matchesAbout) {
      return false;
    }
  }

  // 3. Area / City matching
  if (filters.area && filters.area.trim()) {
    const areaQuery = filters.area.trim().toLowerCase();
    const areaMatch =
      p.area.toLowerCase().includes(areaQuery) || p.city.toLowerCase().includes(areaQuery);
    if (!areaMatch) return false;
  }

  // 4. Experience range
  if (filters.experience) {
    const [min, max] = EXPERIENCE_RANGES[filters.experience];
    if (p.experienceYears < min || p.experienceYears > max) return false;
  }

  // 5. Availability type
  if (filters.availabilityType && p.availabilityType !== filters.availabilityType) return false;

  // 6. Gender
  if (filters.gender && p.gender !== filters.gender) return false;

  // 7. Age
  if (filters.minAge !== undefined && p.age < filters.minAge) return false;
  if (filters.maxAge !== undefined && p.age > filters.maxAge) return false;

  // 8. Languages & Skills
  if (filters.languages && filters.languages.length > 0 && !filters.languages.some((l) => p.languages.includes(l))) {
    return false;
  }
  if (filters.skills && filters.skills.length > 0 && !filters.skills.some((s) => p.skills.includes(s))) {
    return false;
  }

  // 9. Verified only
  if (filters.verifiedOnly && !p.verified) return false;

  return true;
}

function sortProviders(list: Provider[], sort: ProviderFilters["sort"]): Provider[] {
  const copy = [...list];
  switch (sort) {
    case "experience":
      return copy.sort((a, b) => b.experienceYears - a.experienceYears);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
    default:
      return copy.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
  }
}

export interface ProviderSearchResult {
  items: Provider[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function getProviders(filters: ProviderFilters = {}): ProviderSearchResult {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 9;

  const filtered = sortProviders(PROVIDERS.filter((p) => matchesFilters(p, filters)), filters.sort);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total, page, pageSize, totalPages };
}

export function getProviderById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getSimilarProviders(provider: Provider, limit = 3): Provider[] {
  return PROVIDERS.filter((p) => p.categoryId === provider.categoryId && p.id !== provider.id).slice(0, limit);
}

export function getFeaturedProviders(limit = 6): Provider[] {
  return [...PROVIDERS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getAllProviders(): Provider[] {
  return PROVIDERS;
}

export function getDistinctAreas(): string[] {
  return Array.from(new Set(PROVIDERS.map((p) => p.area))).sort();
}

export function getDistinctCities(): string[] {
  return Array.from(new Set(PROVIDERS.map((p) => p.city))).sort();
}

export function getDistinctLocations(): string[] {
  const cities = PROVIDERS.map((p) => p.city);
  const areas = PROVIDERS.map((p) => p.area);
  return Array.from(new Set([...cities, ...areas])).sort();
}

export function getDistinctLanguages(): string[] {
  return Array.from(new Set(PROVIDERS.flatMap((p) => p.languages))).sort();
}


