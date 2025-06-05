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

// Define the context value: auth state + login/logout helpers
export interface AuthContextValue {
  sessionDetails: SessionDetails;
  setSessionDetails: React.Dispatch<React.SetStateAction<SessionDetails>>;
  isAuthLoading: boolean;
  isRefetching: boolean;
  currentUserDetails?: ApiTypes.User | null;
  refetchAuth?: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiTypes.User | null | undefined, Error>>;
  logout: () => void;
}
export const defaultAuthContextValues: AuthContextValue = {
  sessionDetails: {
    apartmentId: null,
    role: null,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Context init
  setSessionDetails: () => { },
  isAuthLoading: true,
  isRefetching: false,
  logout: () => null,
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContextValues);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { currentUserDetails, isAuthLoading, isRefetching, refetchAuth } = useAuthQuery();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    apartmentId: null,
    role: null,
  });

  // useEffect(() => {
  //   if (currentUserDetails) {
  //     setSessionDetails({
  //       apartmentId: currentUserDetails.apartments?.[0]?.apartmentId || null,
  //       role: (currentUserDetails.apartments?.[0]?.role as UserRole) || null,
  //     });
  //   }
  // }, [currentUserDetails]);

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

  useEffect(() => {
    // Register the token and start listening for messages
    requestPermissionAndGetToken();
    listenToForegroundMessages((payload) => {
      console.log('Message received while active. ', payload);
      toaster.create({
        meta: { closable: true },
        type: "info",
        title: payload.notification?.title,
        description: payload.notification?.body,
        duration: 5000
      });
    });
  }, []);

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
