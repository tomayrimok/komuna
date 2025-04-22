import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
);
