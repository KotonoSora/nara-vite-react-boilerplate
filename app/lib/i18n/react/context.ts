import { createContext } from "react";

import type { I18nContextValue } from "../types/context";

/**
 * React context for internationalization (i18n) features.
 * Provides access to the current i18n state and functions throughout the component tree.
 *
 * @see I18nContextValue for the context value interface.
 */
export const I18nContext = createContext<I18nContextValue | null>(null);
