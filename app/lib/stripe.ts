import Stripe from 'stripe';

/**
 * Legacy Stripe utilities for backward compatibility
 * 
 * These functions are kept for backward compatibility with existing code.
 * New implementations should use the multi-provider payment system in app/lib/payments/
 */

export function getStripe(secretKey: string) {
  if (!secretKey) {
    throw new Error('Stripe secret key is required');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-06-30.basil',
    typescript: true,
  });
}

// Helper to format amount for display
export function formatPrice(amount: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

// Helper to convert dollars to cents
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Helper to convert cents to dollars
export function toDollars(cents: number): number {
  return cents / 100;
}

// Re-export from the new multi-provider system for consistency
export { 
  formatAmount, 
  toCents as toMultiProviderCents, 
  toDollars as toMultiProviderDollars 
} from './payments';