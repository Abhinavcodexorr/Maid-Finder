import type { MaidProfile, NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Find Maids", href: "/search" },
  { label: "Subscriptions", href: "/subscriptions" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FEATURED_MAIDS: MaidProfile[] = [
  {
    id: "m1",
    fullName: "Maria Santos",
    nationality: "Filipino",
    emirate: "Dubai",
    visaStatus: "Own Visa",
    experienceYears: 6,
    rating: 4.8,
    monthlySalaryAed: 2200,
    skills: ["Childcare", "Cooking", "Cleaning"],
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
  },
  {
    id: "m2",
    fullName: "Anita Kumari",
    nationality: "Indian",
    emirate: "Abu Dhabi",
    visaStatus: "Employer Visa",
    experienceYears: 5,
    rating: 4.7,
    monthlySalaryAed: 2000,
    skills: ["Cleaning", "Laundry", "Elderly Care"],
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop",
  },
  {
    id: "m3",
    fullName: "Nimali Perera",
    nationality: "Sri Lankan",
    emirate: "Sharjah",
    visaStatus: "Visit Visa",
    experienceYears: 4,
    rating: 4.6,
    monthlySalaryAed: 1800,
    skills: ["Childcare", "Tutoring", "Cooking"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop",
  },
];
