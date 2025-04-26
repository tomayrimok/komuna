import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { type AuthContextValue } from '../context/auth/AuthProvider';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import {} from '../components/LanguegeSelector';
import { WebView } from '../components/WebView';
import { AppEntry } from '../components/AppEntry';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  beforeLoad: ({ context, location }) => {
    if (
      !context?.auth?.isAuthenticated &&
      !['/login', '/register'].some((route) => location.pathname.startsWith(route))
    ) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <Main />,
});

const Main = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100dvh" minW="100dvw" w="100%" display="flex" bg={isMobile ? 'none' : 'gray.100'} flexDirection="column">
      {isMobile ? (
        <AppEntry>
          <Outlet />
        </AppEntry>
      ) : (
        <WebView />
      )}
      <TanStackRouterDevtools />
    </Box>
  );
};
