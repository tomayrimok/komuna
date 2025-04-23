import './i18n/';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './chakra/ui/color-mode';
import theme from './chakra/theme';
import { useLocaleChange } from './hooks/useLocaleChange';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Root = () => {
  const locale = useLocaleChange();
  return (
    <StrictMode>
      <LocaleProvider locale={locale}>
        <ChakraProvider value={theme}>
          <ColorModeProvider>
            <App />
          </ColorModeProvider>
        </ChakraProvider>
      </LocaleProvider>
    </StrictMode>
  );
};

root.render(<Root />);
