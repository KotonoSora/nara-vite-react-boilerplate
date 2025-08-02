import { useMemo } from "react";

import type { AuthProviderProps } from "./types";

import { AuthContext } from "./context";

export function AuthProvider({ children, user }: AuthProviderProps) {
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
