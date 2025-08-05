/**
 * Authentication-related type definitions
 * Centralized location for all auth types used across the application
 */

import type { PublicUser } from "./user";

// Auth context value for React context
export interface AuthContextValue {
  user: PublicUser | null;
  isAuthenticated: boolean;
}

// Auth provider props
export interface AuthProviderProps {
  children: React.ReactNode;
  user: PublicUser | null;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Register form data
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

// Auth error types
export type AuthError = 
  | "invalid-credentials"
  | "user-exists" 
  | "weak-password"
  | "invalid-email"
  | "server-error"
  | "unknown";

// Session data structure
export interface SessionData {
  userId: number;
  role: string;
}