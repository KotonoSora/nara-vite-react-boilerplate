import type { FetchShowcasesResult } from "~/features/landing-page/utils/fetch-showcases";

export type ProjectInfo = {
  id: number | string;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
};

export type PageInformation = {
  showcases: Promise<FetchShowcasesResult>;
  builtInDemos: ProjectInfo[];
};
