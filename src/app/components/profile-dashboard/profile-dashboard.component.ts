import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { User, Booking, UserSubscription, Subscription } from '../../../models';

interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  currentUser: User | null = null;
  bookings: Booking[] = [];
  isLoading = true;
  // KPIs
  totalSpent = 0;
  completedBookings = 0;
  upcomingBookings = 0;
  activeBookings = 0;
  monthlySpent = 0;
  averageRating = 0;
  // Subscription
  activeSubscription: UserSubscription | null = null;
  planDetails: Subscription | null = null;
  payments: Payment[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const userId = this.currentUser?.id;
    if (userId) {
      // Load static data for demonstration
      this.loadStaticData();
    } else {
      this.isLoading = false;
    }
  }

  private loadStaticData(): void {
    // Simulate loading delay
    setTimeout(() => {
      // Enhanced static user data
      this.currentUser = {
        id: 1,
        name: 'Ahmed Al-Rashid',
        email: 'ahmed.rashid@email.com',
        phone: '+971 50 123 4567',
        role: 'employer',
        isActive: true,
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2024-01-15')
      };

      // Static bookings data with maid information
      this.bookings = [
        {
          id: 1,
          employerId: 1,
          maidId: 1,
          maidName: 'Maria Santos',
          maidPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Filipino',
          maidRating: 4.8,
          startDate: new Date('2024-01-15T09:00:00'),
          endDate: new Date('2024-01-15T17:00:00'),
          duration: 8,
          hourlyRate: 25,
          totalAmount: 200,
          status: 'completed',
          workType: 'House Cleaning',
          description: 'Weekly house cleaning service',
          location: {
            address: '123 Main Street, Dubai Marina',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Pet-friendly maid required',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 2,
          employerId: 1,
          maidId: 2,
          maidName: 'Priya Sharma',
          maidPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Indian',
          maidRating: 4.9,
          startDate: new Date('2024-01-20T10:00:00'),
          endDate: new Date('2024-01-20T18:00:00'),
          duration: 8,
          hourlyRate: 30,
          totalAmount: 240,
          status: 'confirmed',
          workType: 'Child Care',
          description: 'Full day child care service',
          location: {
            address: '456 Jumeirah Road, Jumeirah',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Experience with toddlers',
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-19')
        },
        {
          id: 3,
          employerId: 1,
          maidId: 3,
          maidName: 'Siti Nurhaliza',
          maidPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Indonesian',
          maidRating: 4.7,
          startDate: new Date('2024-01-25T08:00:00'),
          endDate: new Date('2024-01-25T16:00:00'),
          duration: 8,
          hourlyRate: 22,
          totalAmount: 176,
          status: 'pending',
          workType: 'Cooking',
          description: 'Meal preparation and cooking',
          location: {
            address: '789 Sheikh Zayed Road, Downtown',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Vegetarian cooking skills',
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22')
        },
        {
          id: 4,
          employerId: 1,
          maidId: 4,
          maidName: 'Fatima Al-Zahra',
          maidPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Ethiopian',
          maidRating: 4.6,
          startDate: new Date('2024-01-30T09:00:00'),
          endDate: new Date('2024-01-30T17:00:00'),
          duration: 8,
          hourlyRate: 28,
          totalAmount: 224,
          status: 'in_progress',
          workType: 'Elderly Care',
          description: 'Companion care for elderly',
          location: {
            address: '321 Al Wasl Road, Jumeirah',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Medical training preferred',
          createdAt: new Date('2024-01-28'),
          updatedAt: new Date('2024-01-30')
        },
        {
          id: 5,
          employerId: 1,
          maidId: 5,
          maidName: 'Grace Okafor',
          maidPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Nigerian',
          maidRating: 4.7,
          startDate: new Date('2024-01-20T10:00:00'),
          endDate: new Date('2024-01-20T18:00:00'),
          duration: 8,
          hourlyRate: 26,
          totalAmount: 208,
          status: 'pending',
          workType: 'House Cleaning',
          description: 'Weekly house cleaning service',
          location: {
            address: '456 Business Bay, Dubai',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Pet-friendly maid required',
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-18')
        },
        {
          id: 6,
          employerId: 1,
          maidId: 6,
          maidName: 'Aisha Hassan',
          maidPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
          maidNationality: 'Kenyan',
          maidRating: 4.6,
          startDate: new Date('2024-01-22T09:00:00'),
          endDate: new Date('2024-01-22T17:00:00'),
          duration: 8,
          hourlyRate: 27,
          totalAmount: 216,
          status: 'confirmed',
          workType: 'Childcare',
          description: 'Full-day childcare service',
          location: {
            address: '789 Jumeirah, Dubai',
            city: 'Dubai',
            country: 'UAE'
          },
          specialRequirements: 'Experience with toddlers',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        }
      ];
      
      // Static subscription data
      this.activeSubscription = {
        id: 1,
        userId: 1,
        subscriptionId: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      };

      this.planDetails = {
        id: 1,
        name: 'Premium Plan',
        description: 'Unlimited maid bookings with premium features',
        price: 299,
        duration: 12,
        features: ['Unlimited Bookings', 'Priority Support', 'Advanced Search', '24/7 Customer Service'],
        isPopular: true,
        isActive: true
      };

      // Static payment data - using static HTML instead
      this.payments = [];

      this.computeKpis();
      this.isLoading = false;
    }, 1000);
  }

  private computeKpis(): void {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Basic counts
    this.completedBookings = this.bookings.filter(b => b.status === 'completed').length;
    this.upcomingBookings = this.bookings.filter(b => new Date(b.startDate) > now && (b.status === 'confirmed' || b.status === 'pending')).length;
    this.activeBookings = this.bookings.filter(b => b.status === 'in_progress').length;
    
    // Financial calculations
    this.totalSpent = this.bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    this.monthlySpent = this.bookings
      .filter(b => b.status === 'completed' && new Date(b.startDate) >= thisMonth)
      .reduce((sum, b) => sum + b.totalAmount, 0);
    
    // Average rating calculation (mock data)
    this.averageRating = 4.7; // This would be calculated from actual reviews
  }
}



