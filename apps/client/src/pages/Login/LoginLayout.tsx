import React, { ComponentProps, ReactNode } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { BackNavigationBar } from '../../components/BackNavigationBar';

interface LoginLayoutProps {
  heading: ReactNode;
  children: ReactNode;
  gap?: ComponentProps<typeof Box>['gap'];
  onGoBack?: () => void;
}
export const LoginLayout = ({ children, heading, gap = '16', onGoBack }: LoginLayoutProps) => (
  <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column" gap={gap}>
    {heading}
    <VStack
      paddingTop="44px"
      paddingX="25px"
      backgroundColor="brand.10"
      flex="1"
      gap="10"
      borderRadius="88px"
      borderBottomEndRadius="none"
      borderBottomStartRadius="none"
      justifyContent="space-between"
    >
      {children}
    </VStack>
  </Box>
);
