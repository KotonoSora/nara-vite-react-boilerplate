import { createContext, useContext } from "react";

export const PageContext = createContext<LoginContentProps>({
  error: undefined,
});

export const usePageContext = () => useContext(PageContext);
