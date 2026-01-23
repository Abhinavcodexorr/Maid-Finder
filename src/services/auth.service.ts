import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check for stored user on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    const mockUser: User = {
      id: 1,
      name: 'Demo User',
      email,
      phone: '+971500000000',
      role: 'employer',
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    return of({ user: mockUser, token: 'mock-token' }).pipe(
      delay(400),
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'employer' | 'maid';
  }): Observable<{ user: User; token: string }> {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    return of({ user: newUser, token: 'mock-token' }).pipe(
      delay(500),
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateProfile(userId: number, profileData: Partial<User>): Observable<User> {
    const updatedUser = { ...(this.currentUserSubject.value as User), ...profileData, updatedAt: new Date() } as User;
    return of(updatedUser).pipe(
      delay(300),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  forgotPassword(email: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }
}
