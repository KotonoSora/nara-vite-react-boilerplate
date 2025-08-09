import { createContext, useContext } from "react";

import type { SupportedLanguage } from "~/lib/i18n";

export interface TermsPageContextValue {
  language: SupportedLanguage;
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
