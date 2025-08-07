import { type FC } from "react";

import { Separator } from "~/components/ui/separator";
import { useI18n } from "~/lib/i18n";

import type { RoadmapData, RequestGuide } from "../types";
import { RoadmapHero } from "./roadmap-hero";
import { RoadmapSection } from "./roadmap-section";
import { RequestGuideSection } from "./request-guide-section";

interface RoadmapPageProps {
  roadmapData: RoadmapData;
  requestGuide: RequestGuide;
}

export const RoadmapPage: FC<RoadmapPageProps> = ({ 
  roadmapData, 
  requestGuide 
}) => {
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
        features={roadmapData.current}
        className="bg-background"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* In Development Section */}
      <RoadmapSection
        title={t("roadmap.sections.inDevelopment.title")}
        subtitle={t("roadmap.sections.inDevelopment.subtitle")}
        description={t("roadmap.sections.inDevelopment.description")}
        features={roadmapData.development}
        className="bg-muted/30"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* Planned Section */}
      <RoadmapSection
        title={t("roadmap.sections.planned.title")}
        subtitle={t("roadmap.sections.planned.subtitle")}
        description={t("roadmap.sections.planned.description")}
        features={roadmapData.planned}
        className="bg-background"
      />

      <Separator className="max-w-6xl mx-auto" />

      {/* Request Guide Section */}
      <RequestGuideSection guide={requestGuide} />
    </div>
  );
};