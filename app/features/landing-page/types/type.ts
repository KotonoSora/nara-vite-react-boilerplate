export type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

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

export type PageInformation = {
  title: string;
  description: string;
  githubRepository: string;
  commercialLink?: string;
  showcases: ProjectInfo[];
  steps: Step[];
  featuresConfig: FeatureCardConfig[];
};

export type LandingPageEnv = {
  LANDING_PAGE_TITLE?: string;
  LANDING_PAGE_DESCRIPTION?: string;
  LANDING_PAGE_REPOSITORY?: string;
  LANDING_PAGE_COMMERCIAL_LINK?: string;
};
