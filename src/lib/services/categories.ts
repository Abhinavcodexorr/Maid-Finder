import { CATEGORIES } from "@/data/categories";
import type { Category } from "@/types/marketplace";

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  return CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === decoded ||
      c.id.toLowerCase() === decoded ||
      c.name.toLowerCase() === decoded ||
      c.slug.replace(/-/g, "") === decoded.replace(/-/g, "") ||
      (decoded === "maid" && c.slug === "maid-cleaning") ||
      (decoded === "cleaning" && c.slug === "maid-cleaning") ||
      (decoded === "babysitter" && c.slug === "babysitter-nanny") ||
      (decoded === "nanny" && c.slug === "babysitter-nanny") ||
      (decoded === "elderly" && c.slug === "elderly-care")
  );
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getSkillsForCategory(categoryId: string): string[] {
  return getCategoryById(categoryId)?.skills ?? [];
}
