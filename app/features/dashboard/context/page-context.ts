import { createContext, useContext } from "react";

import type { DashboardContentProps } from "~/features/dashboard/types/types";

/**
 * Page context for the dashboard
 */
export const PageContext = createContext<DashboardContentProps | undefined>(
  undefined,
);

/**
 * Custom hook to access the page context
 * @returns The dashboard content props from the context
 */
export const usePageContext = () => useContext(PageContext);
