import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Products that can be sold (SaaS, digital downloads, courses, etc.)
export const product = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider-specific IDs (JSON object to support multiple providers)
  providerProductIds: text("provider_product_ids"), // JSON: {"stripe": "prod_123", "paypal": "PROD-456"}
  
  // Legacy Stripe field for backward compatibility
  stripeProductId: text("stripe_product_id").unique(),
  
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'saas', 'digital_download', 'course', 'bundle'
  category: text("category"), // optional categorization
  
  // Provider configuration
  supportedProviders: text("supported_providers"), // JSON array: ["stripe", "paypal"]
  defaultProvider: text("default_provider"), // 'stripe', 'paypal', etc.
  
  // Metadata
  features: text("features"), // JSON string of features array
  metadata: text("metadata"), // JSON string for additional data
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Pricing plans for products (one-time, subscription, etc.)
export const plan = sqliteTable("plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider-specific IDs (JSON object to support multiple providers)
  providerPriceIds: text("provider_price_ids"), // JSON: {"stripe": "price_123", "paypal": "P-456"}
  
  // Legacy Stripe field for backward compatibility
  stripePriceId: text("stripe_price_id").unique(),
  
  productId: integer("product_id")
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  
  name: text("name").notNull(), // 'Basic', 'Pro', 'Enterprise'
  type: text("type").notNull(), // 'one_time', 'recurring'
  interval: text("interval"), // 'month', 'year' (for recurring)
  intervalCount: integer("interval_count").default(1), // every X months/years
  
  // Pricing
  amount: integer("amount").notNull(), // price in cents
  currency: text("currency").notNull().default("usd"),
  
  // Trial settings
  trialPeriodDays: integer("trial_period_days"),
  
  // Provider configuration
  supportedProviders: text("supported_providers"), // JSON array: ["stripe", "paypal"]
  defaultProvider: text("default_provider"), // 'stripe', 'paypal', etc.
  
  // Features and limits
  features: text("features"), // JSON string of plan-specific features
  limits: text("limits"), // JSON string of usage limits
  
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").default(0), // for display ordering
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Customer information
export const customer = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider-specific IDs (JSON object to support multiple providers)
  providerCustomerIds: text("provider_customer_ids"), // JSON: {"stripe": "cus_123", "paypal": "CUST-456"}
  
  // Legacy Stripe field for backward compatibility
  stripeCustomerId: text("stripe_customer_id").unique(),
  
  email: text("email").notNull().unique(),
  name: text("name"),
  
  // Billing information
  billingAddress: text("billing_address"), // JSON string
  paymentMethods: text("payment_methods"), // JSON string of payment method IDs by provider
  
  // Provider preferences
  preferredProvider: text("preferred_provider"), // User's preferred payment provider
  supportedProviders: text("supported_providers"), // JSON array of providers customer has accounts with
  
  // Customer status
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Active subscriptions
export const subscription = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider information
  provider: text("provider").notNull(), // 'stripe', 'paypal', 'square', etc.
  providerSubscriptionId: text("provider_subscription_id").notNull(), // Provider-specific subscription ID
  
  // Legacy Stripe field for backward compatibility
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  
  customerId: integer("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
  planId: integer("plan_id")
    .notNull()
    .references(() => plan.id),
  
  // Subscription details
  status: text("status").notNull(), // 'active', 'canceled', 'past_due', 'trialing', 'incomplete'
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  trialStart: integer("trial_start", { mode: "timestamp" }),
  trialEnd: integer("trial_end", { mode: "timestamp" }),
  canceledAt: integer("canceled_at", { mode: "timestamp" }),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  
  // Provider-specific data
  providerData: text("provider_data"), // JSON string for provider-specific information
  
  // Usage tracking
  usageData: text("usage_data"), // JSON string for tracking usage limits
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// One-time purchase orders
export const order = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider information
  provider: text("provider").notNull(), // 'stripe', 'paypal', 'square', etc.
  providerPaymentIntentId: text("provider_payment_intent_id").notNull(), // Provider-specific payment ID
  
  // Legacy Stripe field for backward compatibility
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  
  customerId: integer("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => product.id),
  planId: integer("plan_id")
    .notNull()
    .references(() => plan.id),
  
  // Order details
  status: text("status").notNull(), // 'pending', 'succeeded', 'failed', 'refunded'
  amount: integer("amount").notNull(), // amount paid in cents
  currency: text("currency").notNull().default("usd"),
  
  // Provider-specific data
  providerData: text("provider_data"), // JSON string for provider-specific information
  
  // Delivery information
  downloadUrl: text("download_url"), // for digital downloads
  downloadExpiresAt: integer("download_expires_at", { mode: "timestamp" }),
  accessGranted: integer("access_granted", { mode: "boolean" }).default(false),
  
  // Refund information
  refundedAt: integer("refunded_at", { mode: "timestamp" }),
  refundAmount: integer("refund_amount"), // refunded amount in cents
  refundReason: text("refund_reason"),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Webhook events log for debugging and audit
export const webhookEvent = sqliteTable("webhook_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Provider information
  provider: text("provider").notNull(), // 'stripe', 'paypal', 'square', etc.
  providerEventId: text("provider_event_id").notNull(), // Provider-specific event ID
  
  // Legacy Stripe field for backward compatibility
  stripeEventId: text("stripe_event_id").unique(),
  
  eventType: text("event_type").notNull(),
  processed: integer("processed", { mode: "boolean" }).notNull().default(false),
  processingError: text("processing_error"),
  eventData: text("event_data").notNull(), // JSON string of the full event
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Provider configurations table for managing multiple payment providers
export const providerConfig = sqliteTable("provider_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  provider: text("provider").notNull(), // 'stripe', 'paypal', 'square', etc.
  environment: text("environment").notNull(), // 'sandbox', 'production'
  
  // Configuration (encrypted in production)
  publishableKey: text("publishable_key"), // Public keys are safe to store
  webhookEndpoint: text("webhook_endpoint"), // Custom webhook endpoints per provider
  
  // Feature toggles
  isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  
  // Provider-specific settings
  additionalConfig: text("additional_config"), // JSON string for provider-specific configuration
  
  // Metadata
  displayName: text("display_name"), // Human-readable name for UI
  description: text("description"), // Description for admin interface
  supportedFeatures: text("supported_features"), // JSON array of supported features
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});