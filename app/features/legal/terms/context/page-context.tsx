import { createContext, useContext } from "react";

export interface TermsPageContextValue {
  githubRepository?: string;
}

const TermsPageContext = createContext<TermsPageContextValue | undefined>(
  undefined,
);

export function usePageContext() {
  const context = useContext(TermsPageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a TermsPageProvider");
  }
  return context;
}

export const PageContext = TermsPageContext;
