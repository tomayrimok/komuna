import { PropsWithChildren } from 'react';
import { Box, BoxProps, Flex, Stack, StackProps, Text, VStack } from '@chakra-ui/react';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import { LogoutButton } from '../../components/LogoutButton';
import { BorderProps } from '@chakra-ui/system';
interface ApartmentLayoutProps extends PropsWithChildren, Omit<StackProps, 'title'> {
  logout?: boolean;
  goBack?: () => void;
  containerProps?: BoxProps;
  header?: React.ReactNode;
  title?: string | React.ReactNode;
  borderRadius?: BorderProps['borderRadius'];
  boxProps?: BoxProps;
}

export const ApartmentLayout = ({ goBack, logout = false, children, containerProps, header, title, borderRadius, boxProps, ...props }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" display="flex" flexDirection="column" overflow={"hidden"} maxH="100vh" {...boxProps as any}>
      <Flex alignItems="center" gap={1} p={3}>
        {goBack && <BackNavigationBar onGoBack={goBack} />}
        {title && typeof title === 'string' ? <Text fontSize="xl" fontWeight="bold">{title}</Text> : title}
      </Flex>
      {header}
      {logout && (
        <Box position="absolute" left="0">
          <LogoutButton />
        </Box>
      )}
      <VStack
        marginTop={goBack || header || title ? '20px' : '80px'}
        backgroundColor="brand.10"
        flex="1"
        gap="16"
        borderRadius={borderRadius || "88px"}
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
