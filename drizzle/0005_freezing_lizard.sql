ALTER TABLE `showcases` ADD `author_id` text REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `showcases` ADD `published_at` integer;--> statement-breakpoint
ALTER TABLE `showcases` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `showcases` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `showcases` ADD `deleted_at` integer;