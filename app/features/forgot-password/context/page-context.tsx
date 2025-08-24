import { createContext, useContext } from "react";

import type { ForgotPasswordPageProps } from "../types/type";

const PageContext = createContext<ForgotPasswordPageProps | undefined>(
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
