import { API, ApiTypes, UserRole } from '@komuna/types';
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { listenToForegroundMessages, requestPermissionAndGetToken } from '../../app/firebase/notifications';
import { toaster } from '../../chakra/ui/toaster';
import { LoadingApp } from '../../components/LoadingApp';
import { AUTH_QUERY_KEY, useAuthQuery } from '../../hooks/query/useAuthQuery';

type SessionDetails = {
  apartmentId: string | null;
  role: UserRole | null;
};

const SESSION_DETAILS_STORAGE_KEY = 'sessionDetails';

// Define the context value: auth state + login/logout helpers
export interface AuthContextValue {
  sessionDetails: SessionDetails;
  setSessionDetails: React.Dispatch<React.SetStateAction<SessionDetails>>;
  isAuthLoading: boolean;
  isRefetching: boolean;
  currentUserDetails?: ApiTypes.User | null;
  refetchAuth?: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiTypes.User | null | undefined, Error>>;
  logout: () => void;
  setSession: (sessionDetails: SessionDetails) => Promise<QueryObserverResult<ApiTypes.User | null | undefined, Error>>;
}
export const defaultAuthContextValues: AuthContextValue = {
  sessionDetails: {
    apartmentId: null,
    role: null,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Context init
  setSessionDetails: () => {},
  isAuthLoading: true,
  isRefetching: false,
  logout: () => null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Context init
  setSession: () => Promise.resolve({} as QueryObserverResult<ApiTypes.User | null | undefined, Error>),
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContextValues);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { currentUserDetails, isAuthLoading, isRefetching, refetchAuth } = useAuthQuery();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>(defaultAuthContextValues.sessionDetails);

  useEffect(() => {
    const localStorageSession = localStorage.getItem(SESSION_DETAILS_STORAGE_KEY);
    if (localStorageSession) setSessionDetails(JSON.parse(localStorageSession));
  }, []);

  useEffect(() => {
    if (sessionDetails.apartmentId && sessionDetails.role)
      localStorage.setItem(SESSION_DETAILS_STORAGE_KEY, JSON.stringify(sessionDetails));
  }, [sessionDetails]);

  const logout = async () => {
    // Clear any stored tokens or session info here
    try {
      await API.userControllerLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem(SESSION_DETAILS_STORAGE_KEY);
    setSessionDetails(defaultAuthContextValues.sessionDetails);
    queryClient.setQueryData([AUTH_QUERY_KEY], null);
  };

  useEffect(() => {
    // Register the token and start listening for messages
    requestPermissionAndGetToken();
    listenToForegroundMessages((payload) => {
      console.log('Message received while active. ', payload);
      toaster.create({
        meta: { closable: true },
        type: 'info',
        title: payload.notification?.title,
        description: payload.notification?.body,
        duration: 5000,
      });
    });
  }, []);

  const setSession = async (sessionDetails: SessionDetails) => {
    setSessionDetails(sessionDetails);
    return queryClient.invalidateQueries({
      queryKey: [AUTH_QUERY_KEY],
    });
  };

  if (isAuthLoading) return <LoadingApp />;
  return (
    <AuthContext.Provider
      value={{
        sessionDetails,
        setSessionDetails,
        isAuthLoading,
        isRefetching,
        currentUserDetails,
        logout,
        refetchAuth,
        setSession,
      }}
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
