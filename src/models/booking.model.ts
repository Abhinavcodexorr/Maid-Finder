export interface Booking {
  id: number;
  employerId: number;
  maidId: number;
  maidName?: string;
  maidPhoto?: string;
  maidNationality?: string;
  maidRating?: number;
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  hourlyRate: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  workType: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  specialRequirements?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  maidId: number;
  startDate: Date;
  endDate: Date;
  workType: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  specialRequirements?: string;
}

export interface Review {
  id: number;
  bookingId: number;
  employerId: number;
  maidId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
