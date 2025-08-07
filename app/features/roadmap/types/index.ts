export interface RoadmapFeature {
  title: string;
  description: string;
  status: FeatureStatus;
  eta?: string;
  badge?: FeatureBadge;
}

export type FeatureStatus = 
  | "Stable"
  | "In Progress" 
  | "Planning"
  | "Research"
  | "Planned";

export type FeatureBadge = 
  | "New"
  | "Popular"
  | "Community Requested"
  | "Experimental";

export interface RoadmapSection {
  title: string;
  subtitle: string;
  description: string;
  features: Record<string, RoadmapFeature>;
}

export interface RoadmapData {
  current: Record<string, RoadmapFeature>;
  development: Record<string, RoadmapFeature>;
  planned: Record<string, RoadmapFeature>;
}

export interface RequestStep {
  title: string;
  description: string;
}

export interface RequestGuide {
  steps: Record<string, RequestStep>;
  template: {
    title: string;
    description: string;
    content: string;
  };
  guidelines: {
    title: string;
    items: Record<string, string>;
  };
}