import { createTypedContext } from "~/features/shared/context/create-typed-context";

export interface TermsPageContextValue {
  githubRepository: string;
}

export const [PageContext, usePageContext] =
  createTypedContext<TermsPageContextValue>({
    githubRepository: "",
  });
