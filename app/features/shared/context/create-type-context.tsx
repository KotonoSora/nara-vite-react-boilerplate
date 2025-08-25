import { createContext, useContext } from "react";

import type { ReactNode } from "react";

/**
 * Generic function to create a context with a custom hook
 *
 * @param contextName The name of the context (used for error messages).
 * @returns An object containing the context, the custom hook, and the provider component.
 */
export function createTypedContext<T>(contextName: string) {
  // Create the context
  const Context = createContext<T | undefined>(undefined);

  // Custom hook to use the context
  function useTypedContext() {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(
        `use${contextName} must be used within a ${contextName}Context.Provider`,
      );
    }

    return context;
  }

  // Provider component wrapper for convenience
  function Provider({ children, value }: { children: ReactNode; value: T }) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  return {
    Context,
    useContext: useTypedContext,
    Provider,
  };
}
