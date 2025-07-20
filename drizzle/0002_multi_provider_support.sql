-- Migration: Add multi-provider support to payment system
-- This migration adds support for multiple payment providers beyond just Stripe

-- Update products table to support multiple providers
ALTER TABLE products ADD COLUMN provider_product_ids TEXT; -- JSON: {"stripe": "prod_123", "paypal": "PROD-456"}
ALTER TABLE products ADD COLUMN supported_providers TEXT; -- JSON array: ["stripe", "paypal"]
ALTER TABLE products ADD COLUMN default_provider TEXT; -- 'stripe', 'paypal', etc.

-- Update plans table to support multiple providers
ALTER TABLE plans ADD COLUMN provider_price_ids TEXT; -- JSON: {"stripe": "price_123", "paypal": "P-456"}
ALTER TABLE plans ADD COLUMN supported_providers TEXT; -- JSON array: ["stripe", "paypal"]
ALTER TABLE plans ADD COLUMN default_provider TEXT; -- 'stripe', 'paypal', etc.

-- Update customers table to support multiple providers
ALTER TABLE customers ADD COLUMN provider_customer_ids TEXT; -- JSON: {"stripe": "cus_123", "paypal": "CUST-456"}
ALTER TABLE customers ADD COLUMN preferred_provider TEXT; -- User's preferred payment provider
ALTER TABLE customers ADD COLUMN supported_providers TEXT; -- JSON array of providers customer has accounts with

-- Update subscriptions table to support multiple providers
ALTER TABLE subscriptions ADD COLUMN provider TEXT; -- 'stripe', 'paypal', 'square', etc.
ALTER TABLE subscriptions ADD COLUMN provider_subscription_id TEXT; -- Provider-specific subscription ID
ALTER TABLE subscriptions ADD COLUMN provider_data TEXT; -- JSON string for provider-specific information

-- Update orders table to support multiple providers
ALTER TABLE orders ADD COLUMN provider TEXT; -- 'stripe', 'paypal', 'square', etc.
ALTER TABLE orders ADD COLUMN provider_payment_intent_id TEXT; -- Provider-specific payment ID
ALTER TABLE orders ADD COLUMN provider_data TEXT; -- JSON string for provider-specific information

-- Update webhook_events table to support multiple providers
ALTER TABLE webhook_events ADD COLUMN provider TEXT; -- 'stripe', 'paypal', 'square', etc.
ALTER TABLE webhook_events ADD COLUMN provider_event_id TEXT; -- Provider-specific event ID

-- Create provider_configs table for managing multiple payment providers
CREATE TABLE IF NOT EXISTS provider_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL, -- 'stripe', 'paypal', 'square', etc.
    environment TEXT NOT NULL, -- 'sandbox', 'production'
    publishable_key TEXT, -- Public keys are safe to store
    webhook_endpoint TEXT, -- Custom webhook endpoints per provider
    is_enabled INTEGER DEFAULT 1, -- Boolean: is provider enabled
    is_default INTEGER DEFAULT 0, -- Boolean: is this the default provider
    additional_config TEXT, -- JSON string for provider-specific configuration
    display_name TEXT, -- Human-readable name for UI
    description TEXT, -- Description for admin interface
    supported_features TEXT, -- JSON array of supported features
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider_subscription_id ON subscriptions(provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider);
CREATE INDEX IF NOT EXISTS idx_orders_provider_payment_intent_id ON orders(provider_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event_id ON webhook_events(provider_event_id);
CREATE INDEX IF NOT EXISTS idx_provider_configs_provider_env ON provider_configs(provider, environment);

-- Migrate existing Stripe data to new multi-provider format
-- This ensures backward compatibility with existing data

-- Update existing products with Stripe IDs
UPDATE products 
SET provider_product_ids = json_object('stripe', stripe_product_id),
    supported_providers = json_array('stripe'),
    default_provider = 'stripe'
WHERE stripe_product_id IS NOT NULL;

-- Update existing plans with Stripe IDs
UPDATE plans 
SET provider_price_ids = json_object('stripe', stripe_price_id),
    supported_providers = json_array('stripe'),
    default_provider = 'stripe'
WHERE stripe_price_id IS NOT NULL;

-- Update existing customers with Stripe IDs
UPDATE customers 
SET provider_customer_ids = json_object('stripe', stripe_customer_id),
    preferred_provider = 'stripe',
    supported_providers = json_array('stripe')
WHERE stripe_customer_id IS NOT NULL;

-- Update existing subscriptions with provider information
UPDATE subscriptions 
SET provider = 'stripe',
    provider_subscription_id = stripe_subscription_id
WHERE stripe_subscription_id IS NOT NULL;

-- Update existing orders with provider information
UPDATE orders 
SET provider = 'stripe',
    provider_payment_intent_id = stripe_payment_intent_id
WHERE stripe_payment_intent_id IS NOT NULL;

-- Update existing webhook events with provider information
UPDATE webhook_events 
SET provider = 'stripe',
    provider_event_id = stripe_event_id
WHERE stripe_event_id IS NOT NULL;

-- Insert default Stripe provider config (if not exists)
INSERT OR IGNORE INTO provider_configs (
    provider, 
    environment, 
    is_enabled, 
    is_default, 
    display_name, 
    description, 
    supported_features
) VALUES (
    'stripe', 
    'sandbox', 
    1, 
    1, 
    'Stripe', 
    'Leading payment processor with comprehensive features', 
    json_array('subscriptions', 'one_time_payments', 'refunds', 'trials', 'usage_based')
);

-- Note: The old stripe_* columns are kept for backward compatibility
-- They can be removed in a future migration once all code is updated