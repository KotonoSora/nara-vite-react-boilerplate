import { createContext } from "react-router";

export function createMiddlewareContext<T>(contextName: string) {
  const Context = createContext<T>();

  return {
    [contextName]: Context,
  };
}
