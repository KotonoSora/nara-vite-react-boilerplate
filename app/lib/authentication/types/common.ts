import type { UserSchema } from "./user";

export interface AuthContextValue {
  user: UserSchema | null;
  isAuthenticated: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  user: UserSchema | null;
}
