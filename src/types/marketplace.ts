// Fresh domain types for the Help Zone marketplace rebuild.
// Kept separate from src/types/index.ts (the old booking-flow model) so the
// two can coexist while pages are migrated screen by screen.

export type Gender = "male" | "female";
export type AvailabilityType = "full-time" | "part-time" | "live-in" | "one-time";
export type PriceUnit = "per month" | "per visit" | "per hour";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  shortDescription: string;
  skills: string[];
}

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  categoryId: string;
  skills: string[];
  experienceYears: number;
  gender: Gender;
  age: number;
  languages: string[];
  area: string;
  city: string;
  availabilityType: AvailabilityType;
  price: number;
  priceUnit: PriceUnit;
  phone: string;
  about: string;
  verified: boolean;
  rating: number;
  joinedDate: string;
}

/** Provider shape after masking — price/phone absent unless the viewer has access. */
export type MaskedProvider = Omit<Provider, "price" | "phone"> & {
  price: number | null;
  phone: string | null;
  priceMasked: string;
  phoneMasked: string;
};

export interface ProviderFilters {
  q?: string;
  categorySlug?: string;
  categoryIds?: string[];
  area?: string;
  experience?: "0-1" | "1-3" | "3-5" | "5+";
  availabilityType?: AvailabilityType;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  languages?: string[];
  skills?: string[];
  verifiedOnly?: boolean;
  sort?: "newest" | "experience" | "rating" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  durationDays: number;
  isPopular?: boolean;
  description?: string;
  features: string[];
}

export type PaymentMode = "UPI" | "Card" | "Netbanking";
export type PaymentStatus = "success" | "failed";

export interface Payment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  mode: PaymentMode;
  status: PaymentStatus;
  createdAt: string;
}

export interface Subscription {
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
}

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  lookingFor: string[];
  preferredArea?: string;
  requirementType?: AvailabilityType;
  onboardingDismissed?: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  area: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactViewRecord {
  userId: string;
  providerId: string;
  viewedAt: string;
}
