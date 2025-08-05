/**
 * UI component type definitions
 * Centralized location for all UI-related types used across the application
 */

// Chart configuration type from shadcn/ui
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

// Feature card props
export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    icon: string;
    hover: string;
    background: string;
  };
}

// Common button variants
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

// Common form field states
export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Common loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Modal/Dialog props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Navigation item
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  active?: boolean;
}

// Common table column definition
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Pagination props
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}