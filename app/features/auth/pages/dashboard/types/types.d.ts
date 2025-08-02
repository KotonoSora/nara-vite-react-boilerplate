interface User {
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string | Date;
}

interface Activity {
  id: number;
  actionKey: string;
  time: string;
  timeValue?: number; // For relative time calculations
  icon: "User" | "Settings" | "Calendar";
}

interface Stats {
  daysActive: number;
  totalLogins: number;
  profileViews: number;
}

interface DashboardContentProps {
  user: User;
  recentActivity: Activity[];
  stats: Stats;
}
