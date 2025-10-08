export type ProjectInfo = {
  id: number;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

export type PageInformation = {
  title?: string;
  description?: string;
  githubRepository?: string;
  commercialLink?: string;
  showcases?: ProjectInfo[];
};
