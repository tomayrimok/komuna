import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@komuna/types';

type Auth = {
  isAuthenticated: boolean;
  role: UserRole | null;
  user?: {
    id: string;
  };
};

// Define the context value: auth state + login/logout helpers
export interface AuthContextValue {
  auth: Auth;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const defaultAuthContextValues: AuthContextValue = {
  auth: {
    isAuthenticated: true,
    role: null,
  },
  login: () => null,
  logout: () => null,
};

export const AuthContext = createContext<AuthContextValue>(
  defaultAuthContextValues
);

// Provider component that wraps your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: true,
    role: null,
  });

  const login = (role: UserRole) => {
    // In a real app, you'd verify credentials, fetch tokens, etc.
    setAuth({ isAuthenticated: true, role, user: { id: 'user-id' } });
  };

  const logout = () => {
    // Clear any stored tokens or session info here
    setAuth({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('`useAuth` must be used within an `AuthProvider`');
  }
  return context;
};
