import { useAuth } from "./use-auth";

/**
 * Custom hook that retrieves the current authenticated user from the authentication context.
 *
 * @returns The current user object if authenticated, otherwise `undefined` or `null` depending on the authentication state.
 *
 * @example
 * const user = useUser();
 * if (user) {
 *   console.log(`Hello, ${user.name}`);
 * }
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}
