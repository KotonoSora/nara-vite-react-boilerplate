import { useAuth } from "./use-auth";

export function useUser() {
  const { user } = useAuth();
  return user;
}
