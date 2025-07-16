CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_customer_id` text,
	`email` text NOT NULL,
	`name` text,
	`billing_address` text,
	`payment_methods` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_stripe_customer_id_unique` ON `customers` (`stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_payment_intent_id` text,
	`customer_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	`status` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`download_url` text,
	`download_expires_at` integer,
	`access_granted` integer DEFAULT false,
	`refunded_at` integer,
	`refund_amount` integer,
	`refund_reason` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_stripe_payment_intent_id_unique` ON `orders` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_price_id` text,
	`product_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`interval` text,
	`interval_count` integer DEFAULT 1,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`trial_period_days` integer,
	`features` text,
	`limits` text,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_stripe_price_id_unique` ON `plans` (`stripe_price_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_product_id` text,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL,
	`category` text,
	`features` text,
	`metadata` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_stripe_product_id_unique` ON `products` (`stripe_product_id`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_subscription_id` text,
	`customer_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`plan_id` integer NOT NULL,
	`status` text NOT NULL,
	`current_period_start` integer,
	`current_period_end` integer,
	`trial_start` integer,
	`trial_end` integer,
	`canceled_at` integer,
	`cancel_at_period_end` integer DEFAULT false,
	`usage_data` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_stripe_subscription_id_unique` ON `subscriptions` (`stripe_subscription_id`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_event_id` text NOT NULL,
	`event_type` text NOT NULL,
	`processed` integer DEFAULT false NOT NULL,
	`processing_error` text,
	`event_data` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webhook_events_stripe_event_id_unique` ON `webhook_events` (`stripe_event_id`);