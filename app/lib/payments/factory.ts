/**
 * Payment Provider Factory and Registry
 * 
 * This file manages the creation and configuration of payment providers,
 * allowing the system to support multiple payment gateways simultaneously.
 */

import { PaymentProvider } from './provider';
import { StripeProvider } from './providers/stripe';
import { PayPalProvider } from './providers/paypal';
import type {
  PaymentProviderType,
  ProviderConfig,
  ProviderCapabilities,
  PaymentResult
} from './types';

/**
 * Registry of available payment providers
 */
const PROVIDER_REGISTRY = {
  stripe: StripeProvider,
  paypal: PayPalProvider,
  // Future providers can be added here:
  // square: SquareProvider,
  // razorpay: RazorpayProvider,
  // etc.
} as const;

/**
 * Provider Factory Class
 * 
 * Manages creation, initialization, and lifecycle of payment providers
 */
export class PaymentProviderFactory {
  private providers = new Map<string, PaymentProvider>();
  private defaultProvider: PaymentProviderType | null = null;

  /**
   * Get available provider types
   */
  static getAvailableProviders(): PaymentProviderType[] {
    return Object.keys(PROVIDER_REGISTRY) as PaymentProviderType[];
  }

  /**
   * Get provider capabilities without creating an instance
   */
  static getProviderCapabilities(providerType: PaymentProviderType): ProviderCapabilities | null {
    const ProviderClass = PROVIDER_REGISTRY[providerType];
    if (!ProviderClass) return null;

    // Create a temporary instance to get capabilities
    // This is safe as we're only calling a method that doesn't require initialization
    try {
      const tempInstance = new ProviderClass({
        type: providerType,
        apiKey: 'temp',
        environment: 'sandbox'
      });
      return tempInstance.getCapabilities();
    } catch {
      return null;
    }
  }

