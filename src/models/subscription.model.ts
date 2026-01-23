export interface Subscription {
  id: number;
  name: string;
  description: string;
  duration: number; // in days
  price: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export interface UserSubscription {
  id: number;
  userId: number;
  subscriptionId: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  userId: number;
  subscriptionId?: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  description?: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}
