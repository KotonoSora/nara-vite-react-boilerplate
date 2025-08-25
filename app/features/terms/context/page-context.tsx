import { createContext, useContext } from "react";

import type { TermsPageProps } from "../types/type";

const TermsPageContext = createContext<TermsPageProps | undefined>(undefined);

export function usePageContext() {
  const context = useContext(TermsPageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a terms PageProvider");
  }
  return context;
}

export const PageContext = TermsPageContext;
