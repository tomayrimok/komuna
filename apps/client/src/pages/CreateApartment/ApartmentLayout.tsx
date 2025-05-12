import { PropsWithChildren } from "react";
import { Box, VStack } from "@chakra-ui/react"
import { BackNavigationBar } from "../../components/BackNavigationBar";

interface ApartmentLayoutProps extends PropsWithChildren {
  navigate?: Boolean
  goBack?: () => void;
}

export const ApartmentLayout = ({ navigate = true, goBack, children }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column">
      {navigate ? <BackNavigationBar onGoBack={goBack} /> : null}
      <VStack
        marginTop={navigate ? "0px" : "80px"}
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
    </Box >
  );
};

export default ApartmentLayout;
