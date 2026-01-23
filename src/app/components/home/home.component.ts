import { Component, OnInit } from '@angular/core';
import { Maid } from '../../../models';
import { MaidService } from '../../../services/maid.service';
import { BookingService } from '../../../services/booking.service';
import { FavoritesService } from '../../../services/favorites.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredMaids: Maid[] = [];
  isLoading = true;
  favorites: number[] = [];
  stats = {
    totalMaids: 0,
    happyFamilies: 0,
    completedBookings: 0,
    averageRating: 0
  };

  constructor(
    private maidService: MaidService,
    private bookingService: BookingService,
    private favoritesService: FavoritesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedMaids();
    this.loadStats();
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.favorites = favorites;
    });
  }

  loadFeaturedMaids(): void {
    this.maidService.getFeaturedMaids().subscribe(maids => {
      this.featuredMaids = maids;
      this.isLoading = false;
    });
  }

  loadFeaturedMaidsOld(): void {
    // Simulate loading delay
    setTimeout(() => {
      // Sample data for demonstration
      this.featuredMaids = [
      {
        id: 1,
        userId: 1,
        firstName: 'Maria',
        lastName: 'Santos',
        age: 28,
        nationality: 'Filipino',
        experience: 5,
        languages: ['English', 'Tagalog', 'Arabic'],
        skills: ['House Cleaning', 'Cooking', 'Child Care', 'Laundry'],
        availability: 'available',
        hourlyRate: 25,
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
        bio: 'Experienced and reliable domestic helper with excellent references.',
        location: {
          city: 'Dubai',
          country: 'UAE',
          address: 'Dubai Marina'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.9,
        totalReviews: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 2,
        firstName: 'Priya',
        lastName: 'Sharma',
        age: 32,
        nationality: 'Indian',
        experience: 7,
        languages: ['English', 'Hindi', 'Arabic'],
        skills: ['Cooking', 'House Cleaning', 'Elderly Care', 'Pet Care'],
        availability: 'available',
        hourlyRate: 30,
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
        bio: 'Professional and caring domestic helper with extensive experience.',
        location: {
          city: 'Abu Dhabi',
          country: 'UAE',
          address: 'Al Reem Island'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.8,
        totalReviews: 38,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 3,
        firstName: 'Aisha',
        lastName: 'Hassan',
        age: 26,
        nationality: 'Ethiopian',
        experience: 4,
        languages: ['English', 'Amharic', 'Arabic'],
        skills: ['House Cleaning', 'Cooking', 'Child Care'],
        availability: 'available',
        hourlyRate: 22,
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face',
        bio: 'Young, energetic, and dedicated to providing excellent service.',
        location: {
          city: 'Sharjah',
          country: 'UAE',
          address: 'Al Majaz'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.7,
        totalReviews: 22,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 4,
        firstName: 'Grace',
        lastName: 'Okafor',
        age: 35,
        nationality: 'Nigerian',
        experience: 8,
        languages: ['English', 'Yoruba', 'Arabic'],
        skills: ['Cooking', 'House Cleaning', 'Child Care', 'Elderly Care'],
        availability: 'available',
        hourlyRate: 28,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face',
        bio: 'Experienced and trustworthy with excellent cooking skills.',
        location: {
          city: 'Dubai',
          country: 'UAE',
          address: 'Jumeirah'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.9,
        totalReviews: 52,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        userId: 5,
        firstName: 'Siti',
        lastName: 'Rahman',
        age: 29,
        nationality: 'Indonesian',
        experience: 6,
        languages: ['English', 'Bahasa Indonesia', 'Arabic'],
        skills: ['House Cleaning', 'Cooking', 'Laundry', 'Ironing'],
        availability: 'available',
        hourlyRate: 24,
        profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
        bio: 'Hardworking and detail-oriented with great attention to cleanliness.',
        location: {
          city: 'Ajman',
          country: 'UAE',
          address: 'Al Nuaimiya'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.6,
        totalReviews: 31,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        userId: 6,
        firstName: 'Lakshmi',
        lastName: 'Kumar',
        age: 31,
        nationality: 'Sri Lankan',
        experience: 5,
        languages: ['English', 'Sinhala', 'Tamil', 'Arabic'],
        skills: ['Cooking', 'Child Care', 'House Cleaning', 'Pet Care'],
        availability: 'available',
        hourlyRate: 26,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        bio: 'Caring and patient with excellent child care experience.',
        location: {
          city: 'Dubai',
          country: 'UAE',
          address: 'Downtown Dubai'
        },
        workHistory: [],
        certifications: [],
        references: [],
        isVerified: true,
        rating: 4.8,
        totalReviews: 29,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.isLoading = false;
    }, 1000);
  }

  loadStats(): void {
    // Mock data for demonstration
    this.stats = {
      totalMaids: 1250,
      happyFamilies: 3200,
      completedBookings: 8500,
      averageRating: 4.8
    };
  }

  toggleFavorite(maidId: number): void {
    this.favoritesService.toggleFavorite(maidId).subscribe({
      next: (success) => {
        if (success) {
          // Update local favorites array
          this.loadFavorites();
          const isFavorite = this.favorites.includes(maidId);
          this.toastr.success(
            isFavorite ? 'Added to favorites' : 'Removed from favorites',
            'Favorites'
          );
        }
      },
      error: (error) => {
        console.error('Error updating favorites:', error);
        this.toastr.error('Failed to update favorites', 'Error');
      }
    });
  }

  isFavorite(maidId: number): boolean {
    return this.favorites.includes(maidId);
  }

  bookMaid(maidId: number): void {
    const maid = this.featuredMaids.find(m => m.id === maidId);
    if (maid) {
      // Create a booking
      const booking = {
        id: Date.now(), // Simple ID generation
        employerId: 1, // Mock user ID
        maidId: maidId,
        maidName: `${maid.firstName} ${maid.lastName}`,
        maidPhoto: maid.profileImage,
        maidNationality: maid.nationality,
        maidRating: maid.rating,
        startDate: new Date(),
        endDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours later
        duration: 8,
        hourlyRate: maid.hourlyRate,
        totalAmount: maid.hourlyRate * 8,
        status: 'pending',
        workType: 'House Cleaning',
        description: 'Booking from home page',
        location: {
          address: '123 Main Street, Dubai',
          city: 'Dubai',
          country: 'UAE'
        },
        specialRequirements: 'None',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.bookingService.createBooking(booking).subscribe({
        next: () => {
          this.toastr.success('Maid booked successfully!', 'Booking Confirmed');
          this.router.navigate(['/profile-dashboard']);
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.toastr.error('Failed to book maid', 'Error');
        }
      });
    }
  }

  viewMaidProfile(maidId: number): void {
    this.router.navigate(['/maid', maidId]);
  }
}
