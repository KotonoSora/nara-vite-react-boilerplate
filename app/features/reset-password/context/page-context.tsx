import { createContext, useContext } from "react";

import type { ResetPasswordPageProps } from "../types/type";

const PageContext = createContext<ResetPasswordPageProps | undefined>(
  undefined,
);

function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error(
      "usePageContext must be used within a forgot password PageContext",
    );
  }
  return context;
}

export { usePageContext, PageContext };
