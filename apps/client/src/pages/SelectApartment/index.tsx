import { Button, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { useAuth } from '../../context/auth/AuthProvider';
import { useEffect } from 'react';

export const SelectApartment = () => {
  const { currentUserDetails, setSessionDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUserDetails?.apartments && currentUserDetails?.apartments.length === 1) navigate({ to: '/roommate' });
    if (!currentUserDetails || currentUserDetails?.apartments.length === 0) navigate({ to: '/new-apartment' });
  }, [])

  const handleClick = (apartmentId: string, role: UserRole) => {
    setSessionDetails({ apartmentId, role });
    navigate({ to: '/roommate' });
  }

  return (
    <ApartmentLayout>
      <Text textAlign='center' fontSize="2xl" fontWeight="bold" >
        {t('choose_apartment.title')}
      </Text>
      <VStack gap='6'>
        {currentUserDetails?.apartments.map((apartment) =>
          <Button
            key={apartment.apartment.apartmentId}
            size="xl"
            fontSize="2xl"
            fontWeight="bold"
            h="200px"
            variant="outline"
            backgroundColor='transparent'
            onClick={() => handleClick(apartment.apartment.apartmentId, apartment.role)}
          >
            <VStack w='100%'>
              <Image h='60px' src="/detailed_icons/apartment.png" />
              <Text>{apartment.apartment.address}</Text>
              <Text>(
                {apartment.role === UserRole.ROOMMATE ?
                  t('choose_apartment.renter')
                  : t('choose_apartment.leaser')}
                )
              </Text>
            </VStack>
          </Button>
        )}
      </VStack>
      <Spacer />
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold"
        backgroundColor='transparent'
        onClick={() => { navigate({ to: '/new-apartment' }); }}>
        + {t('select_apartment.no_apartments.create_new_apartment')}
      </Button>
    </ApartmentLayout >
  );
};
