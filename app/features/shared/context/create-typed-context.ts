import { createContext, useContext } from "react";

// Small helper to create a typed React context with its hook
export function createTypedContext<T>(defaultValue: T) {
  const Ctx = createContext<T>(defaultValue);
  const useCtx = () => useContext(Ctx);
  return [Ctx, useCtx] as const;
}
