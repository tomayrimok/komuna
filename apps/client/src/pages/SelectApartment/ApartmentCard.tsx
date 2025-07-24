import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { Apartment } from 'libs/types/src/generated';
import { useTranslation } from 'react-i18next';

interface ApartmentCardProps {
  apartment: Apartment;
  role: UserRole;
  handleClick: (apartmentId: string, role: UserRole) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, role, handleClick }) => {
  const { t } = useTranslation();

  return (
    <Button
      size="xl"
      fontSize="2xl"
      fontWeight="bold"
      h="200px"
      width={"250px"}
      border="1px solid"
      backgroundColor="transparent"
      whiteSpace="normal"
      wordBreak="break-word"
      onClick={() => handleClick(apartment.apartmentId, role)}
      bg={"white"}
    >
      <VStack width={"100%"} justifyContent={"space-between"}>
        <Image h="60px" src="/detailed_icons/apartment.png" />
        <Text>{apartment.address + ' ' + apartment.city}</Text>
        <Text fontSize="md">({role === UserRole.ROOMMATE ? t('choose_apartment.renter') : t('choose_apartment.leaser')})</Text>
      </VStack>
    </Button>
  );
};

export default ApartmentCard;
