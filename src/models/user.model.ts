export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'employer' | 'maid';
  isActive: boolean;
  isVerified?: boolean;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  address: string;
  city: string;
  country: string;
  profileImage?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
}
