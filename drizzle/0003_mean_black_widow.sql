ALTER TABLE `users` ADD `password_reset_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password_reset_expires` integer;