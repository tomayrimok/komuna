import { createRootRouteWithContext, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth, type AuthContextValue } from '../context/auth/AuthProvider';
import { useEffect } from 'react';
import { UserRole } from '@komuna/types';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  component: () => <Main />,
});

const Main = () => {
  const { currentUserDetails, sessionDetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserDetails) {
      navigate({ to: '/login', replace: true });
    }
    if (sessionDetails?.role === UserRole.LANDLORD) {
      navigate({ to: '/landlord', replace: true });
    }
  }, [sessionDetails, navigate]);

  return <Outlet />;
};
