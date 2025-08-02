import type { User } from "~/features/auth/services/user.server";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  user: User | null;
}
