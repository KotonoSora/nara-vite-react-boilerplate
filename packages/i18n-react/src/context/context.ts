import { createContext } from "react";

import type { I18nReactContextValue } from "../types/context";

/**
 * React context for internationalization (i18n) features.
 * Provides access to the current i18n state and functions throughout the component tree.
 *
 * @see I18nReactContextValue for the context value interface.
 */
export const I18nReactContext = createContext<I18nReactContextValue | null>(
  null,
);
