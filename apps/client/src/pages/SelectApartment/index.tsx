import { Button, Text, VStack, Box } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { useAuth } from '../../context/auth/AuthProvider';
import { UserRole } from '@komuna/types';
import ApartmentCard from './ApartmentCard';
import { useRolePath } from '../../hooks/useRolePath';

export const SelectApartment = () => {
  const { currentUserDetails, sessionDetails, setSessionDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rolePath = useRolePath();

  const handleClick = (apartmentId: string, role: UserRole) => {
    setSessionDetails(() => ({ apartmentId, role }));
    navigate({ to: `/${role.toLowerCase()}` });
  }

  return (
    <ApartmentLayout
      goBack={sessionDetails.role ? () => navigate({ to: rolePath }) : undefined}
      logout={!sessionDetails.role}>
      <Text textAlign='center' fontSize="2xl" fontWeight="bold" >
        {t('choose_apartment.title')}
      </Text>
      <Box position="relative" height="55vh" maxH="55vh">
        <VStack
          maxH="55vh"
          width="100vw"
          maxWidth="100vw"
          overflowY="auto"
          scrollBehavior="smooth"
          bgGradient="linear(to-t, white, transparent)"
          gap='6'>
          {currentUserDetails?.landlordApartments.map((apartment) =>
            <ApartmentCard
              key={apartment.apartmentId}
              apartment={apartment}
              role={UserRole.LANDLORD}
              handleClick={handleClick}
            />
          )}
          {currentUserDetails?.apartments.map((apartment) =>
            <ApartmentCard
              key={apartment.apartment.apartmentId}
              apartment={apartment.apartment}
              role={UserRole.ROOMMATE}
              handleClick={handleClick}
            />
          )}
        </VStack>
        <Box
          position="absolute"
          bottom="-1vh"
          left="0"
          right="0"
          height="5vh"
          pointerEvents="none"
          backgroundImage='linear-gradient(to top, {colors.brand.10}, transparent)'
        />
      </Box>
      <Button
        size="xl"
        fontSize="2xl"
        fontWeight="bold"
        position='fixed'
        bottom='5vh'
        backgroundColor='transparent'
        onClick={() => { navigate({ to: '/new-apartment' }); }}>
        + {t('choose_apartment.create_new_apartment_btn')}
      </Button>
    </ApartmentLayout >
  );
};
