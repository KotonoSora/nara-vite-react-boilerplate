/**
 * Common utility type definitions
 * Centralized location for utility types used across the application
 */

// Generic API response structure
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// Generic pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Generic filter parameters
export interface FilterParams {
  search?: string;
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

// Environment configuration
export interface EnvironmentConfig {
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL?: string;
  SESSION_SECRET?: string;
  [key: string]: string | undefined;
}

// Route loader data generic
export type LoaderData<T = any> = {
  data: T;
  error?: string;
};

// Route action result generic
export type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// File upload types
export interface FileUpload {
  file: File;
  preview?: string;
  status: "pending" | "uploading" | "success" | "error";
  progress?: number;
  error?: string;
}

// Generic ID types
export type ID = string | number;

// Generic object with string keys
export type StringRecord = Record<string, any>;

// Utility type for making properties optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Utility type for making properties required
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Utility type for creating a type with specific keys
export type Pick<T, K extends keyof T> = { [P in K]: T[P] };

// Utility type for omitting specific keys
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Coordinates type
export interface Coordinates {
  x: number;
  y: number;
}

// Size dimensions
export interface Dimensions {
  width: number;
  height: number;
}