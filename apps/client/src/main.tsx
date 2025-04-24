import './i18n/';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './chakra/ui/color-mode';
import theme from './chakra/theme';
import { useLocaleChange } from './hooks/useLocaleChange';
import PaymentPage from './components/Payments/PaymentPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Root = () => {
  const locale = useLocaleChange();
  const queryClient = new QueryClient()

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider locale={locale}>
          <ChakraProvider value={theme}>
            <ColorModeProvider>
              <PaymentPage />
            </ColorModeProvider>
          </ChakraProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

root.render(<Root />);
