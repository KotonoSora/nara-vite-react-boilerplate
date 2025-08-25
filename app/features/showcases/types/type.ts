export type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

export type PageInformation = {
  githubRepository?: string;
  commercialLink?: string;
  showcases?: ProjectInfo[];
};
