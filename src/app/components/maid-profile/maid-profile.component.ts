import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Maid } from '../../../models';
import { BookingService } from '../../../services/booking.service';
import { FavoritesService } from '../../../services/favorites.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maid-profile',
  templateUrl: './maid-profile.component.html',
  styleUrls: ['./maid-profile.component.scss']
})
export class MaidProfileComponent implements OnInit {
  maid: Maid | null = null;
  bookingForm: FormGroup;
  isFavorite = false;
  isLoading = false;
  maidBookings: any[] = [];
  sampleReviews = [
    {
      reviewerName: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent service! Maria was very professional and thorough. Highly recommended.'
    },
    {
      reviewerName: 'Ahmed Al-Rashid',
      rating: 5,
      date: '1 week ago',
      comment: 'Great cooking skills and very reliable. My family loves her.'
    },
    {
      reviewerName: 'Lisa Chen',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good service overall. Very punctual and clean work.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private favoritesService: FavoritesService,
    private toastr: ToastrService
  ) {
    this.bookingForm = this.fb.group({
      serviceDate: ['', Validators.required],
      serviceTime: ['', Validators.required],
      duration: ['', Validators.required],
      serviceType: ['', Validators.required],
      specialInstructions: [''],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const maidId = this.route.snapshot.paramMap.get('id');
    if (maidId) {
      this.loadMaidProfile(parseInt(maidId));
      this.checkFavoriteStatus(parseInt(maidId));
    }
  }

  checkFavoriteStatus(maidId: number): void {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.isFavorite = favorites.includes(maidId);
    });
  }

  loadMaidProfile(id: number): void {
    // Sample data - replace with actual API call
    const sampleMaids: Maid[] = [
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
        bio: 'Experienced and reliable domestic helper with excellent references. I have been working in the UAE for over 5 years and have helped many families with their household needs. I am dedicated, trustworthy, and take pride in my work.',
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
        bio: 'Professional and caring domestic helper with extensive experience. I specialize in cooking authentic Indian cuisine and providing excellent care for elderly family members.',
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
      }
    ];

    this.maid = sampleMaids.find(maid => maid.id === id) || null;
    
    // Load maid's booking history
    this.loadMaidBookings(id);
  }

  loadMaidBookings(maidId: number): void {
    // Mock booking data for the maid
    this.maidBookings = [
      {
        id: 1,
        startDate: new Date('2024-01-15T09:00:00'),
        workType: 'house-cleaning',
        duration: 4,
        status: 'completed',
        totalAmount: 100
      },
      {
        id: 2,
        startDate: new Date('2024-01-20T14:00:00'),
        workType: 'cooking',
        duration: 6,
        status: 'completed',
        totalAmount: 150
      },
      {
        id: 3,
        startDate: new Date('2024-01-25T10:00:00'),
        workType: 'childcare',
        duration: 8,
        status: 'confirmed',
        totalAmount: 200
      },
      {
        id: 4,
        startDate: new Date('2024-01-30T16:00:00'),
        workType: 'house-cleaning',
        duration: 3,
        status: 'pending',
        totalAmount: 75
      }
    ];
  }

  openBookingModal(): void {
    // This would open the booking modal
    const modal = document.getElementById('bookingModal');
    if (modal) {
      // Using Bootstrap modal API
      (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
    }
  }

  calculateTotal(): number {
    if (!this.maid || !this.bookingForm.get('duration')?.value) {
      return 0;
    }
    const duration = parseInt(this.bookingForm.get('duration')?.value);
    return this.maid.hourlyRate * duration;
  }

  toggleFavorite(): void {
    if (this.maid) {
      this.favoritesService.toggleFavorite(this.maid.id).subscribe({
        next: (success) => {
          if (success) {
            this.isFavorite = !this.isFavorite;
            this.toastr.success(
              this.isFavorite ? 'Added to favorites' : 'Removed from favorites',
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
  }

  submitBooking(): void {
    if (this.bookingForm.valid && this.maid) {
      this.isLoading = true;
      
      const bookingData = {
        id: Date.now(),
        employerId: 1, // Mock user ID
        maidId: this.maid.id,
        maidName: `${this.maid.firstName} ${this.maid.lastName}`,
        maidPhoto: this.maid.profileImage,
        maidNationality: this.maid.nationality,
        maidRating: this.maid.rating,
        startDate: new Date(this.bookingForm.get('serviceDate')?.value + 'T' + this.bookingForm.get('serviceTime')?.value),
        endDate: new Date(new Date(this.bookingForm.get('serviceDate')?.value + 'T' + this.bookingForm.get('serviceTime')?.value).getTime() + (parseInt(this.bookingForm.get('duration')?.value) * 60 * 60 * 1000)),
        duration: parseInt(this.bookingForm.get('duration')?.value),
        hourlyRate: this.maid.hourlyRate,
        totalAmount: this.calculateTotal(),
        status: 'pending',
        workType: this.bookingForm.get('serviceType')?.value,
        description: this.bookingForm.get('specialInstructions')?.value || 'No special instructions',
        location: {
          address: '123 Main Street, Dubai',
          city: 'Dubai',
          country: 'UAE'
        },
        specialRequirements: this.bookingForm.get('specialInstructions')?.value || 'None',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Booking submitted successfully!', 'Booking Confirmed');
          this.router.navigate(['/profile-dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating booking:', error);
          this.toastr.error('Failed to create booking', 'Error');
        }
      });
    }
  }

  getRatingPercentage(rating: number): number {
    // Mock data for rating distribution
    const distribution = { 5: 70, 4: 20, 3: 7, 2: 2, 1: 1 };
    return distribution[rating as keyof typeof distribution] || 0;
  }

  getRatingCount(rating: number): number {
    if (!this.maid) return 0;
    const distribution = { 5: 70, 4: 20, 3: 7, 2: 2, 1: 1 };
    const percentage = distribution[rating as keyof typeof distribution] || 0;
    return Math.round((this.maid.totalReviews * percentage) / 100);
  }
}
