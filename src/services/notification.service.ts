import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title || 'Success');
  }

  showError(message: string, title?: string): void {
    this.toastr.error(message, title || 'Error');
  }

  showWarning(message: string, title?: string): void {
    this.toastr.warning(message, title || 'Warning');
  }

  showInfo(message: string, title?: string): void {
    this.toastr.info(message, title || 'Info');
  }

  showBookingConfirmation(maidName: string, date: string): void {
    this.showSuccess(`Booking confirmed with ${maidName} for ${date}`, 'Booking Confirmed');
  }

  showBookingCancellation(maidName: string): void {
    this.showWarning(`Booking with ${maidName} has been cancelled`, 'Booking Cancelled');
  }

  showSubscriptionSuccess(planName: string): void {
    this.showSuccess(`Successfully subscribed to ${planName}`, 'Subscription Active');
  }

  showPaymentSuccess(amount: number): void {
    this.showSuccess(`Payment of $${amount} processed successfully`, 'Payment Successful');
  }

  showPaymentError(error: string): void {
    this.showError(`Payment failed: ${error}`, 'Payment Error');
  }

  showProfileUpdateSuccess(): void {
    this.showSuccess('Profile updated successfully', 'Profile Updated');
  }

  showLoginSuccess(userName: string): void {
    this.showSuccess(`Welcome back, ${userName}!`, 'Login Successful');
  }

  showRegistrationSuccess(): void {
    this.showSuccess('Account created successfully! Please verify your email.', 'Registration Successful');
  }

  showLogoutSuccess(): void {
    this.showInfo('You have been logged out successfully', 'Logout');
  }

  showAccessDenied(): void {
    this.showError('You need a subscription to access this feature', 'Access Denied');
  }

  showNetworkError(): void {
    this.showError('Network error. Please check your connection and try again.', 'Connection Error');
  }

  showValidationError(errors: string[]): void {
    const errorMessage = errors.join(', ');
    this.showError(errorMessage, 'Validation Error');
  }
}
