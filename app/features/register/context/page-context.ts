import type { RegisterContentProps } from "../types/type";

import { createTypedContext } from "~/features/shared/context/create-type-context";

export const {
  Context: PageContext,
  useContext: usePageContext,
  Provider: PageProvider,
} = createTypedContext<RegisterContentProps>("RegisterPage");
