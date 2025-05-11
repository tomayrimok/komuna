import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/auth/AuthProvider';
import { LogoutButton } from '../../components/LogoutButton';
import { useNavigate } from '@tanstack/react-router';
import ApartmentLayout from '../CreateApartment/ApartmentLayout';

export const SelectApartment = () => {
  const { currentUserDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ApartmentLayout>
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
          <Button size="xl" fontSize="2xl" fontWeight="bold"
            onClick={() => { navigate({ to: '/create-apartment' }); }}>
            {t('select_apartment.no_apartments.create_new_apartment')}
          </Button>
        </VStack>
      </VStack>
    </ApartmentLayout>
  );
};
