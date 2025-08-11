// Common types used across the application

export type Database = any; // Replace with your actual database type

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface SecurityEvent {
  id: number;
  userId: number;
  action: string;
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  createdAt: Date;
}
