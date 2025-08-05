import { lazy, Suspense } from "react";
import type { ChartConfig } from "./chart";

// Simple lazy chart wrapper that loads the chart module on-demand
const LazyChartContainer = lazy(async () => {
  const chartModule = await import("./chart");
  return { default: chartModule.ChartContainer };
});

interface LazyChartProps {
  config: ChartConfig;
  children: React.ComponentProps<typeof import("./chart").ChartContainer>["children"];
  className?: string;
  fallback?: React.ReactNode;
  id?: string;
}

export function LazyChart({ 
  config, 
  children, 
  className,
  fallback,
  id,
  ...props 
}: LazyChartProps & Omit<React.ComponentProps<"div">, keyof LazyChartProps>) {
  return (
    <Suspense fallback={fallback || <div className="h-64 w-full animate-pulse bg-muted rounded-lg" />}>
      <LazyChartContainer 
        config={config} 
        className={className} 
        id={id}
        {...props}
      >
        {children}
      </LazyChartContainer>
    </Suspense>
  );
}

// For immediate loading when charts are definitely needed
export * from "./chart";