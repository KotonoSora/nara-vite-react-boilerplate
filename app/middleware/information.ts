import { createContext } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type {
  GeneralInformationType,
  PUBLIC_ENV_FLAG,
} from "~/features/shared/types/type";

import { getGeneralInformation } from "~/features/shared/utils/get-general-information";

export const GeneralInformationContext =
  createContext<GeneralInformationType>();

export const generalInformationMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  // Get page information from environment
  const env = import.meta.env as PUBLIC_ENV_FLAG | undefined;

  if (!env) {
    // Optionally, handle missing env more gracefully
    context.set(GeneralInformationContext, {
      title: "",
      description: "",
      githubRepository: "",
      commercialLink: "",
    });

    return await next();
  }

  const pageInformation = getGeneralInformation(env);

  context.set(GeneralInformationContext, pageInformation);
  return await next();
};
