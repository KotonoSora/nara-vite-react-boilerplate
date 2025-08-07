import { type FC } from "react";

import { cn } from "~/lib/utils";

import type { RoadmapFeature } from "../types/roadmap-types";
import { useRoadmap } from "../context/roadmap-context";
import { FeatureCard } from "./feature-card";

interface RoadmapSectionProps {
  title: string;
  subtitle: string;
  description: string;
  sectionKey: "current" | "development" | "planned";
  className?: string;
}

export const RoadmapSection: FC<RoadmapSectionProps> = ({
  title,
  subtitle,
  description,
  sectionKey,
  className,
}) => {
  const { roadmapData } = useRoadmap();
  const features = roadmapData[sectionKey];
  const featureEntries = Object.entries(features);

  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-xl text-primary font-medium mb-4">
            {subtitle}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureEntries.map(([key, feature]) => (
            <FeatureCard
              key={key}
              feature={feature}
              className="h-full"
            />
          ))}
        </div>

        {/* Features Count */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {featureEntries.length} {featureEntries.length === 1 ? 'feature' : 'features'}
          </p>
        </div>
      </div>
    </section>
  );
};