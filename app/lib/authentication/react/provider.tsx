import type { JSX } from "react";

import type { AuthProviderProps } from "../types/common";

import { AuthContext } from "./context";

/**
 * Provides authentication context to its child components.
 *
 * @param {AuthProviderProps} props - The props for the AuthProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 * @param {User | null} props.user - The current authenticated user, or null if not authenticated.
 *
 * @returns {JSX.Element} The AuthContext provider wrapping the children.
 */
export function AuthProvider({
  children,
  user,
}: AuthProviderProps): JSX.Element {
  const value = {
    user,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
