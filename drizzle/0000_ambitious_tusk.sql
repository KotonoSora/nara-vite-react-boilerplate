DROP TABLE IF EXISTS demo;
DROP TABLE IF EXISTS showcase_tags;
DROP TABLE IF EXISTS showcases;

CREATE TABLE `showcases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `showcase_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`showcase_id` integer NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`showcase_id`) REFERENCES `showcases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `showcase_tags_tag_unique` ON `showcase_tags` (`tag`);