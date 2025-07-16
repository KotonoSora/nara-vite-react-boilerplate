import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Products that can be sold (SaaS, digital downloads, courses, etc.)
export const product = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stripeProductId: text("stripe_product_id").unique(),
  
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'saas', 'digital_download', 'course', 'bundle'
  category: text("category"), // optional categorization
  
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
  stripeCustomerId: text("stripe_customer_id").unique(),
  
  email: text("email").notNull().unique(),
  name: text("name"),
  
  // Billing information
  billingAddress: text("billing_address"), // JSON string
  paymentMethods: text("payment_methods"), // JSON string of payment method IDs
  
  // Customer status
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Active subscriptions
export const subscription = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  
  // Usage tracking
  usageData: text("usage_data"), // JSON string for tracking usage limits
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// One-time purchase orders
export const order = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  stripeEventId: text("stripe_event_id").unique().notNull(),
  
  eventType: text("event_type").notNull(),
  processed: integer("processed", { mode: "boolean" }).notNull().default(false),
  processingError: text("processing_error"),
  eventData: text("event_data").notNull(), // JSON string of the full event
  
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});