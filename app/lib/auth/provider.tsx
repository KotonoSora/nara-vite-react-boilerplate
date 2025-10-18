import type { AuthProviderProps } from "./types";

import { AuthContext } from "./context";

export function AuthProvider({ children, user }: AuthProviderProps) {
  const value = {
    user,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
