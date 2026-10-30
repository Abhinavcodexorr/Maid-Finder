import {
  Baby, Bath, BriefcaseBusiness, Building2, Car, ChefHat, Hammer, HeartPulse, Leaf, Paintbrush,
  Shirt, Snowflake, Sofa, SprayCan, Stethoscope, UtensilsCrossed, Wrench, Zap, type LucideIcon,
} from "lucide-react";

// The service catalog is admin-managed and has no icons, so one is picked
// from the service's name. Unknown services get a neutral briefcase.
const GLYPHS: Array<[RegExp, LucideIcon]> = [
  [/kitchen/i, UtensilsCrossed],
  [/cook|chef/i, ChefHat],
  [/bath/i, Bath],
  [/wash|laundry|cloth/i, Shirt],
  [/sofa/i, Sofa],
  [/office/i, Building2],
  [/clean|maid/i, SprayCan],
  [/plumb/i, Wrench],
  [/electric/i, Zap],
  [/carpent/i, Hammer],
  [/driver/i, Car],
  [/nanny|baby|child/i, Baby],
  [/nurs|patient/i, Stethoscope],
  [/elder|old/i, HeartPulse],
  [/garden/i, Leaf],
  [/\bac\b|air/i, Snowflake],
  [/paint/i, Paintbrush],
];

export function ServiceGlyph({ name, className }: { name: string; className?: string }) {
  const Glyph = GLYPHS.find(([pattern]) => pattern.test(name))?.[1] ?? BriefcaseBusiness;
  return <Glyph className={className} strokeWidth={1.75} aria-hidden />;
}

// Vivid gradient pairs used to colour service tiles, cycled by position.
export const SERVICE_GRADIENTS = [
  ["#6366f1", "#2563eb"],
  ["#f97316", "#ef4444"],
  ["#10b981", "#0d9488"],
  ["#ec4899", "#a855f7"],
  ["#0ea5e9", "#2563eb"],
  ["#f59e0b", "#f97316"],
  ["#14b8a6", "#0ea5e9"],
  ["#8b5cf6", "#6366f1"],
] as const;

export function serviceGradient(index: number): string {
  const [from, to] = SERVICE_GRADIENTS[index % SERVICE_GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

// Real photos exist for a handful of services; the rest fall back to an icon card.
const PHOTOS: Array<[RegExp, string]> = [
  [/cook|chef/i, "/images/services/cooking.jpg"],
  [/nanny|baby|child/i, "/images/services/nanny.jpg"],
  [/elder|nurs|patient/i, "/images/services/elderly.jpg"],
  [/driver/i, "/images/services/driver.jpg"],
  [/electric/i, "/images/services/electrician.jpg"],
  [/garden/i, "/images/services/gardener.jpg"],
  [/clean|maid|wash|laundry|cloth|sofa|bath/i, "/images/services/cleaning.jpg"],
];

export function servicePhoto(name: string): string | null {
  return PHOTOS.find(([pattern]) => pattern.test(name))?.[1] ?? null;
}

/**
 * Picks services for a tile grid so each photo appears once: services with
 * their own photo first, then the rest (shown as icon cards).
 */
export function pickShowcaseServices<T extends { name: string }>(services: T[], count: number): T[] {
  const seen = new Set<string>();
  const withPhoto: T[] = [];
  const rest: T[] = [];
  for (const svc of services) {
    const photo = servicePhoto(svc.name);
    if (photo && !seen.has(photo)) {
      seen.add(photo);
      withPhoto.push(svc);
    } else {
      rest.push(svc);
    }
  }
  return [...withPhoto, ...rest].slice(0, count);
}
