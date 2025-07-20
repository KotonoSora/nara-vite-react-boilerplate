/**
 * ZaloPay Payment Provider Implementation
 * 
 * This file implements the PaymentProvider interface for ZaloPay,
 * a popular Vietnamese e-wallet and payment platform.
 */

import { PaymentProvider } from '../provider';
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
  ProviderIds
} from '../types';

/**
 * Safely parse integer with validation, returning default value on error
 */
function safeParseInt(value: string | undefined | null, defaultValue: number = 0): number {
  if (!value) return defaultValue;
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Safely parse JSON with error handling
 */
function safeJsonParse<T = any>(jsonString: string | undefined | null): T | undefined {
  if (!jsonString) return undefined;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.warn('Failed to parse JSON metadata:', error);
    return undefined;
  }
}

/**
 * ZaloPay API interface for type safety
 */
interface ZaloPayConfig {
  appId: string;
  key1: string;
  key2: string;
  endpoint: string;
}

interface ZaloPayOrderRequest {
  app_id: string;
  app_trans_id: string;
  app_user: string;
  app_time: number;
  item: string;
  embed_data: string;
  amount: number;
  description: string;
  bank_code?: string;
  mac: string;
  callback_url: string;
}

interface ZaloPayOrderResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  order_url?: string;
  zp_trans_token?: string;
  order_token?: string;
}

interface ZaloPayQueryRequest {
  app_id: string;
  app_trans_id: string;
  mac: string;
}

interface ZaloPayQueryResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  is_processing: boolean;
  amount: number;
  zp_trans_id?: string;
}

interface ZaloPayRefundRequest {
  app_id: string;
  zp_trans_id: string;
  amount: number;
  description: string;
  timestamp: number;
  mac: string;
}

interface ZaloPayRefundResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  refund_id?: string;
}

export class ZaloPayProvider extends PaymentProvider {
  private zaloPayConfig: ZaloPayConfig | null = null;

