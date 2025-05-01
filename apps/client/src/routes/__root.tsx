import { createRootRouteWithContext, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth, type AuthContextValue } from '../context/auth/AuthProvider';
import { useEffect } from 'react';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  component: () => <Main />,
});

const Main = () => {
  const { currentUserDetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserDetails) {
      navigate({ to: '/login', replace: true });
    }
  }, [currentUserDetails, navigate]);

  return <Outlet />;
};
