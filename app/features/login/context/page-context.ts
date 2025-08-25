import { createContext, useContext } from "react";

import type { LoginContentProps } from "../types/type";

const PageContext = createContext<LoginContentProps | undefined>(undefined);

function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a login PageContext");
  }
  return context;
}

export { usePageContext, PageContext };
