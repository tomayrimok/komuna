import { PropsWithChildren } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import { LogoutButton } from '../../components/LogoutButton';
interface ApartmentLayoutProps extends PropsWithChildren {
  logout?: boolean;
  goBack?: () => void;
}

export const ApartmentLayout = ({ goBack, logout = false, children }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" display="flex" flexDirection="column" overflow={"hidden"}>
      {goBack && <BackNavigationBar onGoBack={goBack} />}
      {logout && (
        <Box position="absolute" left="0">
          <LogoutButton />
        </Box>
      )}
      <VStack
        marginTop={goBack ? '20px' : '80px'}
        paddingX="25px"
        backgroundColor="brand.10"
        flex="1"
        gap="16"
        borderRadius="88px"
        borderBottomEndRadius="none"
        borderBottomStartRadius="none"
        flexGrow={1}
        overflow={"hidden"}
      >
        {children}

      </VStack>
    </Box>
  );
};

export default ApartmentLayout;
