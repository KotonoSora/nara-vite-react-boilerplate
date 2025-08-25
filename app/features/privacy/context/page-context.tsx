import { createContext, useContext } from "react";

import type { PrivacyPageProps } from "../types/type";

const PrivacyPageContext = createContext<PrivacyPageProps | undefined>(
  undefined,
);

export function usePageContext() {
  const context = useContext(PrivacyPageContext);
  if (context === undefined) {
    throw new Error(
      "usePageContext must be used within a privacy PageProvider",
    );
  }
  return context;
}

export const PageContext = PrivacyPageContext;
