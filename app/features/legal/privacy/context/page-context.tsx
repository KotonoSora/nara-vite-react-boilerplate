import { createContext, useContext } from "react";

export interface PrivacyPageContextValue {
  githubRepository: string;
}

const PrivacyPageContext = createContext<PrivacyPageContextValue | undefined>({
  githubRepository: "",
});

export function usePageContext() {
  const context = useContext(PrivacyPageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a PrivacyPageProvider");
  }
  return context;
}

export const PageContext = PrivacyPageContext;
