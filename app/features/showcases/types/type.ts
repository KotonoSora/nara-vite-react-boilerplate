export type ProjectInfo = {
  id: number | string;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

export type PageInformation = {
  showcases?: ProjectInfo[];
  builtInDemos: ProjectInfo[];
};
