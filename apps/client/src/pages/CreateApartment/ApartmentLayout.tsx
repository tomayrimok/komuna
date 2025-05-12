import { Box, HStack, Image, Stack, VStack } from "@chakra-ui/react"
import { ReactNode } from "@tanstack/react-router"
import { BackNavigationBar } from "../../components/BackNavigationBar";

interface ApartmentLayoutProps {
  goBack: () => void;
  children: ReactNode;
}

export const ApartmentLayout = ({ goBack, children }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column">
      <BackNavigationBar onGoBack={goBack} />
      <VStack
        marginTop="10px"
        paddingY="44px"
        paddingX="25px"
        backgroundColor="brand.10"
        flex="1"
        gap="16"
        borderRadius="88px"
        borderBottomEndRadius="none"
        borderBottomStartRadius="none"
      >
        {children}
      </VStack>
    </Box>
  );
}

export default ApartmentLayout;