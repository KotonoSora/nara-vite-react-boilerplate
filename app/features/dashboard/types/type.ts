import type { FetchShowcasesResult } from "~/features/landing-page/utils/fetch-showcases";

export type User = {
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string | Date;
};

export type Icon = "User" | "Settings" | "Calendar";

export type Activity = {
  id: number;
  actionKey: string;
  time: string;
  timeValue?: number; // For relative time calculations
  icon: Icon;
};

export type Stats = {
  daysActive: number;
  totalLogins: number;
  profileViews: number;
};

export type DashboardContentProps = {
  user: User;
  recentActivity: Activity[];
  stats: Stats;
  showcases: FetchShowcasesResult;
};
