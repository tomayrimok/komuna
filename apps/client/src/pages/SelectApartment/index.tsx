import { Button, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../CreateApartment/ApartmentLayout';

const apartments = [
  { address: 'ישראל אהרוני 10', role: UserRole.ROOMMATE },
  { address: 'טשרניחובסקי 50', role: UserRole.LANDLORD },
];

export const SelectApartment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ApartmentLayout>
      <Text textAlign='center' fontSize="2xl" fontWeight="bold" >
        {t('choose_apartment.title')}
      </Text>
      <VStack gap='6'>
        {apartments.map((apartment) => {
          return (
            <Button
              size="xl"
              fontSize="2xl"
              fontWeight="bold"
              h="200px"
              variant="outline"
              backgroundColor='transparent'
              onClick={() => { navigate({ to: '/roommate' }); }}>
              <VStack w='100%'>
                <Image h='60px' src="/detailed_icons/apartment.png" />
                <Text>{apartment.address}</Text>
                <Text>(
                  {apartment.role === UserRole.ROOMMATE ?
                    t('choose_apartment.renter')
                    : t('choose_apartment.leaser')}
                  )
                </Text>
              </VStack>
            </Button>
          )
        })}
      </VStack>
      <Spacer />
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold"
        backgroundColor='transparent'
        onClick={() => { navigate({ to: '/create-apartment' }); }}>
        + {t('select_apartment.no_apartments.create_new_apartment')}
      </Button>
    </ApartmentLayout >
  );
};
