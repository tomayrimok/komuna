import { PropsWithChildren } from 'react';
import { Box, BoxProps, Stack, StackProps, VStack } from '@chakra-ui/react';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import { LogoutButton } from '../../components/LogoutButton';
interface ApartmentLayoutProps extends PropsWithChildren, StackProps {
  logout?: boolean;
  goBack?: () => void;
  containerProps?: BoxProps;
  header?: React.ReactNode;
}

export const ApartmentLayout = ({ goBack, logout = false, children, containerProps, header, ...props }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" display="flex" flexDirection="column" overflow={"hidden"} maxH="100vh">
      {header}
      {goBack && <BackNavigationBar onGoBack={goBack} />}
      {logout && (
        <Box position="absolute" left="0">
          <LogoutButton />
        </Box>
      )}
      <VStack
        marginTop={goBack || header ? '20px' : '80px'}
        backgroundColor="brand.10"
        flex="1"
        gap="16"
        borderRadius="88px"
        borderBottomEndRadius="none"
        borderBottomStartRadius="none"
        flexGrow={1}
        overflow={"hidden"}
        {...props as any}
      >
        <Stack h="full" gap={4} w="full" p={"25px"} overflow={"auto"} {...containerProps as any}>
          {children}
        </Stack>
      </VStack>
    </Box>
  );
};

export default ApartmentLayout;
