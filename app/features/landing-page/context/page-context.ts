import { createContext, useContext } from "react";

export const PageContext = createContext<PageInformation>({
  title: "",
  description: "",
  githubRepository: "",
  commercialLink: "",
  showcases: [],
  steps: [],
  featuresConfig: [],
});

export const usePageContext = () => useContext(PageContext);
