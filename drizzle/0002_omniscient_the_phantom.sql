CREATE TABLE `api_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`token_hash` text NOT NULL,
	`last_used_at` integer,
	`expires_at` integer,
	`scopes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_tokens_token_hash_unique` ON `api_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `api_token_user_idx` ON `api_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `api_token_hash_idx` ON `api_tokens` (`token_hash`);--> statement-breakpoint
CREATE TABLE `login_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`success` integer DEFAULT true NOT NULL,
	`provider` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mfa_secrets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`secret` text NOT NULL,
	`backup_codes` text,
	`is_enabled` integer DEFAULT false NOT NULL,
	`last_used_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `mfa_secret_user_idx` ON `mfa_secrets` (`user_id`);--> statement-breakpoint
CREATE TABLE `oauth_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `oauth_account_user_idx` ON `oauth_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `oauth_account_provider_idx` ON `oauth_accounts` (`provider`,`provider_account_id`);--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`resource` text NOT NULL,
	`action` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_name_unique` ON `permissions` (`name`);--> statement-breakpoint
CREATE INDEX `permission_name_idx` ON `permissions` (`name`);--> statement-breakpoint
CREATE INDEX `permission_resource_action_idx` ON `permissions` (`resource`,`action`);--> statement-breakpoint
CREATE TABLE `rate_limit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` text NOT NULL,
	`endpoint` text NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`window_start` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limit_identifier_endpoint_idx` ON `rate_limit_logs` (`identifier`,`endpoint`);--> statement-breakpoint
CREATE INDEX `rate_limit_window_idx` ON `rate_limit_logs` (`window_start`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`permission_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `role_permission_idx` ON `role_permissions` (`role`,`permission_id`);--> statement-breakpoint
CREATE TABLE `security_audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`action` text NOT NULL,
	`resource` text,
	`ip_address` text,
	`user_agent` text,
	`device_fingerprint` text,
	`details` text,
	`success` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `security_audit_user_idx` ON `security_audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `security_audit_action_idx` ON `security_audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `security_audit_created_at_idx` ON `security_audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `trusted_devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`device_fingerprint` text NOT NULL,
	`device_name` text,
	`user_agent` text,
	`ip_address` text,
	`last_seen_at` integer NOT NULL,
	`is_trusted` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `trusted_device_user_device_idx` ON `trusted_devices` (`user_id`,`device_fingerprint`);--> statement-breakpoint
CREATE INDEX `trusted_device_last_seen_idx` ON `trusted_devices` (`last_seen_at`);--> statement-breakpoint
CREATE TABLE `user_permissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`permission_id` integer NOT NULL,
	`granted` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_permission_idx` ON `user_permissions` (`user_id`,`permission_id`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`preferred_language` text DEFAULT 'en' NOT NULL,
	`fallback_languages` text,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`date_format` text DEFAULT 'MM/dd/yyyy' NOT NULL,
	`time_format` text DEFAULT '12h' NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`notifications` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_preference_user_idx` ON `user_preferences` (`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text,
	`name` text NOT NULL,
	`avatar` text,
	`role` text DEFAULT 'user' NOT NULL,
	`created_by` integer,
	`email_verified` integer DEFAULT false NOT NULL,
	`email_verification_token` text,
	`email_verification_expires` integer,
	`password_reset_token` text,
	`password_reset_expires` integer,
	`last_login_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password_hash", "name", "avatar", "role", "created_by", "email_verified", "email_verification_token", "email_verification_expires", "password_reset_token", "password_reset_expires", "last_login_at", "created_at", "updated_at") SELECT "id", "email", "password_hash", "name", "avatar", "role", "created_by", "email_verified", "email_verification_token", "email_verification_expires", "password_reset_token", "password_reset_expires", "last_login_at", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `user_created_by_idx` ON `users` (`created_by`);