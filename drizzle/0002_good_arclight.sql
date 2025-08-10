CREATE TABLE `login_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`success` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_expires` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `password_reset_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password_reset_expires` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` integer;