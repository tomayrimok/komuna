import { Box, ChakraProvider, LocaleProvider, useBreakpointValue } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import * as ReactDOM from 'react-dom/client';
import theme from './chakra/theme';
import { ColorModeProvider } from './chakra/ui/color-mode';
import { Toaster } from './chakra/ui/toaster';
import { WebView } from './components/WebView';
import { AuthProvider, defaultAuthContextValues, useAuth } from './context/auth/AuthProvider';
import { useLocaleChange } from './hooks/useLocaleChange';
import './i18n/';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  context: defaultAuthContextValues,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

const RouterWrapper = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={auth} />;
};

const AppEntry = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box minH="100dvh" w="100%" display="flex" bg={isMobile ? 'none' : 'gray.100'} flexDirection="column">
      {isMobile ? (
        <AuthProvider>
          <RouterWrapper />
          <Toaster />
        </AuthProvider>
      ) : (
        <WebView />
      )}
    </Box>
  );
};

const Root = () => {
  const { locale } = useLocaleChange();
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={locale}>
        <ChakraProvider value={theme}>
          <ColorModeProvider>
            <AppEntry />
          </ColorModeProvider>
        </ChakraProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

root.render(<Root />);