  /**
   * Register a payment provider
   */
  async registerProvider(config: ProviderConfig): Promise<PaymentResult<PaymentProvider>> {
    try {
      const ProviderClass = PROVIDER_REGISTRY[config.type];
      if (!ProviderClass) {
        return {
          success: false,
          error: {
            code: 'provider_not_supported',
            message: `Provider ${config.type} is not supported`,
            type: 'invalid_request_error',
            provider: config.type
          }
        };
      }

      // Create provider instance
      const provider = new ProviderClass(config);
      
      // Initialize the provider
      await provider.initialize();

      // Store in registry
      const providerKey = this.getProviderKey(config.type, config.environment);
      this.providers.set(providerKey, provider);

      // Set as default if it's the first provider
      if (!this.defaultProvider) {
        this.defaultProvider = config.type;
      }

      return {
        success: true,
        data: provider
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'provider_initialization_failed',
          message: error instanceof Error ? error.message : 'Failed to initialize provider',
          type: 'api_error',
          provider: config.type,
          raw: error
        }
      };
    }
  }

  /**
   * Get a registered provider
   */
  getProvider(providerType: PaymentProviderType, environment: 'sandbox' | 'production' = 'sandbox'): PaymentProvider | null {
    const providerKey = this.getProviderKey(providerType, environment);
    return this.providers.get(providerKey) || null;
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(environment: 'sandbox' | 'production' = 'sandbox'): PaymentProvider | null {
    if (!this.defaultProvider) return null;
    return this.getProvider(this.defaultProvider, environment);
  }

  /**
   * Set the default provider
   */
  setDefaultProvider(providerType: PaymentProviderType): boolean {
    const provider = this.getProvider(providerType);
    if (!provider) return false;
    
    this.defaultProvider = providerType;
    return true;
  }

  /**
   * Get all registered providers
   */
  getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get providers that support specific features
   */
  getProvidersWithCapability(capability: keyof ProviderCapabilities): PaymentProvider[] {
    return this.getAllProviders().filter(provider => {
      const capabilities = provider.getCapabilities();
      return capabilities[capability] === true;
    });
  }

  /**
   * Remove a provider from the registry
   */
  removeProvider(providerType: PaymentProviderType, environment: 'sandbox' | 'production' = 'sandbox'): boolean {
    const providerKey = this.getProviderKey(providerType, environment);
    const removed = this.providers.delete(providerKey);
    
    // Update default provider if removed
    if (removed && this.defaultProvider === providerType) {
      const remainingProviders = this.getAllProviders();
      this.defaultProvider = remainingProviders.length > 0 ? remainingProviders[0].getProviderType() : null;
    }
    
    return removed;
  }

  /**
   * Check if a provider is registered and configured
   */
  isProviderConfigured(providerType: PaymentProviderType, environment: 'sandbox' | 'production' = 'sandbox'): boolean {
    const provider = this.getProvider(providerType, environment);
    return provider?.isConfigured() ?? false;
  }

  /**
   * Get provider configuration (without sensitive data)
   */
  getProviderConfig(providerType: PaymentProviderType, environment: 'sandbox' | 'production' = 'sandbox'): Record<string, any> | null {
    const provider = this.getProvider(providerType, environment);
    return provider?.getConfig() || null;
  }

  /**
   * Get client configurations for all registered providers
   * This is useful for frontend integration
   */
  getAllClientConfigs(): Record<string, any> {
    const configs: Record<string, any> = {};
    
    this.providers.forEach((provider, key) => {
      const [type, environment] = key.split(':');
      const configKey = `${type}_${environment}`;
      configs[configKey] = provider.getClientConfig();
    });
    
    return configs;
  }

  /**
   * Validate provider configurations
   */
  async validateAllProviders(): Promise<{ valid: PaymentProviderType[]; invalid: { provider: PaymentProviderType; error: string }[] }> {
    const valid: PaymentProviderType[] = [];
    const invalid: { provider: PaymentProviderType; error: string }[] = [];

    for (const provider of this.getAllProviders()) {
      try {
        if (provider.isConfigured()) {
          // Try to get provider capabilities as a basic validation
          provider.getCapabilities();
          valid.push(provider.getProviderType());
        } else {
          invalid.push({
            provider: provider.getProviderType(),
            error: 'Provider not configured'
          });
        }
      } catch (error) {
        invalid.push({
          provider: provider.getProviderType(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { valid, invalid };
  }

  /**
   * Clear all registered providers
   */
  clearAllProviders(): void {
    this.providers.clear();
    this.defaultProvider = null;
  }

  /**
   * Generate a unique key for storing providers
   */
  private getProviderKey(providerType: PaymentProviderType, environment: 'sandbox' | 'production'): string {
    return `${providerType}:${environment}`;
  }
}

/**
 * Global provider factory instance
 * This allows the system to maintain provider configurations across the application
 */
export const providerFactory = new PaymentProviderFactory();

/**
 * Helper function to register multiple providers at once
 */
export async function registerMultipleProviders(configs: ProviderConfig[]): Promise<{
  successful: PaymentProviderType[];
  failed: { provider: PaymentProviderType; error: string }[];
}> {
  const successful: PaymentProviderType[] = [];
  const failed: { provider: PaymentProviderType; error: string }[] = [];

  for (const config of configs) {
    const result = await providerFactory.registerProvider(config);
    if (result.success) {
      successful.push(config.type);
    } else {
      failed.push({
        provider: config.type,
        error: result.error?.message || 'Unknown error'
      });
    }
  }

  return { successful, failed };
}

/**
 * Helper function to get the best provider for a specific operation
 */
export function getBestProviderForOperation(
  operation: keyof ProviderCapabilities,
  preferredProvider?: PaymentProviderType,
  environment: 'sandbox' | 'production' = 'sandbox'
): PaymentProvider | null {
  
  // If preferred provider is specified and supports the operation, use it
  if (preferredProvider) {
    const preferred = providerFactory.getProvider(preferredProvider, environment);
    if (preferred && preferred.getCapabilities()[operation]) {
      return preferred;
    }
  }

  // Otherwise, find the first provider that supports the operation
  const supportingProviders = providerFactory.getProvidersWithCapability(operation);
  return supportingProviders[0] || null;
}

/**
 * Type guard to check if a provider type is supported
 */
export function isSupportedProviderType(type: string): type is PaymentProviderType {
  return type in PROVIDER_REGISTRY;
}

/**
 * Helper to get provider information for documentation/UI
 */
export function getProviderInfo(): Array<{
  type: PaymentProviderType;
  name: string;
  capabilities: ProviderCapabilities;
  description: string;
}> {
  return [
    {
      type: 'stripe',
      name: 'Stripe',
      capabilities: PaymentProviderFactory.getProviderCapabilities('stripe')!,
      description: 'Leading payment processor with comprehensive features for subscriptions and one-time payments'
    },
    {
      type: 'paypal',
      name: 'PayPal',
      capabilities: PaymentProviderFactory.getProviderCapabilities('paypal')!,
      description: 'Popular digital wallet and payment platform with global reach'
    }
    // Add more providers as they are implemented
  ];
}