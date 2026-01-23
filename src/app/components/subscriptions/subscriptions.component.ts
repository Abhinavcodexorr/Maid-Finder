import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any[] = [];
  isLoading = false;
  currentUser: any = null;

  constructor() {}

  ngOnInit(): void {
    this.loadSubscriptions();
    // Mock current user
    this.currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
  }

  loadSubscriptions(): void {
    this.isLoading = true;
    
    // Mock subscription data
    setTimeout(() => {
      this.subscriptions = [
        {
          id: 1,
          name: 'Basic Plan',
          price: 99,
          duration: 30,
          description: 'Perfect for occasional maid services',
          isPopular: false,
          features: [
            'Access to 50 maid profiles',
            'Basic contact information',
            'Email support',
            '30-day access'
          ]
        },
        {
          id: 2,
          name: 'Premium Plan',
          price: 199,
          duration: 30,
          description: 'Best value for regular maid services',
          isPopular: true,
          features: [
            'Access to all maid profiles',
            'Direct phone numbers',
            'Priority customer support',
            'Advanced search filters',
            '30-day access'
          ]
        },
        {
          id: 3,
          name: 'Family Plan',
          price: 299,
          duration: 30,
          description: 'Unlimited access for large families',
          isPopular: false,
          features: [
            'Unlimited maid profiles',
            'Direct phone numbers',
            '24/7 customer support',
            'Advanced search filters',
            'Booking assistance',
            '30-day access'
          ]
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  purchaseSubscription(subscriptionId: number): void {
    if (!this.currentUser) {
      alert('Please login to purchase a subscription');
      return;
    }

    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (subscription) {
      // Mock payment process
      alert(`Purchasing ${subscription.name} for AED ${subscription.price}... (This is a demo)`);
    }
  }
}
