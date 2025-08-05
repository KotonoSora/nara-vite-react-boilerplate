/**
 * User-related type definitions
 * Centralized location for all user types used across the application
 */

// Core user type from database schema
export type User = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

// User data for creation (without generated fields)
export type CreateUserData = {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
};

// Public user data (without sensitive fields)
export type PublicUser = Omit<User, "passwordHash">;

// User role enum for better type safety
export type UserRole = "admin" | "user";

// User statistics for dashboard
export interface UserStats {
  daysActive: number;
  totalLogins: number;
  profileViews: number;
}

// User activity tracking
export interface UserActivity {
  id: number;
  actionKey: string;
  time: string;
  timeValue?: number;
  icon: "User" | "Settings" | "Calendar";
}