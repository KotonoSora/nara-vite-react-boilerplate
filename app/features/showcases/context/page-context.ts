import { createContext, useContext } from "react";

import type { PageInformation } from "~/features/landing-page/types/type";

export const PageContext = createContext<PageInformation | undefined>(
  undefined,
);

export const usePageContext = () => useContext(PageContext);
