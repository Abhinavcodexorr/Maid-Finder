const CATEGORY_PALETTE: Record<string, { color: string; soft: string; gradient: string }> = {
  "cat-cook": { color: "var(--cat-cook)", soft: "var(--cat-cook-soft)", gradient: "var(--gradient-cat-cook)" },
  "cat-maid": { color: "var(--cat-maid)", soft: "var(--cat-maid-soft)", gradient: "var(--gradient-cat-maid)" },
  "cat-plumber": { color: "var(--cat-plumber)", soft: "var(--cat-plumber-soft)", gradient: "var(--gradient-cat-plumber)" },
  "cat-electrician": { color: "var(--cat-electrician)", soft: "var(--cat-electrician-soft)", gradient: "var(--gradient-cat-electrician)" },
  "cat-carpenter": { color: "var(--cat-carpenter)", soft: "var(--cat-carpenter-soft)", gradient: "var(--gradient-cat-carpenter)" },
  "cat-driver": { color: "var(--cat-driver)", soft: "var(--cat-driver-soft)", gradient: "var(--gradient-cat-driver)" },
  "cat-babysitter": { color: "var(--cat-babysitter)", soft: "var(--cat-babysitter-soft)", gradient: "var(--gradient-cat-babysitter)" },
  "cat-elderly-care": { color: "var(--cat-elderly-care)", soft: "var(--cat-elderly-care-soft)", gradient: "var(--gradient-cat-elderly-care)" },
  "cat-painter": { color: "var(--cat-painter)", soft: "var(--cat-painter-soft)", gradient: "var(--gradient-cat-painter)" },
};

const FALLBACK = { color: "var(--primary)", soft: "var(--primary-soft)", gradient: "var(--gradient-primary)" };

/** Deterministic accent color for a category id — used for avatar fallbacks, category tiles and icon chips. */
export function colorForCategory(categoryId: string | undefined) {
  if (!categoryId) return FALLBACK;
  return CATEGORY_PALETTE[categoryId] ?? FALLBACK;
}

/** Spreads the palette across a list by index — handy for categories without a fixed id (e.g. "Gardening"). */
export function colorForIndex(index: number) {
  const values = Object.values(CATEGORY_PALETTE);
  return values[index % values.length];
}
