import { useContext } from "react";

import type { AuthContextValue } from "../types/common";

import { AuthContext } from "../react/context";

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
