import { useContext } from "react";

import type { AuthContextValue } from "../types/common";

import { AuthContext } from "../react/context";

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextValue} The current authentication context value.
 *
 * @example
 * const { user, signIn, signOut } = useAuth();
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
