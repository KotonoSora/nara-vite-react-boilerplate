-- Migration to add user creation tracking
-- Add createdBy column to users table to track which admin created each user

ALTER TABLE `users` ADD COLUMN `created_by` INTEGER;

-- Create index for createdBy column for better query performance
CREATE INDEX `user_created_by_idx` ON `users` (`created_by`);