import type { Route } from "./+types/route";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { GeneralInformationContext } from "~/middleware/information";

import { ChartAreaInteractive } from "./components/area-1";
import { ChartBarInteractive } from "./components/bar-1";
import { ChartLineInteractive } from "./components/line-1";
import { ChartPieSimple } from "./components/pie-1";
import { ChartRadarDefault } from "./components/radar-1";
import { ChartRadialSimple } from "./components/radial-1";
import { ChartTooltipDefault } from "./components/tooltip-1";

export function loader({ context }: Route.LoaderArgs) {
  const pageInformation = context.get(GeneralInformationContext);
  return pageInformation;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-background content-visibility-auto">
      <HeaderNavigation />

      <section className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 space-y-8">
        <ChartAreaInteractive />
        <ChartBarInteractive />
        <ChartLineInteractive />
        <ChartPieSimple />
        <ChartRadarDefault />
        <ChartRadialSimple />
        <ChartTooltipDefault />
      </section>

      <FooterSection />
    </main>
  );
}
