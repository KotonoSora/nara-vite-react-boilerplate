import { createContext, useContext } from "react";

export const PageContext = createContext<PageInformation>({
  title: "",
  description: "",
  githubRepository: "",
  commercialLink: "",
  showcases: [],
});

export const usePageContext = () => useContext(PageContext);
