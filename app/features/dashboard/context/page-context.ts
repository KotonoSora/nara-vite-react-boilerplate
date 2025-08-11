import { createTypedContext } from "~/features/shared/context/create-typed-context";

export const [PageContext, usePageContext] =
  createTypedContext<DashboardContentProps>({
    user: {} as User,
    recentActivity: [],
    stats: {} as Stats,
  });
