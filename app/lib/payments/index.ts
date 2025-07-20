/**
 * Multi-Provider Payment System Main Export
 * 
 * This file provides the main entry point for the multi-provider payment system.
 * It exports all the necessary types, classes, and utilities for integrating
 * multiple payment providers into the NARA boilerplate.
 */

// Core exports
export { PaymentProvider } from './provider';
export { PaymentProviderFactory, providerFactory, registerMultipleProviders, getBestProviderForOperation, isSupportedProviderType, getProviderInfo } from './factory';

// Provider implementations
export { StripeProvider } from './providers/stripe';
export { PayPalProvider } from './providers/paypal';

// Type exports
export type {
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
  ProviderIds,
  PaymentError,
  PaymentAnalytics
} from './types';

/**
 * Multi-Provider Payment Service
 * 
 * This is the main service class that provides a high-level interface
 * for working with multiple payment providers.
 */
export class MultiProviderPaymentService {
  private factory: PaymentProviderFactory;

  constructor(factory?: PaymentProviderFactory) {
    this.factory = factory || providerFactory;
  }

  /**
   * Initialize the payment service with provider configurations
   */
  async initialize(configs: ProviderConfig[]): Promise<{
    successful: PaymentProviderType[];
    failed: { provider: PaymentProviderType; error: string }[];
  }> {
    return registerMultipleProviders(configs);
  }

  /**
   * Create a checkout session using the best available provider
   */
  async createCheckoutSession(
    config: CheckoutSessionConfig,
    preferredProvider?: PaymentProviderType
  ): Promise<PaymentResult<CheckoutSessionResult & { provider: PaymentProviderType }>> {
    const provider = getBestProviderForOperation('supportsOneTimePayments', preferredProvider);
    
    if (!provider) {
      return {
        success: false,
        error: {
          code: 'no_provider_available',
          message: 'No payment provider available for checkout sessions',
          type: 'api_error',
          provider: preferredProvider || 'unknown'
        }
      };
    }

    const result = await provider.createCheckoutSession(config);
    
    if (result.success && result.data) {
      return {
        ...result,
        data: {
          ...result.data,
          provider: provider.getProviderType()
        }
      };
    }
    
    return result as PaymentResult<CheckoutSessionResult & { provider: PaymentProviderType }>;
  }

  /**
   * Create a subscription using the best available provider
   */
  async createSubscription(
    customerId: string,
    planId: string,
    options?: { trialPeriodDays?: number; metadata?: Record<string, any> },
    preferredProvider?: PaymentProviderType
  ): Promise<PaymentResult<SubscriptionData & ProviderIds & { provider: PaymentProviderType }>> {
    const provider = getBestProviderForOperation('supportsSubscriptions', preferredProvider);
    
    if (!provider) {
      return {
        success: false,
        error: {
          code: 'no_provider_available',
          message: 'No payment provider available for subscriptions',
          type: 'api_error',
          provider: preferredProvider || 'unknown'
        }
      };
    }

    const result = await provider.createSubscription(customerId, planId, options);
    
    if (result.success && result.data) {
      return {
        ...result,
        data: {
          ...result.data,
          provider: provider.getProviderType()
        }
      };
    }
    
    return result as PaymentResult<SubscriptionData & ProviderIds & { provider: PaymentProviderType }>;
  }

  /**
   * Get all available providers and their capabilities
   */
  getAvailableProviders(): Array<{
    type: PaymentProviderType;
    capabilities: ProviderCapabilities;
    isConfigured: boolean;
    clientConfig: Record<string, any>;
  }> {
    return this.factory.getAllProviders().map(provider => ({
      type: provider.getProviderType(),
      capabilities: provider.getCapabilities(),
      isConfigured: provider.isConfigured(),
      clientConfig: provider.getClientConfig()
    }));
  }

  /**
   * Get client configuration for all providers (for frontend integration)
   */
  getClientConfigurations(): Record<string, any> {
    return this.factory.getAllClientConfigs();
  }

