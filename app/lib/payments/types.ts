/**
 * Multi-Provider Payment System Types
 * 
 * This file defines the interfaces and types for a provider-agnostic
 * payment system that supports multiple payment gateways.
 */

// Supported payment providers
export type PaymentProviderType = 'stripe' | 'paypal' | 'square' | 'zalopay';

// Generic customer data structure
export interface CustomerData {
  id?: string;
  email: string;
  name?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

// Generic product data structure
export interface ProductData {
  id?: string;
  name: string;
  description: string;
  type: 'saas' | 'digital_download' | 'course' | 'bundle';
  category?: string;
  features?: string[];
  metadata?: Record<string, any>;
  isActive: boolean;
}

// Generic plan data structure
export interface PlanData {
  id?: string;
  productId: string;
  name: string;
  type: 'one_time' | 'recurring';
  interval?: 'month' | 'year';
  intervalCount?: number;
  amount: number; // in cents
  currency: string;
  trialPeriodDays?: number;
  features?: string[];
  limits?: Record<string, any>;
  isActive: boolean;
  sortOrder?: number;
}

// Generic checkout session configuration
export interface CheckoutSessionConfig {
  planId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  trialPeriodDays?: number;
  metadata?: Record<string, any>;
}

// Generic checkout session result
export interface CheckoutSessionResult {
  id: string;
  url?: string;
  clientSecret?: string; // For some providers like Stripe Elements
}

// Generic subscription data
export interface SubscriptionData {
  id?: string;
  customerId: string;
  productId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'paused';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  canceledAt?: Date;
  cancelAtPeriodEnd?: boolean;
  usageData?: Record<string, any>;
}

// Generic order data
export interface OrderData {
  id?: string;
  customerId: string;
  productId: string;
  planId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'canceled';
  amount: number; // in cents
  currency: string;
  downloadUrl?: string;
  downloadExpiresAt?: Date;
  accessGranted?: boolean;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
}

// Generic webhook event data
export interface WebhookEventData {
  id: string;
  type: string;
  data: Record<string, any>;
  provider: PaymentProviderType;
}

// Provider configuration interface
export interface ProviderConfig {
  type: PaymentProviderType;
  apiKey: string;
  publishableKey?: string;
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
  additionalConfig?: Record<string, any>;
}

// Provider-specific IDs for tracking
export interface ProviderIds {
  customerId?: string;
  productId?: string;
  planId?: string;
  subscriptionId?: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
}

// Error types for payment operations
export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error' | 'rate_limit_error';
  provider: PaymentProviderType;
  raw?: any; // Provider-specific error object
}

// Result wrapper for payment operations
export interface PaymentResult<T> {
  success: boolean;
  data?: T;
  error?: PaymentError;
  providerData?: any; // Raw provider response for advanced use cases
}

// Provider capabilities interface
export interface ProviderCapabilities {
  supportsSubscriptions: boolean;
  supportsOneTimePayments: boolean;
  supportsRefunds: boolean;
  supportsTrials: boolean;
  supportsUsageBased: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  requiresWebhooks: boolean;
  supportsPaymentMethods: string[]; // 'card', 'bank_transfer', 'digital_wallet', etc.
}

// Payment method information
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'digital_wallet' | 'crypto';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Refund request interface
export interface RefundRequest {
  orderId?: string;
  subscriptionId?: string;
  amount?: number; // in cents, partial refund if specified
  reason?: string;
  metadata?: Record<string, any>;
}

// Refund result interface
export interface RefundResult {
  id: string;
  amount: number; // in cents
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  reason?: string;
  createdAt: Date;
}

// Usage-based billing data (for future enhancement)
export interface UsageRecord {
  subscriptionId: string;
  quantity: number;
  timestamp: Date;
  action: 'increment' | 'set';
  idempotencyKey?: string;
}

// Analytics data structure (for provider comparison)
export interface PaymentAnalytics {
  provider: PaymentProviderType;
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionTime: number;
  failureReasons: Record<string, number>;
  period: {
    start: Date;
    end: Date;
  };
}