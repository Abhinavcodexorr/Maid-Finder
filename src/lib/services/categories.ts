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

// Services created in the admin catalog (keys like "cat-cooking") aren't in
// the bundled list. Names fetched from the live catalog are remembered here,
// and a readable name is derived from the key if the catalog isn't loaded yet.
const catalogNames = new Map<string, string>();

export function rememberCatalogNames(services: { key: string; name: string }[]): void {
  services.forEach((s) => catalogNames.set(s.key, s.name));
}

export function getCategoryById(id: string): Category | undefined {
  const bundled = CATEGORIES.find((c) => c.id === id);
  if (bundled || !id.startsWith("cat-")) return bundled;
  const name =
    catalogNames.get(id) ??
    id
      .replace(/^cat-/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  return { id, name, slug: id.replace(/^cat-/, ""), icon: "briefcase", shortDescription: "", skills: [] };
}

export function getSkillsForCategory(categoryId: string): string[] {
  return getCategoryById(categoryId)?.skills ?? [];
}
