import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { type AuthContextValue } from '../context/auth/AuthProvider';
import {} from '../components/LanguegeSelector';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  component: () => <Main />,
});

const Main = () => {
  return <Outlet />;
};
