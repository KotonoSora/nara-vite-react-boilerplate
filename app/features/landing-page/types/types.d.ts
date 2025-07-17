type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

type Step = {
  number: number;
  title: string;
  description: string;
  command: string;
  note?: string;
};

type PageInformation = {
  title: string;
  description: string;
  githubRepository: string;
  commercialLink?: string;
  showcases: ProjectInfo[];
  steps: Step[];
};

type LandingPageEnv = {
  LANDING_PAGE_TITLE?: string;
  LANDING_PAGE_DESCRIPTION?: string;
  LANDING_PAGE_REPOSITORY?: string;
  LANDING_PAGE_COMMERCIAL_LINK?: string;
};
