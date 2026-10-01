import type { Category } from "@/types/marketplace";

export const CATEGORIES: Category[] = [
  {
    id: "cat-cook",
    name: "Cook",
    slug: "cook",
    icon: "bell",
    shortDescription: "Home chefs for daily meals, tiffin service or special occasions.",
    skills: ["North Indian", "South Indian", "Chinese", "Continental", "Baking", "Tiffin Service", "Jain Food", "Diet Cooking"],
  },
  {
    id: "cat-maid",
    name: "Maid / Cleaning",
    slug: "maid-cleaning",
    icon: "briefcase",
    shortDescription: "House help for cleaning, cooking, laundry and daily chores.",
    skills: ["Deep Cleaning", "Sweeping & Mopping", "Utensils", "Laundry & Ironing", "Dusting", "Bathroom Cleaning"],
  },
  {
    id: "cat-plumber",
    name: "Plumber",
    slug: "plumber",
    icon: "activity",
    shortDescription: "Licensed plumbers for repairs, fittings and emergency leaks.",
    skills: ["Pipe Fitting", "Leak Repair", "Bathroom Fitting", "Water Tank", "Drainage", "Emergency Service"],
  },
  {
    id: "cat-electrician",
    name: "Electrician",
    slug: "electrician",
    icon: "activity",
    shortDescription: "Wiring, switchboards, appliance repair and safety checks.",
    skills: ["Wiring", "Switchboard", "Appliance Repair", "Inverter & UPS", "Fan & Light Fitting", "Safety Audit"],
  },
  {
    id: "cat-carpenter",
    name: "Carpenter",
    slug: "carpenter",
    icon: "briefcase",
    shortDescription: "Furniture repair, modular work and custom woodwork.",
    skills: ["Furniture Repair", "Modular Kitchen", "Door & Window", "Custom Furniture", "Polishing"],
  },
  {
    id: "cat-driver",
    name: "Driver",
    slug: "driver",
    icon: "briefcase",
    shortDescription: "Experienced drivers for daily commute, outstation or full-time.",
    skills: ["City Driving", "Outstation", "Manual & Automatic", "Commercial License", "Night Driving"],
  },
  {
    id: "cat-babysitter",
    name: "Babysitter / Nanny",
    slug: "babysitter-nanny",
    icon: "user",
    shortDescription: "Trained caregivers for infants, toddlers and school-age kids.",
    skills: ["Infant Care", "Toddler Care", "Homework Help", "Newborn Care", "Night Shifts", "Activities & Play"],
  },
  {
    id: "cat-elderly-care",
    name: "Elderly Care",
    slug: "elderly-care",
    icon: "heart",
    shortDescription: "Compassionate attendants for seniors needing daily support.",
    skills: ["Mobility Support", "Medication Reminders", "Companionship", "Dementia Care", "Post-surgery Care"],
  },
  {
    id: "cat-painter",
    name: "Painter",
    slug: "painter",
    icon: "briefcase",
    shortDescription: "Interior and exterior painting for homes and offices.",
    skills: ["Interior Painting", "Exterior Painting", "Texture Work", "Waterproofing", "Wood Polish"],
  },
];

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
