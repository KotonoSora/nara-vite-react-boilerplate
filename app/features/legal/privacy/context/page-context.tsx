import { createTypedContext } from "~/features/shared/context/create-typed-context";

export interface PrivacyPageContextValue {
  githubRepository: string;
}

export const [PageContext, usePageContext] =
  createTypedContext<PrivacyPageContextValue>({
    githubRepository: "",
  });