  /**
   * Process a webhook event from any supported provider
   */
  async processWebhook(
    provider: PaymentProviderType,
    payload: string,
    signature: string,
    environment: 'sandbox' | 'production' = 'sandbox'
  ): Promise<PaymentResult<any>> {
    const providerInstance = this.factory.getProvider(provider, environment);
    
    if (!providerInstance) {
      return {
        success: false,
        error: {
          code: 'provider_not_found',
          message: `Provider ${provider} not configured`,
          type: 'invalid_request_error',
          provider
        }
      };
    }

    // First, verify the webhook
    const verifyResult = await providerInstance.verifyWebhook(payload, signature);
    if (!verifyResult.success) {
      return verifyResult;
    }

    // Then process the event
    return providerInstance.processWebhookEvent(verifyResult.data!);
  }

  /**
   * Get provider-specific client for advanced operations
   */
  getProvider(
    providerType: PaymentProviderType,
    environment: 'sandbox' | 'production' = 'sandbox'
  ): PaymentProvider | null {
    return this.factory.getProvider(providerType, environment);
  }

  /**
   * Check if a provider supports a specific feature
   */
  providerSupportsFeature(
    providerType: PaymentProviderType,
    feature: keyof ProviderCapabilities
  ): boolean {
    const provider = this.factory.getProvider(providerType);
    return provider?.getCapabilities()[feature] ?? false;
  }

  /**
   * Get the best provider for a specific currency
   */
  getBestProviderForCurrency(currency: string): PaymentProvider | null {
    const providers = this.factory.getAllProviders();
    
    return providers.find(provider => {
      const capabilities = provider.getCapabilities();
      return capabilities.supportedCurrencies.includes(currency.toLowerCase());
    }) || null;
  }

  /**
   * Get the best provider for a specific country
   */
  getBestProviderForCountry(country: string): PaymentProvider | null {
    const providers = this.factory.getAllProviders();
    
    return providers.find(provider => {
      const capabilities = provider.getCapabilities();
      return capabilities.supportedCountries.includes(country.toUpperCase());
    }) || null;
  }

  /**
   * Validate all provider configurations
   */
  async validateProviders(): Promise<{
    valid: PaymentProviderType[];
    invalid: { provider: PaymentProviderType; error: string }[];
  }> {
    return this.factory.validateAllProviders();
  }
}

/**
 * Default payment service instance
 */
export const paymentService = new MultiProviderPaymentService();

/**
 * Utility functions
 */

/**
 * Format amount for display across all providers
 */
export function formatAmount(amount: number, currency = 'usd', provider?: PaymentProviderType): string {
  if (provider) {
    const providerInstance = providerFactory.getProvider(provider);
    if (providerInstance) {
      return providerInstance.formatAmount(amount, currency);
    }
  }
  
  // Fallback to standard formatting
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
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 */
export function toDollars(cents: number): number {
  return cents / 100;
}

/**
 * Get recommended provider based on business requirements
 */
export function getRecommendedProvider(requirements: {
  needsSubscriptions?: boolean;
  needsTrials?: boolean;
  needsRefunds?: boolean;
  needsUsageBased?: boolean;
  primaryCurrency?: string;
  primaryCountry?: string;
}): PaymentProviderType | null {
  const providers = providerFactory.getAllProviders();
  
  const scored = providers.map(provider => {
    const capabilities = provider.getCapabilities();
    let score = 0;
    
    if (requirements.needsSubscriptions && capabilities.supportsSubscriptions) score += 10;
    if (requirements.needsTrials && capabilities.supportsTrials) score += 5;
    if (requirements.needsRefunds && capabilities.supportsRefunds) score += 5;
    if (requirements.needsUsageBased && capabilities.supportsUsageBased) score += 5;
    
    if (requirements.primaryCurrency && capabilities.supportedCurrencies.includes(requirements.primaryCurrency.toLowerCase())) {
      score += 3;
    }
    
    if (requirements.primaryCountry && capabilities.supportedCountries.includes(requirements.primaryCountry.toUpperCase())) {
      score += 3;
    }
    
    return { provider, score };
  });
  
  const best = scored.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  );
  
  return best.score > 0 ? best.provider.getProviderType() : null;
}

/**
 * Environment configuration helper
 */
export function createProviderConfig(
  type: PaymentProviderType,
  config: {
    apiKey: string;
    publishableKey?: string;
    webhookSecret?: string;
    environment?: 'sandbox' | 'production';
    additionalConfig?: Record<string, any>;
  }
): ProviderConfig {
  return {
    type,
    apiKey: config.apiKey,
    publishableKey: config.publishableKey,
    webhookSecret: config.webhookSecret,
    environment: config.environment || 'sandbox',
    additionalConfig: config.additionalConfig
  };
}