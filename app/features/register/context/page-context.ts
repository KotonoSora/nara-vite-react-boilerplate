import { createContext, useContext } from "react";

import type { RegisterContentProps } from "../types/type";

const PageContext = createContext<RegisterContentProps | undefined>(undefined);

function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error(
      "usePageContext must be used within a register PageContext",
    );
  }
  return context;
}

export { usePageContext, PageContext };
