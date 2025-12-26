import type { ProjectInfo } from "~/features/showcases/types/type";

export type ProjectInfoWithoutID = Omit<ProjectInfo, "id">;

export type Step = {
  number: number;
  title: string;
  description: string;
  command: string;
  note?: string;
};

export type FeatureCardConfig = {
  icon: string;
  title: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    icon: string;
    hover: string;
    background: string;
  };
};

export type LandingPageContextType = {
  showcases: Promise<ProjectInfo[]>;
  builtInDemos: ProjectInfo[];
  steps: Step[];
  featuresConfig: FeatureCardConfig[];
};

export type BrandLogoProps = {
  url: string;
  onClick?: () => void;
  className?: string;
};

export type FeatureCardProps = {
  config: FeatureCardConfig;
};
