import { type FC } from "react";

import { Separator } from "~/components/ui/separator";
import { useI18n } from "~/lib/i18n";

import { useRoadmap } from "./context/roadmap-context";
import { RoadmapHero } from "./components/roadmap-hero";
import { RoadmapSection } from "./components/roadmap-section";
import { RequestGuideSection } from "./components/request-guide-section";

export const ContentRoadmapPage: FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <RoadmapHero />

      {/* Current Support Section */}
      <RoadmapSection
        title={t("roadmap.sections.currentSupport.title")}
        subtitle={t("roadmap.sections.currentSupport.subtitle")}
        description={t("roadmap.sections.currentSupport.description")}
        sectionKey="current"
        className="bg-background"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* In Development Section */}
      <RoadmapSection
        title={t("roadmap.sections.inDevelopment.title")}
        subtitle={t("roadmap.sections.inDevelopment.subtitle")}
        description={t("roadmap.sections.inDevelopment.description")}
        sectionKey="development"
        className="bg-muted/30"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* Planned Section */}
      <RoadmapSection
        title={t("roadmap.sections.planned.title")}
        subtitle={t("roadmap.sections.planned.subtitle")}
        description={t("roadmap.sections.planned.description")}
        sectionKey="planned"
        className="bg-background"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* Request Guide Section */}
      <RequestGuideSection />
    </div>
  );
};