  async initialize(): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('ZaloPay App ID is required');
    }

    if (!this.config.additionalConfig?.key1 || !this.config.additionalConfig?.key2) {
      throw new Error('ZaloPay Key1 and Key2 are required');
    }

    this.zaloPayConfig = {
      appId: this.config.apiKey,
      key1: this.config.additionalConfig.key1,
      key2: this.config.additionalConfig.key2,
      endpoint: this.config.environment === 'production' 
        ? 'https://openapi.zalopay.vn' 
        : 'https://sb-openapi.zalopay.vn'
    };

    this.initialized = true;
  }

  getProviderType(): PaymentProviderType {
    return 'zalopay';
  }

  getCapabilities(): ProviderCapabilities {
    return {
      supportsSubscriptions: false, // ZaloPay doesn't support complex subscriptions like Stripe
      supportsOneTimePayments: true,
      supportsRefunds: true,
      supportsTrials: false, // No native trial support
      supportsUsageBased: false, // No usage-based billing
      supportedCurrencies: ['vnd'], // Vietnamese Dong
      supportedCountries: ['VN'], // Vietnam primarily
      requiresWebhooks: true,
      supportsPaymentMethods: ['digital_wallet', 'bank_transfer']
    };
  }

  getClientConfig(): Record<string, any> {
    return {
      appId: this.zaloPayConfig?.appId,
      provider: 'zalopay',
      environment: this.config.environment,
      endpoint: this.zaloPayConfig?.endpoint
    };
  }

  // Helper method to generate MAC for ZaloPay API calls
  private generateMac(data: string, key: string): string {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }

  // Helper method to make API calls to ZaloPay
  private async makeZaloPayRequest<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.zaloPayConfig?.endpoint}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    if (!response.ok) {
      throw new Error(`ZaloPay API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as T;
  }

  // Customer Management (ZaloPay doesn't have dedicated customer management)
  
  async createCustomer(data: CustomerData): Promise<PaymentResult<CustomerData & ProviderIds>> {
    // ZaloPay doesn't have a customer management system like Stripe
    // We'll store customer info locally and use email as identifier
    const customerWithIds: CustomerData & ProviderIds = {
      ...data,
      id: data.id ?? `zp_cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: data.email // Use email as ZaloPay customer identifier
    };

    return this.createSuccessResult(customerWithIds);
  }

  async getCustomer(customerId: string): Promise<PaymentResult<CustomerData & ProviderIds>> {
    // ZaloPay doesn't have customer retrieval API
    // This would typically be handled by your local database
    return this.createErrorResult(new Error('ZaloPay does not support customer retrieval API'));
  }

  async updateCustomer(customerId: string, data: Partial<CustomerData>): Promise<PaymentResult<CustomerData & ProviderIds>> {
    // ZaloPay doesn't have customer update API
    return this.createErrorResult(new Error('ZaloPay does not support customer update API'));
  }

  async deleteCustomer(customerId: string): Promise<PaymentResult<boolean>> {
    // ZaloPay doesn't have customer deletion API
    return this.createErrorResult(new Error('ZaloPay does not support customer deletion API'));
  }

  // Product Management (ZaloPay doesn't have product management)

  async createProduct(data: ProductData): Promise<PaymentResult<ProductData & ProviderIds>> {
    // ZaloPay doesn't have product management like Stripe
    // Products are managed locally, payments are created per transaction
    const productWithIds: ProductData & ProviderIds = {
      ...data,
      id: data.id ?? `zp_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: `zp_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return this.createSuccessResult(productWithIds);
  }

  async getProduct(productId: string): Promise<PaymentResult<ProductData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support product retrieval API'));
  }

  async updateProduct(productId: string, data: Partial<ProductData>): Promise<PaymentResult<ProductData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support product update API'));
  }

  async deleteProduct(productId: string): Promise<PaymentResult<boolean>> {
    return this.createErrorResult(new Error('ZaloPay does not support product deletion API'));
  }

  // Plan Management

  async createPlan(data: PlanData): Promise<PaymentResult<PlanData & ProviderIds>> {
    if (data.type === 'recurring') {
      return this.createErrorResult(new Error('ZaloPay does not support recurring plans'));
    }

    const planWithIds: PlanData & ProviderIds = {
      ...data,
      id: data.id ?? `zp_plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      planId: `zp_plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return this.createSuccessResult(planWithIds);
  }

  async getPlan(planId: string): Promise<PaymentResult<PlanData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support plan retrieval API'));
  }

  async updatePlan(planId: string, data: Partial<PlanData>): Promise<PaymentResult<PlanData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support plan update API'));
  }

  async deletePlan(planId: string): Promise<PaymentResult<boolean>> {
    return this.createErrorResult(new Error('ZaloPay does not support plan deletion API'));
  }

  // Payment Processing

  async createCheckoutSession(config: CheckoutSessionConfig): Promise<PaymentResult<CheckoutSessionResult>> {
    try {
      if (!this.zaloPayConfig) {
        throw new Error('ZaloPay not initialized');
      }

      const transId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const appTransId = `${this.zaloPayConfig.appId}_${transId}`;
      
      // For demo purposes, using a fixed amount - in real implementation,
      // you'd fetch plan details to get the actual amount
      const amount = 100000; // 100,000 VND as example
      const appTime = Date.now();

      const embedData = JSON.stringify({
        planId: config.planId,
        customerId: config.customerId,
        customerEmail: config.customerEmail,
        metadata: config.metadata ?? {}
      });

      const item = JSON.stringify([{
        id: config.planId,
        name: 'Product Purchase',
        quantity: 1,
        price: amount
      }]);

      // Generate MAC for request authentication
      const macData = `${this.zaloPayConfig.appId}|${appTransId}|${config.customerEmail ?? 'user'}|${amount}|${appTime}|${embedData}|${item}`;
      const mac = this.generateMac(macData, this.zaloPayConfig.key1);

      const orderRequest: ZaloPayOrderRequest = {
        app_id: this.zaloPayConfig.appId,
        app_trans_id: appTransId,
        app_user: config.customerEmail ?? `user_${Date.now()}`,
        app_time: appTime,
        item,
        embed_data: embedData,
        amount,
        description: 'Payment for digital product',
        mac,
        callback_url: config.successUrl,
        bank_code: 'zalopayapp' // Use ZaloPay app as default
      };

      const response = await this.makeZaloPayRequest<ZaloPayOrderResponse>('/v2/create', orderRequest);

      if (response.return_code === 1) {
        return this.createSuccessResult({
          id: appTransId,
          url: response.order_url,
          clientSecret: response.order_token
        });
      } else {
        throw new Error(response.return_message || 'Failed to create ZaloPay order');
      }

    } catch (error) {
      return this.createErrorResult(error, 'Failed to create checkout session');
    }
  }

  async createSubscription(customerId: string, planId: string, options?: {
    trialPeriodDays?: number;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support subscriptions'));
  }

  async createOrder(customerId: string, planId: string, options?: {
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<OrderData & ProviderIds>> {
    try {
      if (!this.zaloPayConfig) {
        throw new Error('ZaloPay not initialized');
      }

      // Create a checkout session and convert to order format
      const checkoutResult = await this.createCheckoutSession({
        planId,
        customerId,
        successUrl: '/success',
        cancelUrl: '/cancel',
        metadata: options?.metadata
      });

      if (!checkoutResult.success || !checkoutResult.data) {
        return this.createErrorResult(new Error('Failed to create ZaloPay checkout'));
      }

      const orderWithIds: OrderData & ProviderIds = {
        id: checkoutResult.data.id,
        customerId,
        productId: planId,
        planId,
        status: 'pending',
        amount: 100000, // This should be fetched from plan details
        currency: 'vnd',
        paymentIntentId: checkoutResult.data.id
      };

      return this.createSuccessResult(orderWithIds);

    } catch (error) {
      return this.createErrorResult(error, 'Failed to create order');
    }
  }

  // Subscription Management (Not supported)

  async getSubscription(subscriptionId: string): Promise<PaymentResult<SubscriptionData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support subscriptions'));
  }

  async getCustomerSubscriptions(customerId: string): Promise<PaymentResult<(SubscriptionData & ProviderIds)[]>> {
    return this.createErrorResult(new Error('ZaloPay does not support subscriptions'));
  }

  async updateSubscription(subscriptionId: string, options: {
    planId?: string;
    cancelAtPeriodEnd?: boolean;
    metadata?: Record<string, any>;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support subscriptions'));
  }

  async cancelSubscription(subscriptionId: string, options?: {
    cancelAtPeriodEnd?: boolean;
    reason?: string;
  }): Promise<PaymentResult<SubscriptionData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support subscriptions'));
  }

  // Order Management

  async getOrder(orderId: string): Promise<PaymentResult<OrderData & ProviderIds>> {
    try {
      if (!this.zaloPayConfig) {
        throw new Error('ZaloPay not initialized');
      }

      const macData = `${this.zaloPayConfig.appId}|${orderId}`;
      const mac = this.generateMac(macData, this.zaloPayConfig.key1);

      const queryRequest: ZaloPayQueryRequest = {
        app_id: this.zaloPayConfig.appId,
        app_trans_id: orderId,
        mac
      };

      const response = await this.makeZaloPayRequest<ZaloPayQueryResponse>('/v2/query', queryRequest);

      if (response.return_code === 1) {
        const orderWithIds: OrderData & ProviderIds = {
          id: orderId,
          customerId: 'unknown', // ZaloPay doesn't return customer info
          productId: 'unknown',
          planId: 'unknown',
          status: response.is_processing ? 'pending' : 'succeeded',
          amount: response.amount,
          currency: 'vnd',
          paymentIntentId: response.zp_trans_id
        };

        return this.createSuccessResult(orderWithIds);
      } else {
        return this.createErrorResult(new Error(response.return_message || 'Order not found'));
      }

    } catch (error) {
      return this.createErrorResult(error, 'Failed to get order');
    }
  }

  async getCustomerOrders(customerId: string): Promise<PaymentResult<(OrderData & ProviderIds)[]>> {
    return this.createErrorResult(new Error('ZaloPay does not support customer order history API'));
  }

  async updateOrder(orderId: string, updates: Partial<OrderData>): Promise<PaymentResult<OrderData & ProviderIds>> {
    return this.createErrorResult(new Error('ZaloPay does not support order update API'));
  }

  // Payment Methods (Not applicable for ZaloPay)

  async getCustomerPaymentMethods(customerId: string): Promise<PaymentResult<PaymentMethod[]>> {
    return this.createErrorResult(new Error('ZaloPay does not support payment method management'));
  }

  async addPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentResult<PaymentMethod>> {
    return this.createErrorResult(new Error('ZaloPay does not support payment method management'));
  }

  async removePaymentMethod(paymentMethodId: string): Promise<PaymentResult<boolean>> {
    return this.createErrorResult(new Error('ZaloPay does not support payment method management'));
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentResult<boolean>> {
    return this.createErrorResult(new Error('ZaloPay does not support payment method management'));
  }

  // Refunds

  async processRefund(request: RefundRequest): Promise<PaymentResult<RefundResult>> {
    try {
      if (!this.zaloPayConfig) {
        throw new Error('ZaloPay not initialized');
      }

      if (!request.orderId) {
        return this.createErrorResult(new Error('Order ID is required for ZaloPay refunds'));
      }

      // First query the order to get ZaloPay transaction ID
      const orderResult = await this.getOrder(request.orderId);
      if (!orderResult.success || !orderResult.data?.paymentIntentId) {
        return this.createErrorResult(new Error('Unable to find ZaloPay transaction ID'));
      }

      const timestamp = Date.now();
      const refundAmount = request.amount ?? orderResult.data.amount;
      
      const macData = `${this.zaloPayConfig.appId}|${orderResult.data.paymentIntentId}|${refundAmount}|${request.reason ?? ''}|${timestamp}`;
      const mac = this.generateMac(macData, this.zaloPayConfig.key1);

      const refundRequest: ZaloPayRefundRequest = {
        app_id: this.zaloPayConfig.appId,
        zp_trans_id: orderResult.data.paymentIntentId,
        amount: refundAmount,
        description: request.reason ?? 'Refund request',
        timestamp,
        mac
      };

      const response = await this.makeZaloPayRequest<ZaloPayRefundResponse>('/v2/refund', refundRequest);

      if (response.return_code === 1) {
        const refundResult: RefundResult = {
          id: response.refund_id ?? `zp_refund_${timestamp}`,
          amount: refundAmount,
          currency: 'vnd',
          status: 'pending', // ZaloPay refunds are typically processed asynchronously
          reason: request.reason,
          createdAt: new Date()
        };

        return this.createSuccessResult(refundResult);
      } else {
        throw new Error(response.return_message || 'Refund failed');
      }

    } catch (error) {
      return this.createErrorResult(error, 'Failed to process refund');
    }
  }

  async getRefund(refundId: string): Promise<PaymentResult<RefundResult>> {
    return this.createErrorResult(new Error('ZaloPay does not support refund status query API'));
  }

  // Usage-Based Billing (Not supported)

  async recordUsage(record: UsageRecord): Promise<PaymentResult<boolean>> {
    return this.createErrorResult(new Error('ZaloPay does not support usage-based billing'));
  }

  async getUsageRecords(subscriptionId: string, options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<PaymentResult<UsageRecord[]>> {
    return this.createErrorResult(new Error('ZaloPay does not support usage-based billing'));
  }

  // Webhook Handling

  async verifyWebhook(payload: string, signature: string): Promise<PaymentResult<WebhookEventData>> {
    try {
      if (!this.zaloPayConfig) {
        throw new Error('ZaloPay not initialized');
      }

      // Parse the webhook payload
      const webhookData = safeJsonParse(payload);
      if (!webhookData) {
        throw new Error('Invalid webhook payload');
      }

      // Verify MAC signature
      const { data, mac } = webhookData;
      if (!data || !mac) {
        throw new Error('Missing required webhook fields');
      }

      const computedMac = this.generateMac(JSON.stringify(data), this.zaloPayConfig.key2);
      if (computedMac !== mac) {
        throw new Error('Invalid webhook signature');
      }

      const event: WebhookEventData = {
        id: data.app_trans_id || `zp_event_${Date.now()}`,
        type: this.mapZaloPayEventType(data),
        data: data,
        provider: 'zalopay'
      };

      return this.createSuccessResult(event);

    } catch (error) {
      return this.createErrorResult(error, 'Failed to verify webhook');
    }
  }

  async processWebhookEvent(event: WebhookEventData): Promise<PaymentResult<any>> {
    try {
      // Process different ZaloPay webhook events
      switch (event.type) {
        case 'payment.succeeded':
          // Handle successful payment
          return this.createSuccessResult({
            processed: true,
            type: 'payment_success',
            transactionId: event.data.zp_trans_id
          });

        case 'payment.failed':
          // Handle failed payment
          return this.createSuccessResult({
            processed: true,
            type: 'payment_failed',
            reason: event.data.reason
          });

        default:
          return this.createSuccessResult({
            processed: true,
            type: 'unknown_event',
            message: 'Event processed but no specific handler'
          });
      }

    } catch (error) {
      return this.createErrorResult(error, 'Failed to process webhook event');
    }
  }

  // Helper method to map ZaloPay status to standard event types
  private mapZaloPayEventType(data: any): string {
    if (data.status === 1) {
      return 'payment.succeeded';
    } else if (data.status === -1) {
      return 'payment.failed';
    }
    return 'payment.processing';
  }
}