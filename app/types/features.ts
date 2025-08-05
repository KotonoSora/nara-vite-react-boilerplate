/**
 * Feature-specific type definitions
 * Centralized location for types used across different features
 */

import type { PublicUser, UserStats, UserActivity } from "./user";

// Landing Page Types
export interface ProjectInfo {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
}

export interface Step {
  number: number;
  title: string;
  description: string;
  command: string;
  note?: string;
}

export interface FeatureCardConfig {
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

export interface PageInformation {
  title: string;
  description: string;
  githubRepository: string;
  commercialLink?: string;
  showcases: ProjectInfo[];
  steps: Step[];
  featuresConfig: FeatureCardConfig[];
}

export interface LandingPageEnv {
  LANDING_PAGE_TITLE?: string;
  LANDING_PAGE_DESCRIPTION?: string;
  LANDING_PAGE_REPOSITORY?: string;
  LANDING_PAGE_COMMERCIAL_LINK?: string;
}

// Dashboard Types
export interface DashboardContentProps {
  user: PublicUser;
  recentActivity: UserActivity[];
  stats: UserStats;
}

// Admin Types
export interface AdminContentProps {
  user?: PublicUser;
}

// Auth Form Types
export interface LoginContentProps {
  error?: string;
}

export interface RegisterContentProps {
  error?: string;
}

// Floating Element for Background Decoration
export interface FloatingElement {
  id: string;
  size: "sm" | "md" | "lg";
  color: "primary" | "green" | "yellow" | "purple";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay: number;
}

export interface BackgroundDecorationProps {
  elements: FloatingElement[];
  className?: string;
}