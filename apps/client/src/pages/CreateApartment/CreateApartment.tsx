import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, HStack } from '@chakra-ui/react';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { ApartmentSettings } from './ApartmentSettings';
import { ShareApartmentCode } from './ShareApartmentCode';
import { ApartmentInfo } from './ApartmentInfo';
import RenterSettings from './RenterSettings';
import { CreateApartmentDto, RENTER_PAYMENT_WAYS, UserRole, type CreateApartmentHttpResponse } from '@komuna/types';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import type { UpdateFieldOfPageFn } from './create-apartment.types';
import ApartmentLayout from '../NewApartment/ApartmentLayout';

enum CreateApartmentPages {
  ApartmentInfo = 1,
  ApartmentSettings = 2,
  RenterSettings = 3,
  ShareApartmentCode = 4,
  GoToApp = 5,
}

interface CreateApartmentFormProps {
  page: CreateApartmentPages;
  aptDetails: CreateApartmentDto;
  setPageState: UpdateFieldOfPageFn;
}

const INITIAL_APT_DETAILS: CreateApartmentDto = {
  apartmentInfo: {
    name: "",
    address: "",
    city: "",
    role: UserRole.ROOMMATE,
  },
  apartmentSettings: {
    contractEndDate: undefined,
    contractUrl: "",
    rent: undefined,
    billsDetails: {
      electricity: "",
      water: "",
      internet: "",
      gas: "",
    },
  },
  renterSettings: {
    rent: undefined,
    payableByUserId: "",
    houseCommitteeRent: undefined,
    houseCommitteePayerUserId: RENTER_PAYMENT_WAYS.RENTER,
  },
}

const CreateApartmentForm: FC<CreateApartmentFormProps> = ({ page, aptDetails, setPageState }) => {
  switch (page) {
    case CreateApartmentPages.ApartmentInfo:
      return <ApartmentInfo
        aptDetails={aptDetails}
        updateField={setPageState("apartmentInfo")}
      />;
    case CreateApartmentPages.ApartmentSettings:
      return <ApartmentSettings
        aptDetails={aptDetails}
        updateField={setPageState("apartmentSettings")}
      />;
    case CreateApartmentPages.RenterSettings:
      return <RenterSettings
        aptDetails={aptDetails}
        updateField={setPageState("renterSettings")}
      />;
    case CreateApartmentPages.ShareApartmentCode:
      return <ShareApartmentCode />;
    case CreateApartmentPages.GoToApp:
      return <Navigate to="/" />; // TODO CHECK
    default:
      return null;
  }
};


/**
* Wraps the CreateApartmentForm in a layout with a back button.
*/
const CreateApartment = () => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);
  const [aptDetails, setsAptDetails] = useState<CreateApartmentDto>(INITIAL_APT_DETAILS);

  const incPage = () => { setPage(p => p + 1); }

  const updateFieldOfPage: UpdateFieldOfPageFn = (page) => (field, value) => {
    setsAptDetails((currState) => ({
      ...currState,
      [page]: {
        ...(currState[page]),
        [field]: value,
      },
    }));
  };

  const [showSkipBtn, showContinueBtn] = useMemo(() => [
    page === CreateApartmentPages.ApartmentSettings || page === CreateApartmentPages.RenterSettings,
    page !== CreateApartmentPages.ShareApartmentCode
  ], [page]);

  const createApartmentMutation = useMutation<CreateApartmentHttpResponse>({ //TODO move into hooks folder, and create interfaces
    mutationKey: ['createApartment'],
    mutationFn: async () => {
      const res = await axios.post('/api/apartment', aptDetails);
      return res.data
    },
    onSuccess: () => {
      setPage(CreateApartmentPages.ShareApartmentCode);
    },
    onError: () => {
      toaster.create({
        title: t('error.action_failed'),
        type: 'error'
      })
    }
  })

  const handleOnClick = () => {//TODO check
    if (
      (aptDetails.apartmentInfo.role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings) ||
      (aptDetails.apartmentInfo.role === UserRole.ROOMMATE && page === CreateApartmentPages.RenterSettings)
    ) {
      createApartmentMutation.mutate();
      return;
    }
    incPage();
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
      <CreateApartmentForm
        page={page}
        aptDetails={aptDetails}
        setPageState={updateFieldOfPage}
      />
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
          {(aptDetails.apartmentInfo.role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings) ||
            (aptDetails.apartmentInfo.role === UserRole.ROOMMATE && page === CreateApartmentPages.RenterSettings)
            ? t('create_apartment.done_btn')
            : t('create_apartment.continue_btn')}
        </Button>}
      </HStack>
    </ApartmentLayout >
  );
};

export default CreateApartment;
