import type { User } from "~/database/schema";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  user: User | null;
}
