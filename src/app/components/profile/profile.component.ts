import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  isEditing = false;
  showSuccessMessage = false;
  lastUpdated: Date | null = null;
  profileStats = {
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    memberSince: ''
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]]
    });
  }

  ngOnInit(): void {
    // Mock user data for demonstration
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
    
    this.profileForm.patchValue({
      name: this.currentUser?.name,
      email: this.currentUser?.email,
      phone: this.currentUser?.phone
    });

    // Load profile statistics
    this.loadProfileStats();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form to original values
      this.profileForm.patchValue({
        name: this.currentUser?.name,
        email: this.currentUser?.email,
        phone: this.currentUser?.phone
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      const formData = this.profileForm.value;

      // Mock update for demonstration
      setTimeout(() => {
        this.isLoading = false;
        this.isEditing = false;
        this.currentUser = { ...this.currentUser, ...formData, updatedAt: new Date() };
        this.lastUpdated = new Date();
        this.showSuccessMessage = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        
        console.log('Profile updated successfully!');
      }, 1000);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'Name must be at least 2 characters long';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  private loadProfileStats(): void {
    // Mock profile statistics
    this.profileStats = {
      totalBookings: 12,
      completedBookings: 8,
      totalSpent: 2400,
      memberSince: this.currentUser?.createdAt ? this.currentUser.createdAt.toLocaleDateString() : 'June 2023'
    };
  }

  // Method to handle profile updates
  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      const formData = this.profileForm.value;

      // Mock update for demonstration
      setTimeout(() => {
        this.isLoading = false;
        this.isEditing = false;
        this.currentUser = { ...this.currentUser, ...formData, updatedAt: new Date() };
        this.lastUpdated = new Date();
        this.showSuccessMessage = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        
        console.log('Profile updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Method to handle password change
  changePassword(): void {
    // Mock password change
    this.toastr.info('Password change functionality would be implemented here', 'Feature Coming Soon');
  }

  // Method to handle account deletion
  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.toastr.warning('Account deletion functionality would be implemented here', 'Feature Coming Soon');
    }
  }

  // Method to export profile data
  exportProfile(): void {
    this.toastr.info('Profile export functionality would be implemented here', 'Feature Coming Soon');
  }

  // Method to handle profile image upload (mock)
  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Mock image upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.currentUser) {
          this.currentUser.profileImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Method to get profile completion percentage
  getProfileCompletion(): number {
    if (!this.currentUser) return 0;
    
    let completed = 0;
    const total = 4; // name, email, phone, profileImage
    
    if (this.currentUser.name) completed++;
    if (this.currentUser.email) completed++;
    if (this.currentUser.phone) completed++;
    if (this.currentUser.profileImage) completed++;
    
    return Math.round((completed / total) * 100);
  }

  // Method to get account age
  getAccountAge(): string {
    if (!this.currentUser?.createdAt) return '0 days';
    
    const now = new Date();
    const created = new Date(this.currentUser.createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }
}
