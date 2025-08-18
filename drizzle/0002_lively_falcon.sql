ALTER TABLE `users` ADD `email_verified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `email_verification_expires` integer;