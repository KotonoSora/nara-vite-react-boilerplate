export type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

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
