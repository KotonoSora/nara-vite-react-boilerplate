import { createContext, useContext } from "react";

export const PageContext = createContext<AdminContentProps>({
  user: undefined,
});

export const usePageContext = () => useContext(PageContext);
