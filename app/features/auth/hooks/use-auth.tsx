import { createContext, useContext } from "react";
import type { User } from "~/features/auth/services/user.server";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: User | null;
}) {
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useOptionalAuth() {
  return useContext(AuthContext);
}