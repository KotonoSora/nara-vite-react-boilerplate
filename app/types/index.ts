/**
 * Central type exports
 * This file exports all types from the shared types directory
 * Import types like: import type { User, AuthContextValue } from "~/types";
 */

// Re-export all types for convenient access
export * from "./user";
export * from "./auth";
export * from "./i18n";
export * from "./features";
export * from "./ui";
export * from "./common";
export * from "./database";

// Additional convenience type unions
export type { User, PublicUser, CreateUserData, UserRole, UserStats, UserActivity } from "./user";
export type { AuthContextValue, AuthProviderProps, LoginFormData, RegisterFormData, AuthError, SessionData } from "./auth";
export type { SupportedLanguage, TranslationKey, TranslationFunction, I18nContextValue, LanguageDetectionResult } from "./i18n";
export type { ProjectInfo, Step, FeatureCardConfig, PageInformation, DashboardContentProps, AdminContentProps } from "./features";
export type { ChartConfig, ButtonVariant, ButtonSize, Theme, LoadingState, NavigationItem } from "./ui";
export type { ApiResponse, PaginationParams, FilterParams, LoaderData, ActionResult, ValidationResult } from "./common";
export type { Database, DatabaseResult, QueryOptions, DatabaseStatus } from "./database";