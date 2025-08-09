import { createContext, useContext } from "react";

import type { SupportedLanguage } from "~/lib/i18n";

export interface PrivacyPageContextValue {
  language: SupportedLanguage;
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
