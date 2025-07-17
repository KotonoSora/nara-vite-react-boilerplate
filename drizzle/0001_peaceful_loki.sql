CREATE TABLE `feature_flag_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`feature_flag_id` integer NOT NULL,
	`user_group_id` integer,
	`user_id` text,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`feature_flag_id`) REFERENCES `feature_flags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_group_id`) REFERENCES `user_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `feature_flags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`rollout_percentage` real DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feature_flags_name_unique` ON `feature_flags` (`name`);--> statement-breakpoint
CREATE TABLE `user_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_groups_name_unique` ON `user_groups` (`name`);