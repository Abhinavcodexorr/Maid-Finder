import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking, BookingRequest, Review } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor() { }

  createBooking(bookingRequest: BookingRequest): Observable<Booking> {
    const booking: Booking = { id: Math.random(), status: 'confirmed', ...bookingRequest } as any;
    return of(booking).pipe(delay(300));
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    const now = new Date();
    const mock: Booking[] = [
      {
        id: 101,
        employerId: userId,
        maidId: 1,
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9),
        duration: 8,
        hourlyRate: 25,
        totalAmount: 200,
        status: 'completed',
        workType: 'House Cleaning',
        description: 'General home cleaning',
        location: { address: 'Dubai Marina', city: 'Dubai', country: 'UAE' },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 102,
        employerId: userId,
        maidId: 2,
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        duration: 4,
        hourlyRate: 30,
        totalAmount: 120,
        status: 'confirmed',
        workType: 'Child Care',
        description: 'Evening babysitting',
        location: { address: 'Downtown', city: 'Dubai', country: 'UAE' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    return of(mock).pipe(delay(200));
  }

  getMaidBookings(maidId: number): Observable<Booking[]> {
    return of([]).pipe(delay(200));
  }

  getBookingById(id: number): Observable<Booking> {
    return of({ id } as any).pipe(delay(150));
  }

  updateBookingStatus(id: number, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'): Observable<Booking> {
    return of({ id, status } as any).pipe(delay(200));
  }

  cancelBooking(id: number, reason: string): Observable<Booking> {
    return of({ id, status: 'cancelled', reason } as any).pipe(delay(200));
  }

  completeBooking(id: number): Observable<Booking> {
    return of({ id, status: 'completed' } as any).pipe(delay(200));
  }

  getBookingReviews(bookingId: number): Observable<Review[]> {
    return of([]).pipe(delay(150));
  }

  addBookingReview(bookingId: number, reviewData: {
    rating: number;
    comment: string;
  }): Observable<Review> {
    return of({ id: Math.random(), ...reviewData } as any).pipe(delay(150));
  }

  getAvailableTimeSlots(maidId: number, date: string): Observable<string[]> {
    return of(['09:00', '11:00', '13:00', '15:00']).pipe(delay(100));
  }

  checkBookingConflicts(maidId: number, startDate: Date, endDate: Date): Observable<{ hasConflict: boolean; conflictingBookings?: Booking[] }> {
    return of({ hasConflict: false }).pipe(delay(150));
  }

  getBookingStatistics(userId: number): Observable<{
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalEarnings: number;
    averageRating: number;
  }> {
    return of({ totalBookings: 0, completedBookings: 0, cancelledBookings: 0, totalEarnings: 0, averageRating: 0 }).pipe(delay(150));
  }
}
