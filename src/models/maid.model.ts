export interface Maid {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  experience: number;
  languages: string[];
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate: number;
  profileImage?: string;
  bio: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  workHistory: WorkExperience[];
  certifications: Certification[];
  references: Reference[];
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: number;
  employerName: string;
  position: string;
  duration: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
}

export interface Certification {
  id: number;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateNumber: string;
}

export interface Reference {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  description: string;
}

export interface MaidSearchFilters {
  nationality?: string;
  skills?: string[];
  minExperience?: number;
  maxHourlyRate?: number;
  location?: string;
  availability?: string;
  languages?: string[];
  isVerified?: boolean;
  minRating?: number;
}
