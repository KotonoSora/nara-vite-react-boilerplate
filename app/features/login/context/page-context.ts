import { createTypedContext } from "~/features/shared/context/create-typed-context";

export const [PageContext, usePageContext] =
  createTypedContext<LoginContentProps>({
    error: undefined,
  });
