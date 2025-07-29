import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { ApartmentSettings } from './ApartmentSettings';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { ApartmentInfo } from './ApartmentInfo';
import { RenterSettings } from './RenterSettings';
import { CreateApartmentDto, RENTER_PAYMENT_WAYS, UserRole } from '@komuna/types';
import type { UpdateFieldOfPageFn } from './create-apartment.types';
import { ShareApartmentCode } from './ShareApartmentCode';
import { useCreateApartment } from '../../hooks/query/useCreateApartment';
import { toaster } from '../../chakra/ui/toaster';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEY } from '../../hooks/query/useAuthQuery';
import { useAuth } from '../../context/auth/AuthProvider';

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
  isEdit: boolean;
}

const INITIAL_APT_DETAILS: CreateApartmentDto = {
  apartmentInfo: {
    name: '',
    address: '',
    city: '',
    role: UserRole.ROOMMATE,
  },
  apartmentSettings: {
    contractEndDate: undefined,
    contractUrl: '',
    rent: undefined,
    billsDetails: {
      electricity: '',
      water: '',
      internet: '',
      gas: '',
    },
  },
  renterSettings: {
    rent: undefined,
    payableByUserId: '',
    houseCommitteeRent: undefined,
    houseCommitteePayerUserId: RENTER_PAYMENT_WAYS.RENTER,
  },
};

const CreateApartmentForm: FC<CreateApartmentFormProps> = ({ page, aptDetails, setPageState, isEdit }) => {
  switch (page) {
    case CreateApartmentPages.ApartmentInfo:
      return <ApartmentInfo aptDetails={aptDetails} updateField={setPageState('apartmentInfo')} />;
    case CreateApartmentPages.ApartmentSettings:
      return <ApartmentSettings aptDetails={aptDetails} updateField={setPageState('apartmentSettings')} />;
    case CreateApartmentPages.RenterSettings:
      return <RenterSettings aptDetails={aptDetails} updateField={setPageState('renterSettings')} isEdit={isEdit} />;
    case CreateApartmentPages.ShareApartmentCode:
      return <ShareApartmentCode />;
    case CreateApartmentPages.GoToApp:
      return <Navigate to="/" />;
    default:
      return null;
  }
};

interface CreateApartmentProps {
  isEdit?: boolean;
}

/**
 * Wraps the CreateApartmentForm in a layout with a back button.
 */
const CreateApartment: FC<CreateApartmentProps> = ({ isEdit }) => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);
  const [aptDetails, setsAptDetails] = useState<CreateApartmentDto>(INITIAL_APT_DETAILS);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setSessionDetails } = useAuth();
  const { triggerCreateApartment } = useCreateApartment({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] }); // getting the new apartment
      setSessionDetails(() => ({ apartmentId: res.apartmentId, role: aptDetails.apartmentInfo.role }));
      setPage(CreateApartmentPages.ShareApartmentCode);
    },
    onError: () => {
      toaster.create({
        title: t('error.action_failed'),
        type: 'error',
      });
    },
  });

  const [showSkipBtn, showContinueBtn] = useMemo(
    () => [
      !isEdit && (page === CreateApartmentPages.ApartmentSettings || page === CreateApartmentPages.RenterSettings),
      page !== CreateApartmentPages.ShareApartmentCode,
    ],
    [isEdit, page]
  );

  const updateFieldOfPage: UpdateFieldOfPageFn = (page) => (field, value) => {
    setsAptDetails((currState) => ({
      ...currState,
      [page]: {
        ...currState[page],
        [field]: value,
      },
    }));
  };

  const incPage = () => {
    setPage((p) => p + 1);
  };

  const handleOnClick = () => {
    if (
      (aptDetails.apartmentInfo.role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings) ||
      (aptDetails.apartmentInfo.role === UserRole.ROOMMATE && page === CreateApartmentPages.RenterSettings)
    ) {
      triggerCreateApartment(aptDetails);
      return;
    }
    incPage();
  };

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
      goBack={page !== CreateApartmentPages.ShareApartmentCode ? () => goPageBack(page) : undefined}
      boxProps={{ height: "100%" }}
    >
      {/* <VStack flexGrow={1} overflow={"auto"} width="100vw" paddingY={"30px"} paddingX={"25px"} > */}
      <CreateApartmentForm
        page={page}
        aptDetails={aptDetails}
        setPageState={updateFieldOfPage}
        isEdit={isEdit || false}
      />
      <HStack gap="30px" mt={"auto"} justifyContent={"space-between"}>
        {showSkipBtn && (
          <Button size="xl" variant={"ghost"} onClick={handleOnClick}>
            {t('create_apartment.skip_btn')}
          </Button>
        )}
        {showContinueBtn && (
          <Button size="xl" onClick={handleOnClick}>
            {(aptDetails.apartmentInfo.role === UserRole.LANDLORD && page === CreateApartmentPages.ApartmentSettings) ||
              (aptDetails.apartmentInfo.role === UserRole.ROOMMATE && page === CreateApartmentPages.RenterSettings)
              ? isEdit
                ? t('create_apartment.save_btn')
                : t('create_apartment.done_btn')
              : t('create_apartment.continue_btn')}
          </Button>
        )}
      </HStack>
      {/* </VStack> */}
    </ApartmentLayout>
  );
};

export default CreateApartment;
