PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_showcases` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`image` text
);
--> statement-breakpoint
INSERT INTO `__new_showcases`("id", "name", "description", "url", "image") SELECT "id", "name", "description", "url", "image" FROM `showcases`;--> statement-breakpoint
DROP TABLE `showcases`;--> statement-breakpoint
ALTER TABLE `__new_showcases` RENAME TO `showcases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_showcase_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`showcase_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`showcase_id`) REFERENCES `showcases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_showcase_tags`("id", "showcase_id", "tag") SELECT "id", "showcase_id", "tag" FROM `showcase_tags`;--> statement-breakpoint
DROP TABLE `showcase_tags`;--> statement-breakpoint
ALTER TABLE `__new_showcase_tags` RENAME TO `showcase_tags`;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "expires_at", "created_at") SELECT "id", "user_id", "expires_at", "created_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`email_verified` integer DEFAULT false,
	`email_verification_token` text,
	`email_verification_expires` integer,
	`password_reset_token` text,
	`password_reset_expires` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password_hash", "name", "role", "email_verified", "email_verification_token", "email_verification_expires", "password_reset_token", "password_reset_expires", "created_at", "updated_at") SELECT "id", "email", "password_hash", "name", "role", "email_verified", "email_verification_token", "email_verification_expires", "password_reset_token", "password_reset_expires", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);