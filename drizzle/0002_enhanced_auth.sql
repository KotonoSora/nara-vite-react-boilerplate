-- Migration to enhance authentication with OAuth, RBAC, API tokens, and rate limiting
-- Generated manually for enhanced auth features

-- Add avatar column to users table (for OAuth profile pictures)
ALTER TABLE `users` ADD COLUMN `avatar` TEXT;

-- Make password_hash optional for OAuth users
-- Note: SQLite doesn't support modifying column constraints directly
-- The application will handle NULL password_hash for OAuth users

-- Create oauth_accounts table for social login
CREATE TABLE `oauth_accounts` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` INTEGER NOT NULL,
	`provider` TEXT CHECK (provider IN ('google', 'github')) NOT NULL,
	`provider_account_id` TEXT NOT NULL,
	`access_token` TEXT,
	`refresh_token` TEXT,
	`expires_at` INTEGER,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
	`updated_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create permissions table for RBAC
CREATE TABLE `permissions` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` TEXT NOT NULL UNIQUE,
	`description` TEXT,
	`resource` TEXT NOT NULL,
	`action` TEXT NOT NULL,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Create role_permissions junction table
CREATE TABLE `role_permissions` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` TEXT CHECK (role IN ('admin', 'user')) NOT NULL,
	`permission_id` INTEGER NOT NULL,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- Create user_permissions table for user-specific permissions
CREATE TABLE `user_permissions` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` INTEGER NOT NULL,
	`permission_id` INTEGER NOT NULL,
	`granted` INTEGER NOT NULL DEFAULT 1,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
);

-- Create api_tokens table for JWT authentication
CREATE TABLE `api_tokens` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` INTEGER NOT NULL,
	`name` TEXT NOT NULL,
	`token_hash` TEXT NOT NULL UNIQUE,
	`last_used_at` INTEGER,
	`expires_at` INTEGER,
	`scopes` TEXT,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create rate_limit_logs table for rate limiting
CREATE TABLE `rate_limit_logs` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`identifier` TEXT NOT NULL,
	`endpoint` TEXT NOT NULL,
	`attempts` INTEGER NOT NULL DEFAULT 1,
	`window_start` INTEGER NOT NULL,
	`created_at` INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Add provider column to login_logs for OAuth tracking
ALTER TABLE `login_logs` ADD COLUMN `provider` TEXT;

-- Create indexes for performance
CREATE INDEX `user_email_idx` ON `users` (`email`);
CREATE INDEX `user_role_idx` ON `users` (`role`);

CREATE INDEX `oauth_account_user_idx` ON `oauth_accounts` (`user_id`);
CREATE INDEX `oauth_account_provider_idx` ON `oauth_accounts` (`provider`, `provider_account_id`);

CREATE INDEX `permission_name_idx` ON `permissions` (`name`);
CREATE INDEX `permission_resource_action_idx` ON `permissions` (`resource`, `action`);

CREATE INDEX `role_permission_idx` ON `role_permissions` (`role`, `permission_id`);

CREATE INDEX `user_permission_idx` ON `user_permissions` (`user_id`, `permission_id`);

CREATE INDEX `api_token_user_idx` ON `api_tokens` (`user_id`);
CREATE INDEX `api_token_hash_idx` ON `api_tokens` (`token_hash`);

CREATE INDEX `rate_limit_identifier_endpoint_idx` ON `rate_limit_logs` (`identifier`, `endpoint`);
CREATE INDEX `rate_limit_window_idx` ON `rate_limit_logs` (`window_start`);

-- Insert default permissions
INSERT INTO `permissions` (`name`, `description`, `resource`, `action`) VALUES
('admin.manage', 'Full admin access', 'admin', 'manage'),
('user.create', 'Create users', 'user', 'create'),
('user.read', 'View users', 'user', 'read'),
('user.update', 'Update users', 'user', 'update'),
('user.delete', 'Delete users', 'user', 'delete'),
('profile.read', 'View own profile', 'profile', 'read'),
('profile.update', 'Update own profile', 'profile', 'update');

-- Assign permissions to roles
-- Admin gets all permissions
INSERT INTO `role_permissions` (`role`, `permission_id`) 
SELECT 'admin', `id` FROM `permissions`;

-- User gets limited permissions
INSERT INTO `role_permissions` (`role`, `permission_id`) 
SELECT 'user', `id` FROM `permissions` 
WHERE `name` IN ('profile.read', 'profile.update');