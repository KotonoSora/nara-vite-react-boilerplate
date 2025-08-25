import { createContext, useContext } from "react";

import type { DashboardContentProps } from "../types/type";

export const PageContext = createContext<DashboardContentProps | undefined>(
  undefined,
);

export const usePageContext = () => useContext(PageContext);
