import { createContext } from "react";

import type { AuthContextValue } from "../types/common";

/**
 * React context for authentication state.
 *
 * Provides the current authenticated user and authentication status
 * throughout the component tree.
 *
 * @see AuthContextValue for the context value shape.
 */
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});
