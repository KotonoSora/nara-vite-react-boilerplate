import type { getUserById, User } from "~/user.server";

/**
 * Dashboard stats type
 */
export interface Stats {
  readonly daysActive: number;
  readonly totalLogins: number;
  readonly profileViews: number;
}

/**
 * Dashboard content props type
 */
export interface DashboardContentProps {
  readonly user: User;
  readonly recentActivity: readonly RecentActivity[];
  readonly stats: Stats;
}

/**
 * Activity icon type
 */
export interface ActivityIcon {
  readonly User: "User";
  readonly Settings: "Settings";
  readonly Calendar: "Calendar";
}

/**
 * Activity icon type
 */
export type ActivityIconType = keyof ActivityIcon;

/**
 * Recent activity type
 */
export interface RecentActivity {
  readonly id: number;
  readonly actionKey: string;
  readonly time: string;
  readonly timeValue?: number;
  readonly icon: ActivityIconType;
}

/**
 * Dashboard stats type
 */
export interface DashboardStats {
  readonly daysActive: number;
  readonly totalLogins: number;
  readonly profileViews: number;
}

/**
 * Dashboard loader data type
 */
export interface DashboardLoaderData {
  readonly user: NonNullable<Awaited<ReturnType<typeof getUserById>>>;
  readonly recentActivity: readonly RecentActivity[];
  readonly stats: DashboardStats;
  readonly dashboardTitle: string;
  readonly dashboardDescription: string;
}
