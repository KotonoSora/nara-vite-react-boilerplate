import { lazy, Suspense } from "react";

import { WelcomeSection } from "~/features/dashboard/components/welcome-section";
import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

const StatsOverviewSection = lazy(() =>
  import("~/features/dashboard/components/stats-overview-section").then((m) => ({ default: m.StatsOverviewSection }))
);
const UserInfoCard = lazy(() =>
  import("~/features/dashboard/components/user-info-card").then((m) => ({ default: m.UserInfoCard }))
);
const RecentActivityCard = lazy(() =>
  import("~/features/dashboard/components/recent-activity-card").then((m) => ({ default: m.RecentActivityCard }))
);
const QuickActionsCard = lazy(() =>
  import("~/features/dashboard/components/quick-actions-card").then((m) => ({ default: m.QuickActionsCard }))
);
const SystemStatusCard = lazy(() =>
  import("~/features/dashboard/components/system-status-card").then((m) => ({ default: m.SystemStatusCard }))
);
const AuthDemoCard = lazy(() =>
  import("~/features/dashboard/components/auth-demo-card").then((m) => ({ default: m.AuthDemoCard }))
);

function CardLoader() {
  return (
    <div className="w-full h-[200px] flex items-center justify-center border rounded-lg">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

export function ContentDashboardPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      {/* Header */}
      <HeaderNavigation />

      {/* Main content */}
      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          {/* Welcome Section - Always loaded */}
          <WelcomeSection />

          {/* Stats Overview - Lazy loaded */}
          <Suspense fallback={<CardLoader />}>
            <StatsOverviewSection />
          </Suspense>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
            <Suspense fallback={<CardLoader />}>
              <UserInfoCard />
            </Suspense>
            <Suspense fallback={<CardLoader />}>
              <RecentActivityCard />
            </Suspense>
            <Suspense fallback={<CardLoader />}>
              <QuickActionsCard />
            </Suspense>
          </div>

          {/* Additional Cards */}
          <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
            <Suspense fallback={<CardLoader />}>
              <SystemStatusCard />
            </Suspense>
            <Suspense fallback={<CardLoader />}>
              <AuthDemoCard />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <FooterSection />
    </main>
  );
}
