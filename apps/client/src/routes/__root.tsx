import {
  createRootRouteWithContext,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { type AuthContextValue } from '../context/auth/AuthProvider';
import { Box, useBreakpointValue, VStack } from '@chakra-ui/react';
import { WebView } from '../components/WebView';

export const Route = createRootRouteWithContext<AuthContextValue>()({
  beforeLoad: ({ context, location }) => {
    if (
      !context?.auth?.isAuthenticated &&
      !['/login', '/register'].some((route) =>
        location.pathname.startsWith(route)
      )
    ) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <Main />,
});

const Main = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      minH="100vh"
      w="100%"
      // display="flex"
      // alignItems="center"
      // justifyContent="center"
      bg={isMobile ? 'none' : 'gray.100'}
      p={6}
    >
      <VStack>
        {/* <LanguegeSelector /> */}
        {isMobile ? (
          <>
            {/* <Link to="/login" style={{ backgroundColor: 'yellow' }}>
              Login
            </Link> */}
            {/* <Link to="/register" style={{ backgroundColor: 'yellow' }}>
              Register
            </Link> */}
            <Outlet />
            {/* <Home /> */}
          </>
        ) : (
          <WebView />
        )}
      </VStack>
      {/* <TanStackRouterDevtools /> */}
    </Box>
  );
};
