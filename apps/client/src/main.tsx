import './i18n/';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './chakra/ui/color-mode';
import theme from './chakra/theme';
import { useLocaleChange } from './hooks/useLocaleChange';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthProvider, defaultAuthContextValues } from './context/auth/AuthProvider';

const router = createRouter({
  routeTree,
  context: defaultAuthContextValues,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

const Root = () => {
  const locale = useLocaleChange();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider locale={locale}>
          <ChakraProvider value={theme}>
            <ColorModeProvider>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </ColorModeProvider>
          </ChakraProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

root.render(<Root />);
