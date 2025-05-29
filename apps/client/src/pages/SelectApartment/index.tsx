import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { useNavigate } from '@tanstack/react-router';

export const SelectApartment = () => {
  const { currentUserDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            {t('select_apartment.no_apartments.title')}
          </Text>
          <Text fontSize="lg">
            {t('select_apartment.no_apartments.description', { firstName: currentUserDetails?.firstName })}
          </Text>
        </VStack>
        <VStack gap="12">
          <VStack gap="4">
            <Image src="/detailed_icons/join_apartment.png" maxW="200px" />
            <Button size="xl" fontSize="2xl" fontWeight="bold">
              {t('select_apartment.no_apartments.join_apartment')}
            </Button>
          </VStack>
          <VStack gap="5">
            <Image src="/detailed_icons/create_apartment.png" maxW="200px" />
            <Button
              size="xl"
              fontSize="2xl"
              fontWeight="bold"
              onClick={() => {
                // TODO: This is temporary, you can remove this once you implement the create new apartment page
                navigate({ to: '/roommate' });
              }}
            >
              {t('select_apartment.no_apartments.create_new_apartment')}
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
};
