import { Box, HStack, VStack } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { BackNavigationBar } from "../../components/BackNavigationBar";
import { LogoutButton } from "../../components/LogoutButton";

type Buttons = "back" | "logout";
interface ApartmentLayoutProps extends PropsWithChildren<{}> {
  button?: Buttons;
  onButtonClick?: () => void;
}

export const ApartmentLayout = ({ children, button = "logout", onButtonClick }: ApartmentLayoutProps) => {
  return (
    <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column" gap="0">
      {button === "back" ? (
        <BackNavigationBar onGoBack={onButtonClick} />
      ) : (
        <HStack justifyContent="end" paddingX="2" paddingY="1">
          <LogoutButton />
        </HStack>
      )}
      <VStack
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
};

export default ApartmentLayout;
