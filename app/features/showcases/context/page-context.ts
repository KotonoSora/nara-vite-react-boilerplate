import type { PageInformation } from "../types/type";

import { createTypedContext } from "~/features/shared/context/create-type-context";

export const {
  Context: PageContext,
  useContext: usePageContext,
  Provider: PageProvider,
} = createTypedContext<PageInformation>("ShowcasePage");
