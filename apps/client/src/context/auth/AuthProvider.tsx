import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, API, ApiTypes } from '@komuna/types';
import { AUTH_QUERY_KEY, useAuthQuery } from '../../hooks/query/useAuthQuery';
import { LoadingApp } from '../../components/LoadingApp';
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query';

type SessionDetails = {
  apartmentId: string | null;
  role: UserRole | null;
};

// Define the context value: auth state + login/logout helpers
export interface AuthContextValue {
  sessionDetails: SessionDetails;
  isAuthLoading: boolean;
  isRefetching: boolean;
  currentUserDetails?: ApiTypes.User | null;
  refetchAuth?: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiTypes.User | null | undefined, Error>>;
  logout: () => void;
}

export const defaultAuthContextValues: AuthContextValue = {
  sessionDetails: {
    apartmentId: 'ec1e1d1f-e070-4124-bee9-1859a0531572',
    role: null,
  },
  isAuthLoading: true,
  isRefetching: false,
  logout: () => null,
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContextValues);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { currentUserDetails, isAuthLoading, isRefetching, refetchAuth } = useAuthQuery();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    apartmentId: 'ec1e1d1f-e070-4124-bee9-1859a0531572',
    role: null,
  });

  const logout = async () => {
    // Clear any stored tokens or session info here
    try {
      await API.userControllerLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setSessionDetails(defaultAuthContextValues.sessionDetails);
    queryClient.setQueryData([AUTH_QUERY_KEY], null);
  };

  if (isAuthLoading) return <LoadingApp />;
  return (
    <AuthContext.Provider
      value={{ sessionDetails, isAuthLoading, isRefetching, currentUserDetails, logout, refetchAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('`useAuth` must be used within an `AuthProvider`');
  }
  return context;
};
