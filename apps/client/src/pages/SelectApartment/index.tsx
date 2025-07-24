import { Button, Text, VStack, Box, Flex } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { useAuth } from '../../context/auth/AuthProvider';
import { UserRole } from '@komuna/types';
import ApartmentCard from './ApartmentCard';
import { useRolePath } from '../../hooks/useRolePath';
import MainButton from '../../components/mainButton';

export const SelectApartment = () => {
  const { currentUserDetails, sessionDetails, setSessionDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rolePath = useRolePath();

  const handleClick = (apartmentId: string, role: UserRole) => {
    setSessionDetails(() => ({ apartmentId, role }));
    navigate({ to: `/${role.toLowerCase()}` });
  };

  return (
    <ApartmentLayout
      goBack={sessionDetails.role ? () => navigate({ to: rolePath }) : undefined}
      logout={!sessionDetails.role}
    >
      <Flex position={"relative"} flexGrow={1} overflow={"hidden"} marginBottom={"90px"}>
        <VStack flexGrow={1} alignItems={"center"} paddingTop={"35px"} overflow={"auto"} width="100vw">
          <Text paddingX={"25px"} textAlign="center" fontSize="2xl" fontWeight="bold" marginBottom={"20px"}>
            {t('choose_apartment.title')}
          </Text>
          {/* <Box position="relative" flexGrow={1} overflow={"auto"}> */}
          <VStack
            width="100vw"
            maxWidth="100vw"
            bgGradient="linear(to-t, white, transparent)"
            gap="6"
            position="relative"
          >
            {currentUserDetails?.landlordApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.apartmentId}
                apartment={apartment}
                role={UserRole.LANDLORD}
                handleClick={handleClick}
              />
            ))}
            {currentUserDetails?.apartments.map((apartment) => (
              <ApartmentCard
                key={apartment.apartment.apartmentId}
                apartment={apartment.apartment}
                role={UserRole.ROOMMATE}
                handleClick={handleClick}
              />
            ))}
          </VStack>
          {/* </Box> */}
          <MainButton
            isFixed={true}
            bottom="20px"
            onClick={() => {
              navigate({ to: '/new-apartment' });
            }}
          >
            + {t('choose_apartment.create_new_apartment_btn')}
          </MainButton>
        </VStack>
        <Box
          position="absolute"
          bottom="-1vh"
          left="0"
          right="0"
          height="5vh"
          pointerEvents="none"
          backgroundImage="linear-gradient(to top, {colors.brand.10}, transparent)"
        />
      </Flex>
    </ApartmentLayout>
  );
};
