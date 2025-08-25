import type { AdminContentProps } from "../types/type";

import { createTypedContext } from "~/features/shared/context/create-type-context";

export const {
  Context: PageContext,
  useContext: usePageContext,
  Provider: PageProvider,
} = createTypedContext<AdminContentProps>("AdminPage");
