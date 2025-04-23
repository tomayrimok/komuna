import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { WebView } from '../components/WebView';
import { Home } from '../components/Home';

export default function App() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box
      minH="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isMobile ? 'white' : 'gray.100'}
      p={4}
    >
      {isMobile ? <Home /> : <WebView />}
    </Box>
  );
}
