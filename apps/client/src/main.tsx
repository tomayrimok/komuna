import './i18n/';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { ChakraProvider, LocaleProvider } from '@chakra-ui/react';
import { ColorModeProvider } from './chakra/ui/color-mode';
import theme from './chakra/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <LocaleProvider locale="he-IL">
      <ChakraProvider value={theme}>
        <ColorModeProvider>
          <App />
        </ColorModeProvider>
      </ChakraProvider>
    </LocaleProvider>
  </StrictMode>
);
