import type { Route } from "./+types/route";

import { ChartAreaInteractive } from "./components/area-1";
import { ChartBarInteractive } from "./components/bar-1";
import { ChartLineInteractive } from "./components/line-1";
import { ChartPieSimple } from "./components/pie-1";
import { ChartRadarDefault } from "./components/radar-1";
import { ChartRadialSimple } from "./components/radial-1";
import { ChartTooltipDefault } from "./components/tooltip-1";

export function meta({}: Route.MetaArgs) {
  return [{ title: "chart" }, { name: "description", content: "" }];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <div className="min-h-0 h-full w-full overflow-auto p-4 flex flex-col gap-2">
      <ChartAreaInteractive />
      <ChartBarInteractive />
      <ChartLineInteractive />
      <ChartPieSimple />
      <ChartRadarDefault />
      <ChartRadialSimple />
      <ChartTooltipDefault />
    </div>
  );
}
