import { lazy, Suspense } from "react";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

const ChartAreaInteractive = lazy(() =>
  import("./components/area-1").then((m) => ({ default: m.ChartAreaInteractive }))
);
const ChartBarInteractive = lazy(() =>
  import("./components/bar-1").then((m) => ({ default: m.ChartBarInteractive }))
);
const ChartLineInteractive = lazy(() =>
  import("./components/line-1").then((m) => ({ default: m.ChartLineInteractive }))
);
const ChartPieSimple = lazy(() =>
  import("./components/pie-1").then((m) => ({ default: m.ChartPieSimple }))
);
const ChartRadarDefault = lazy(() =>
  import("./components/radar-1").then((m) => ({ default: m.ChartRadarDefault }))
);
const ChartRadialSimple = lazy(() =>
  import("./components/radial-1").then((m) => ({ default: m.ChartRadialSimple }))
);
const ChartTooltipDefault = lazy(() =>
  import("./components/tooltip-1").then((m) => ({ default: m.ChartTooltipDefault }))
);

function ChartLoader() {
  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading chart...</div>
    </div>
  );
}

export function ContentChartPage() {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8">
        <Suspense fallback={<ChartLoader />}>
          <ChartAreaInteractive />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartBarInteractive />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartLineInteractive />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartPieSimple />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartRadarDefault />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartRadialSimple />
        </Suspense>
        <Suspense fallback={<ChartLoader />}>
          <ChartTooltipDefault />
        </Suspense>
      </section>

      <FooterSection />
    </main>
  );
}
