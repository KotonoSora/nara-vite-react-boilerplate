import type { User } from "./user.server";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  user: User | null;
}
