import { createContext, useContext } from "react";

export const PageContext = createContext<PageInformation>({
  title: "",
  description: "",
  githubRepository: "",
  commercialLink: "",
  showcases: [],
  steps: [],
});

export const usePageContext = () => useContext(PageContext);
