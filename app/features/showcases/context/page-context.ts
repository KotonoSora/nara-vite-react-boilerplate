import { createContext, useContext } from "react";

export const PageContext = createContext<{
  showcases: ProjectInfo[];
  openDetail: Function;
  closeDetail: Function;
}>({
  showcases: [],
  openDetail: () => {},
  closeDetail: () => {},
});

export const usePageContext = () => useContext(PageContext);
