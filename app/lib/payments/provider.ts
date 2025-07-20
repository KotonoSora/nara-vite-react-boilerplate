/**
 * Payment Provider Interface
 * 
 * This file defines the abstract interface that all payment providers must implement.
 * This ensures a consistent API across different payment gateways.
 */

import type {
  PaymentProviderType,
  CustomerData,
  ProductData,
  PlanData,
  CheckoutSessionConfig,
  CheckoutSessionResult,
  SubscriptionData,
  OrderData,
  WebhookEventData,
  PaymentResult,
  ProviderCapabilities,
  PaymentMethod,
  RefundRequest,
  RefundResult,
  UsageRecord,
  ProviderConfig,
  ProviderIds
} from './types';

/**
 * Abstract base class for payment providers
 * All payment providers must extend this class and implement all methods
 */
export abstract class PaymentProvider {
  protected config: ProviderConfig;
  protected initialized: boolean = false;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Get the provider type
   */
  abstract getProviderType(): PaymentProviderType;

  /**
   * Get provider capabilities
   */
  abstract getCapabilities(): ProviderCapabilities;

  /**
   * Initialize the provider (set up SDK, validate config, etc.)
   */
  abstract initialize(): Promise<void>;

  /**
   * Get provider-specific configuration for frontend
   * (publishable keys, client configuration, etc.)
   */
  abstract getClientConfig(): Record<string, any>;

  // Customer Management
  
  /**
   * Create a new customer
   */
  abstract createCustomer(data: CustomerData): Promise<PaymentResult<CustomerData & ProviderIds>>;

  /**
   * Get customer by ID
   */
  abstract getCustomer(customerId: string): Promise<PaymentResult<CustomerData & ProviderIds>>;

  /**
   * Update customer information
   */
  abstract updateCustomer(customerId: string, data: Partial<CustomerData>): Promise<PaymentResult<CustomerData & ProviderIds>>;

  /**
   * Delete customer
   */
  abstract deleteCustomer(customerId: string): Promise<PaymentResult<boolean>>;

  // Product Management

  /**
   * Create a product
   */
  abstract createProduct(data: ProductData): Promise<PaymentResult<ProductData & ProviderIds>>;

  /**
   * Get product by ID
   */
  abstract getProduct(productId: string): Promise<PaymentResult<ProductData & ProviderIds>>;

  /**
   * Update product
   */
  abstract updateProduct(productId: string, data: Partial<ProductData>): Promise<PaymentResult<ProductData & ProviderIds>>;

  /**
   * Delete product
   */
  abstract deleteProduct(productId: string): Promise<PaymentResult<boolean>>;

  // Plan Management

  /**
   * Create a pricing plan
   */
  abstract createPlan(data: PlanData): Promise<PaymentResult<PlanData & ProviderIds>>;

  /**
   * Get plan by ID
   */
  abstract getPlan(planId: string): Promise<PaymentResult<PlanData & ProviderIds>>;

  /**
   * Update plan
   */
  abstract updatePlan(planId: string, data: Partial<PlanData>): Promise<PaymentResult<PlanData & ProviderIds>>;

  /**
   * Delete plan
   */
  abstract deletePlan(planId: string): Promise<PaymentResult<boolean>>;

  // Payment Processing

  /**
   * Create a checkout session for payment
   */
  abstract createCheckoutSession(config: CheckoutSessionConfig): Promise<PaymentResult<CheckoutSessionResult>>;

