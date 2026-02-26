export type UserRole = "customer" | "maid";

export interface MaidProfile {
  id: string;
  fullName: string;
  nationality: string;
  emirate: string;
  visaStatus: string;
  experienceYears: number;
  rating: number;
  monthlySalaryAed: number;
  skills: string[];
  imageUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
}
