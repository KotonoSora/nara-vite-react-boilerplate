import { createContext, useContext } from "react";

export const PageContext = createContext<AdminContentProps | undefined>(
  undefined,
);

export const usePageContext = () => useContext(PageContext);
