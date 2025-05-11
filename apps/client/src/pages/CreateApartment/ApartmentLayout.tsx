import { Box, HStack, VStack } from "@chakra-ui/react"
import { ReactNode } from "@tanstack/react-router"
import { LogoutButton } from "../../components/LogoutButton"

export const ApartmentLayout = ({ children }: ReactNode) => {
  return (
    <Box backgroundColor="brand.500" flex="1" display="flex" flexDirection="column" gap="0">
      <HStack justifyContent="end" paddingX="2" paddingY="1">
        <LogoutButton />
      </HStack>
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
}

export default ApartmentLayout;