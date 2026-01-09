CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_showcase_tags` (
	`showcase_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` integer,
	PRIMARY KEY(`showcase_id`, `tag_id`),
	FOREIGN KEY (`showcase_id`) REFERENCES `showcases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_showcase_tags`("showcase_id", "tag_id", "created_at") SELECT "showcase_id", "tag_id", "created_at" FROM `showcase_tags`;--> statement-breakpoint
DROP TABLE `showcase_tags`;--> statement-breakpoint
ALTER TABLE `__new_showcase_tags` RENAME TO `showcase_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;