import { useNavigate } from '@tanstack/react-router';
import { useState, type FC } from 'react';
import { ApartmentInfo } from './ApartmentInfo';
import ApartmentLayout from './ApartmentLayout';
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
        <ApartmentInfo
          goBack={goBack}
        />
      );
    case CreateApartmentPages.ApartmentSettings:
      return (
        <ApartmentSettings
        // goBack={() => setPage(CreateApartmentPages.ApartmentInfo))}
        />
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
export const CreateApartment = () => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Goes back one page, unless on the first page, in which case it navigates to the select apartment page.
   */
  const goPageBack = (currentPage: CreateApartmentPages) => {
    if (currentPage === CreateApartmentPages.ApartmentInfo) {
      navigate({ to: '/select-apartment' });
    } else {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <ApartmentLayout
      // navigate={false}
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

// export const CreateApartment = () => {
//   const { refetchAuth, currentUserDetails } = useAuth();
//   const [phoneNumber, setPhoneNumber] = React.useState('');
//   const navigate = useNavigate();
//   const search = useSearch({ from: '/login' });
//   const [loginStep, setLoginStep] = useState<LoginSteps>('enter_phone');

//   const onSendPincodeSuccess = (phone: string) => {
//     setPhoneNumber(phone);
//     setLoginStep('verify_pincode');
//   };

//   const onPincodeSuccess = async (isUser: boolean) => {
//     if (isUser) {
//       await refetchAuth?.();
//     } else {
//       setLoginStep('create_profile');
//     }
//   };

//   const onUserCreatedSuccessfully = async () => {
//     await refetchAuth?.();
//   };

//   useEffect(() => {
//     if (currentUserDetails) {
//       navigate({
//         to: search.redirect ?? '/select-apartment',
//         replace: true,
//       });
//     }
//   }, [currentUserDetails, navigate, search.redirect]);

//   switch (loginStep) {
//     case 'enter_phone':
//       return <EnterPhoneStep onSendPincodeSuccess={onSendPincodeSuccess} />;
//     case 'verify_pincode':
//       return (
//         <VerifyPincodeStep
//           goBack={() => setLoginStep('enter_phone')}
//           phoneNumber={phoneNumber}
//           onPincodeSuccess={onPincodeSuccess}
//         />
//       );
//     case 'create_profile':
//       return <CreateProfileStep phoneNumber={phoneNumber} onUserCreatedSuccessfully={onUserCreatedSuccessfully} />;
//     default:
//       return null;
//   }
// };
