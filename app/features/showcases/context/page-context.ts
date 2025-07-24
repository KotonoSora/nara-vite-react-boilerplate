import { createContext, useContext } from "react";

export const PageContext = createContext<{
  showcases: ProjectInfo[];
}>({
  showcases: [],
});

export const usePageContext = () => useContext(PageContext);
