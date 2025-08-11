import { createTypedContext } from "~/features/shared/context/create-typed-context";
import { defaultPageInformation } from "~/features/shared/context/default-page-information";

export const [PageContext, usePageContext] =
  createTypedContext<PageInformation>(defaultPageInformation);
