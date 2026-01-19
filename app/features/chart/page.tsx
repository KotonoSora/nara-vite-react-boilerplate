import { useEffect } from "react";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useLazyImport } from "~/hooks/use-lazy-import";

export function ContentChartPage() {
  const [AreaModule, getChartAreaInteractive] = useLazyImport(
    async () => await import("./components/area-1"),
  );
  const [BarModule, getChartBarInteractive] = useLazyImport(
    async () => await import("./components/bar-1"),
  );
  const [LineModule, getChartLineInteractive] = useLazyImport(
    async () => await import("./components/line-1"),
  );
  const [PieModule, getChartPieSimple] = useLazyImport(
    async () => await import("./components/pie-1"),
  );
  const [RadarModule, getChartRadarDefault] = useLazyImport(
    async () => await import("./components/radar-1"),
  );
  const [RadialModule, getChartRadialSimple] = useLazyImport(
    async () => await import("./components/radial-1"),
  );
  const [TooltipModule, getChartTooltipDefault] = useLazyImport(
    async () => await import("./components/tooltip-1"),
  );

  useEffect(() => {
    getChartAreaInteractive();
    getChartBarInteractive();
    getChartLineInteractive();
    getChartPieSimple();
    getChartRadarDefault();
    getChartRadialSimple();
    getChartTooltipDefault();
  }, []);

  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8">
        {AreaModule && AreaModule.ChartAreaInteractive ? (
          <AreaModule.ChartAreaInteractive />
        ) : null}
        {BarModule && BarModule.ChartBarInteractive ? (
          <BarModule.ChartBarInteractive />
        ) : null}
        {LineModule && LineModule.ChartLineInteractive ? (
          <LineModule.ChartLineInteractive />
        ) : null}
        {PieModule && PieModule.ChartPieSimple ? (
          <PieModule.ChartPieSimple />
        ) : null}
        {RadarModule && RadarModule.ChartRadarDefault ? (
          <RadarModule.ChartRadarDefault />
        ) : null}
        {RadialModule && RadialModule.ChartRadialSimple ? (
          <RadialModule.ChartRadialSimple />
        ) : null}
        {TooltipModule && TooltipModule.ChartTooltipDefault ? (
          <TooltipModule.ChartTooltipDefault />
        ) : null}
      </section>

      <FooterSection />
    </main>
  );
}
