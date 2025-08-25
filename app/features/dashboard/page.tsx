import { AuthDemoCard } from "~/features/dashboard/components/auth-demo-card";
import { QuickActionsCard } from "~/features/dashboard/components/quick-actions-card";
import { RecentActivityCard } from "~/features/dashboard/components/recent-activity-card";
import { StatsOverviewSection } from "~/features/dashboard/components/stats-overview-section";
import { SystemStatusCard } from "~/features/dashboard/components/system-status-card";
import { UserInfoCard } from "~/features/dashboard/components/user-info-card";
import { WelcomeSection } from "~/features/dashboard/components/welcome-section";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigationSection } from "~/features/shared/components/header-navigation-section";

import { usePageContext } from "./context/page-context";

export function ContentDashboardPage() {
  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header */}
      <HeaderNavigationSection usePageContext={usePageContext} />

      {/* Main content */}
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

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
