import { createContext, useContext } from "react";

export interface PrivacyPageContextValue {
  language?: string;
}

const PrivacyPageContext = createContext<PrivacyPageContextValue | undefined>(
  undefined,
);

export function usePageContext() {
  const context = useContext(PrivacyPageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a PrivacyPageProvider");
  }
  return context;
}

export const PageContext = PrivacyPageContext;
