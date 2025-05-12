import { ApartmentInfo } from './ApartmentInfo';
import { FC, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import RenterSettings from './RenterSettings';
import { ApartmentSettings } from './ApartmentSettings';
import ApartmentLayout from './ApartmentLayout';
import { Button, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

enum CreateApartmentPages {
  ApartmentInfo = 1,
  ApartmentSettings = 2,
  RenterSettings = 3,
}

interface CreateApartmentFormProps {
  page: CreateApartmentPages;
}

const CreateApartmentForm: FC<CreateApartmentFormProps> = ({ page }) => {
  switch (page) {
    case CreateApartmentPages.ApartmentInfo:
      return (
        <ApartmentInfo />
      );
    case CreateApartmentPages.ApartmentSettings:
      return (
        <ApartmentSettings />
      );
    case CreateApartmentPages.RenterSettings:
      return (
        <RenterSettings />
      );
    default:
      return null;
  }
};

/**
 * Wraps the CreateApartmentForm in a layout with a back button.
 */
const CreateApartment = () => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);

  // const [apartmentInfo, setApartmentInfo] = useState<ApartmentInfoDto>({
  //   name: '',
  //   address: '',
  //   city: '',
  //   role: UserRoleName.Renter
  // });

  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Goes back one page, unless on the first page, in which case it navigates to the select apartment page.
   */
  const goPageBack = (currentPage: CreateApartmentPages) => {
    if (currentPage === CreateApartmentPages.ApartmentInfo) {
      navigate({ to: '/new-apartment' });
    } else {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <ApartmentLayout
      goBack={() => goPageBack(page)}>
      <CreateApartmentForm page={page} />
      <HStack gap="30px">
        <Button
          size="xl"
          fontSize="2xl"
          fontWeight="bold"
          backgroundColor="transparent"
        >
          {t('create_apartment.skip_btn')}
        </Button>
        <Button
          size="xl"
          fontSize="2xl"
          fontWeight="bold"
        >
          {t('create_apartment.continue_btn')}
        </Button>
      </HStack>
    </ApartmentLayout >
  );
};

export default CreateApartment;