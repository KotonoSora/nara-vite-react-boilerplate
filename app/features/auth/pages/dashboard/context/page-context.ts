import { createContext, useContext } from "react";

export const PageContext = createContext<DashboardContentProps>({
  user: {} as User,
  recentActivity: [],
  stats: {} as Stats,
});

export const usePageContext = () => useContext(PageContext);
