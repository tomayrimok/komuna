import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, HStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ApartmentSettings } from './ApartmentSettings';
import ShareApartmentCode from './ShareApartmentCode';
import ApartmentLayout from './ApartmentLayout';
import { ApartmentInfo } from './ApartmentInfo';
import RenterSettings from './RenterSettings';
import { UserRole } from '@komuna/types';

enum CreateApartmentPages {
  ApartmentInfo = 1,
  ApartmentSettings = 2,
  RenterSettings = 3,
  ShareApartmentCode = 4,
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
    case CreateApartmentPages.ShareApartmentCode:
      return (
        <ShareApartmentCode />
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
  const [role, setRole] = useState<UserRole>(UserRole.LANDLORD);

  const [showSkipBtn, showContinueBtn] = useMemo(() => [
    page === CreateApartmentPages.ApartmentSettings || page === CreateApartmentPages.RenterSettings,
    page !== CreateApartmentPages.ShareApartmentCode
  ], [page, role]);

  const handleOnClick = () => {
    if (role === UserRole.LANDLORD && page < CreateApartmentPages.ApartmentSettings
      || role === UserRole.ROOMMATE && page <= CreateApartmentPages.RenterSettings) setPage((p) => p + 1);
    if (role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings) setPage(CreateApartmentPages.ShareApartmentCode);
  }

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
      goBack={page !== CreateApartmentPages.ShareApartmentCode && (() => goPageBack(page))}>
      <CreateApartmentForm page={page} />
      <HStack gap="30px">
        {showSkipBtn && <Button
          size="xl"
          fontSize="2xl"
          fontWeight="bold"
          backgroundColor="transparent"
          onClick={handleOnClick}
        >
          {t('create_apartment.skip_btn')}
        </Button>}
        {showContinueBtn && <Button
          size="xl"
          fontSize="2xl"
          fontWeight="bold"
          onClick={handleOnClick}
        >
          {role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings
            || role === UserRole.ROOMMATE && page === CreateApartmentPages.RenterSettings ?
            t('create_apartment.done_btn') : t('create_apartment.continue_btn')}
        </Button>}
      </HStack>
    </ApartmentLayout >
  );
};

export default CreateApartment;