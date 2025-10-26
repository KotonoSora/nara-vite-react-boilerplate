import { useAuth } from "./use-auth";

/**
 * Custom hook that returns the current authentication status of the user.
 *
 * @returns {boolean} `true` if the user is authenticated, otherwise `false`.
 *
 * @example
 * ```tsx
 * const isAuthenticated = useIsAuthenticated();
 * if (isAuthenticated) {
 *   // Render protected content
 * }
 * ```
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
