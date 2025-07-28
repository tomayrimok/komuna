import { createRootRouteWithContext, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuth, type AuthContextValue } from '../context/auth/AuthProvider';
import { useEffect } from 'react';
import { UserRole } from '@komuna/types';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  component: () => <Main />,
});

const Main = () => {
  const { currentUserDetails, sessionDetails } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUserDetails) {
      navigate({ to: '/login', replace: true });
    }
    if (sessionDetails?.role === UserRole.LANDLORD && location.pathname === '/new-apartment') {
      navigate({ to: '/landlord', replace: true });
    }
  }, [sessionDetails, navigate]);

  return <Outlet />;
};
