import { AuthDemoCard } from "./auth-demo-card";
import { QuickActionsCard } from "./quick-actions-card";
import { RecentActivityCard } from "./recent-activity-card";
import { StatsOverviewSection } from "./stats-overview-section";
import { SystemStatusCard } from "./system-status-card";
import { UserInfoCard } from "./user-info-card";
import { WelcomeSection } from "./welcome-section";

export function MainSection() {
  return (
    <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Welcome Section */}
        <WelcomeSection />

        {/* Stats Overview */}
        <StatsOverviewSection />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
          <UserInfoCard />
          <RecentActivityCard />
          <QuickActionsCard />
        </div>

        {/* Additional Cards */}
        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
          <SystemStatusCard />
          <AuthDemoCard />
        </div>
      </div>
    </section>
  );
}