  /**
   * Create a subscription
   */
  abstract createSubscription(customerId: string, planId: string, options?: {
    trialPeriodDays?: number;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>>;

  /**
   * Create a one-time order
   */
  abstract createOrder(customerId: string, planId: string, options?: {
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<OrderData & ProviderIds>>;

  // Subscription Management

  /**
   * Get subscription by ID
   */
  abstract getSubscription(subscriptionId: string): Promise<PaymentResult<SubscriptionData & ProviderIds>>;

  /**
   * Get all subscriptions for a customer
   */
  abstract getCustomerSubscriptions(customerId: string): Promise<PaymentResult<(SubscriptionData & ProviderIds)[]>>;

  /**
   * Update subscription (change plan, pause, etc.)
   */
  abstract updateSubscription(subscriptionId: string, options: {
    planId?: string;
    cancelAtPeriodEnd?: boolean;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>>;

  /**
   * Cancel subscription
   */
  abstract cancelSubscription(subscriptionId: string, options?: {
    cancelAtPeriodEnd?: boolean;
    reason?: string;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>>;

  // Order Management

  /**
   * Get order by ID
   */
  abstract getOrder(orderId: string): Promise<PaymentResult<OrderData & ProviderIds>>;

  /**
   * Get all orders for a customer
   */
  abstract getCustomerOrders(customerId: string): Promise<PaymentResult<(OrderData & ProviderIds)[]>>;

  /**
   * Update order status or metadata
   */
  abstract updateOrder(orderId: string, updates: Partial<OrderData>): Promise<PaymentResult<OrderData & ProviderIds>>;

  // Payment Methods

  /**
   * Get customer payment methods
   */
  abstract getCustomerPaymentMethods(customerId: string): Promise<PaymentResult<PaymentMethod[]>>;

  /**
   * Add payment method to customer
   */
  abstract addPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentResult<PaymentMethod>>;

  /**
   * Remove payment method from customer
   */
  abstract removePaymentMethod(paymentMethodId: string): Promise<PaymentResult<boolean>>;

  /**
   * Set default payment method for customer
   */
  abstract setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentResult<boolean>>;

  // Refunds

  /**
   * Process a refund
   */
  abstract processRefund(request: RefundRequest): Promise<PaymentResult<RefundResult>>;

  /**
   * Get refund by ID
   */
  abstract getRefund(refundId: string): Promise<PaymentResult<RefundResult>>;

  // Usage-Based Billing (for providers that support it)

  /**
   * Record usage for subscription
   */
  abstract recordUsage(record: UsageRecord): Promise<PaymentResult<boolean>>;

  /**
   * Get usage records for subscription
   */
  abstract getUsageRecords(subscriptionId: string, options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<PaymentResult<UsageRecord[]>>;

  // Webhook Handling

  /**
   * Verify webhook signature and parse event
   */
  abstract verifyWebhook(payload: string, signature: string): Promise<PaymentResult<WebhookEventData>>;

  /**
   * Process webhook event
   */
  abstract processWebhookEvent(event: WebhookEventData): Promise<PaymentResult<any>>;

  // Utility Methods

  /**
   * Check if provider is properly configured and initialized
   */
  isConfigured(): boolean {
    return this.initialized && !!this.config.apiKey;
  }

  /**
   * Get provider configuration (safe - no secrets)
   */
  getConfig(): Omit<ProviderConfig, 'apiKey' | 'webhookSecret'> {
    return {
      type: this.config.type,
      publishableKey: this.config.publishableKey,
      environment: this.config.environment,
      additionalConfig: this.config.additionalConfig
    };
  }

  /**
   * Format amount for display (helper method)
   */
  formatAmount(amount: number, currency = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  }

  /**
   * Convert dollars to cents
   */
  toCents(dollars: number): number {
    return Math.round(dollars * 100);
  }

  /**
   * Convert cents to dollars
   */
  toDollars(cents: number): number {
    return cents / 100;
  }

  /**
   * Create standardized error result
   */
  protected createErrorResult<T>(error: any, message?: string): PaymentResult<T> {
    return {
      success: false,
      error: {
        code: error.code || 'unknown_error',
        message: message || error.message || 'An unknown error occurred',
        type: error.type || 'api_error',
        provider: this.getProviderType(),
        raw: error
      }
    };
  }

  /**
   * Create standardized success result
   */
  protected createSuccessResult<T>(data: T, providerData?: any): PaymentResult<T> {
    return {
      success: true,
      data,
      providerData
    };
  }
}