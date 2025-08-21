import { createContext, useContext } from "react";

import type { AdminContentProps } from "../types/types";

/**
 * Context for the admin page.
 */
export const PageContext = createContext<AdminContentProps | undefined>(
  undefined,
);

/**
 * Custom hook to access the admin page context.
 * @returns The admin content props from the context
 */
export const usePageContext = () => useContext(PageContext);
