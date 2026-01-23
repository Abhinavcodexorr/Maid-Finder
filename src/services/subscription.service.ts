import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Subscription, UserSubscription, Payment } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor() { }

  getAllSubscriptions(): Observable<Subscription[]> {
    const plans: Subscription[] = [
      { id: 1, name: 'Basic', description: 'Good for starters', duration: 30, price: 49, features: ['View profiles', 'Basic support'], isPopular: false, isActive: true },
      { id: 2, name: 'Pro', description: 'Best value for regulars', duration: 90, price: 129, features: ['Priority access', 'Unlimited messaging', 'Priority support'], isPopular: true, isActive: true },
      { id: 3, name: 'Enterprise', description: 'For organizations', duration: 365, price: 399, features: ['Dedicated support', 'Custom features'], isPopular: false, isActive: true }
    ];
    return of(plans).pipe(delay(200));
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.getAllSubscriptions().pipe(
      delay(0),
      map((plans: Subscription[]) => plans.find((p: Subscription) => p.id === id) || plans[0])
    );
  }

  getUserSubscriptions(userId: number): Observable<UserSubscription[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 20);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    const subs: UserSubscription[] = [
      {
        id: 1001,
        userId,
        subscriptionId: 2,
        startDate,
        endDate,
        isActive: endDate > new Date(),
        paymentStatus: 'completed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN-USER-' + userId + '-1001',
        createdAt: startDate,
        updatedAt: new Date()
      }
    ];
    return of(subs).pipe(delay(200));
  }

  getActiveUserSubscription(userId: number): Observable<UserSubscription | null> {
    return this.getUserSubscriptions(userId).pipe(
      delay(0),
      map((items: UserSubscription[]) => items.find((s: UserSubscription) => s.isActive) || null)
    );
  }

  purchaseSubscription(userId: number, subscriptionId: number, paymentData: {
    paymentMethod: string;
    cardDetails?: any;
  }): Observable<{ subscription: UserSubscription; payment: Payment }> {
    const startDate = new Date();
    const subscription: UserSubscription = {
      id: Math.floor(Math.random() * 100000),
      userId,
      subscriptionId,
      startDate,
      endDate: new Date(startDate.getTime()),
      isActive: true,
      paymentStatus: 'completed',
      paymentMethod: 'credit_card',
      transactionId: 'TXN-' + Math.floor(Math.random() * 1000000),
      createdAt: startDate
    } as any;
    const payment: Payment = {
      id: Math.floor(Math.random() * 100000),
      userId,
      subscriptionId,
      amount: 129,
      currency: 'AED',
      paymentMethod: 'credit_card',
      status: 'completed',
      transactionId: subscription.transactionId,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    return of({ subscription, payment }).pipe(delay(400));
  }

  cancelSubscription(subscriptionId: number): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  renewSubscription(subscriptionId: number, paymentData: {
    paymentMethod: string;
    cardDetails?: any;
  }): Observable<{ subscription: UserSubscription; payment: Payment }> {
    const startDate = new Date();
    const subscription: UserSubscription = {
      id: subscriptionId,
      userId: 1,
      subscriptionId,
      startDate,
      endDate: new Date(startDate.getTime()),
      isActive: true,
      paymentStatus: 'completed',
      paymentMethod: paymentData.paymentMethod,
      transactionId: 'TXN-RENEW-' + Math.floor(Math.random() * 1000000),
      createdAt: startDate
    } as any;
    const payment: Payment = {
      id: Math.floor(Math.random() * 100000),
      userId: 1,
      subscriptionId,
      amount: 129,
      currency: 'AED',
      paymentMethod: 'credit_card',
      status: 'completed',
      transactionId: subscription.transactionId,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any;
    return of({ subscription, payment }).pipe(delay(400));
  }

  checkSubscriptionAccess(userId: number): Observable<{ hasAccess: boolean; subscription?: UserSubscription }> {
    return of({ hasAccess: true }).pipe(delay(150));
  }

  getPaymentHistory(userId: number): Observable<Payment[]> {
    const payments: Payment[] = [
      { id: 9001, userId, subscriptionId: 2, amount: 129, currency: 'AED', paymentMethod: 'credit_card', status: 'completed', transactionId: 'TXN-USER-' + userId + '-P1', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)), updatedAt: new Date() },
      { id: 9002, userId, subscriptionId: 2, amount: 129, currency: 'AED', paymentMethod: 'credit_card', status: 'completed', transactionId: 'TXN-USER-' + userId + '-P2', createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)), updatedAt: new Date() }
    ];
    return of(payments).pipe(delay(200));
  }

  processRefund(paymentId: number, reason: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  validatePromoCode(code: string): Observable<{ valid: boolean; discount?: number; message?: string }> {
    const valid = code.toLowerCase() === 'save10';
    return of({ valid, discount: valid ? 10 : 0, message: valid ? 'Promo applied' : 'Invalid code' }).pipe(delay(300));
  }
}
