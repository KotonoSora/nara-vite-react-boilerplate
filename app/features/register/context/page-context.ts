import { createContext, useContext } from "react";

export const PageContext = createContext<RegisterContentProps>({
  error: undefined,
});

export const usePageContext = () => useContext(PageContext);
