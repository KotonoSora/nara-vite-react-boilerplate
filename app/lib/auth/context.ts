import { createContext, useContext } from "react";

import type { AuthContextValue } from "./types";

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function useOptionalAuth(): AuthContextValue {
  return useContext(AuthContext);
}

export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
