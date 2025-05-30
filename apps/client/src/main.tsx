import './i18n/';
import '@silk-hq/components/unlayered-styles';
import '@silk-hq/components/layered-styles';

import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, ChakraProvider, LocaleProvider, useBreakpointValue } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';
import { ColorModeProvider } from './chakra/ui/color-mode';
import theme from './chakra/theme';
import { useLocaleChange } from './hooks/useLocaleChange';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthProvider, defaultAuthContextValues, useAuth } from './context/auth/AuthProvider';
import { Toaster } from './chakra/ui/toaster';
import { WebView } from './components/WebView';

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
    <Box
      height="100dvh"
      width="100dvw"
      w="100%"
      display="flex"
      overflow="hidden"
      bg={isMobile ? 'none' : 'gray.100'}
      flexDirection="column"
    >
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

const Root = () => {
  const locale = useLocaleChange();
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={locale}>
        <ChakraProvider value={theme}>
          <ColorModeProvider>
            <Global
              styles={css`
                html {
                  dir: ${locale === 'he' ? 'rtl' : 'ltr'};
                }
              `}
            />
            <AppEntry />
          </ColorModeProvider>
        </ChakraProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

root.render(<Root />);
