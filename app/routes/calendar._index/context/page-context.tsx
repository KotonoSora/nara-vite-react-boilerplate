import { createContext, useContext } from "react";

import type { PageContextValue } from "../types/type";

export const PageContext = createContext<PageContextValue | undefined>(
  undefined,
);

export function usePageContext() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePageContext must be used within PageProvider");
  return ctx;
}
