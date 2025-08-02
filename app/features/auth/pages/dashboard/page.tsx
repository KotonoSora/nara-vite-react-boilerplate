import { AuthDemoCard } from "~/features/auth/pages/dashboard/components/auth-demo-card";
import { QuickActionsCard } from "~/features/auth/pages/dashboard/components/quick-actions-card";
import { RecentActivityCard } from "~/features/auth/pages/dashboard/components/recent-activity-card";
import { StatsOverviewSection } from "~/features/auth/pages/dashboard/components/stats-overview-section";
import { SystemStatusCard } from "~/features/auth/pages/dashboard/components/system-status-card";
import { UserInfoCard } from "~/features/auth/pages/dashboard/components/user-info-card";
import { WelcomeSection } from "~/features/auth/pages/dashboard/components/welcome-section";
import { usePageContext } from "~/features/auth/pages/dashboard/context/page-context";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";

export function ContentDashboardPage() {
  const { user, recentActivity, stats } = usePageContext();

  return (
    <main
      className="min-h-screen bg-background"
      style={{ contentVisibility: "auto" }}
    >
      {/* Header */}
      <HeaderNavigationSection />

      {/* Main content */}
      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {/* Welcome Section */}
          <WelcomeSection user={user} />

          {/* Stats Overview */}
          <StatsOverviewSection stats={stats} />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
            <UserInfoCard user={user} />
            <RecentActivityCard activities={recentActivity} />
            <QuickActionsCard user={user} />
          </div>

          {/* Enhanced Demo Content */}
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
