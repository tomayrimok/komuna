import { ApartmentInfo } from './ApartmentInfo';
import { Apartment } from '../../../../server/src/apartment/apartment.entity';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '../../context/auth/AuthProvider';
import ApartmentSettings from './ApartmentSettings';
import RenterSettings from './RenterSettings';

enum CreateApartmentPages {
  ApartmentInfo,
  ApartmentSettings,
  RenterSettings,
}

export const CreateApartment = () => {
  const [page, setPage] = useState<CreateApartmentPages>(CreateApartmentPages.ApartmentInfo);

  const navigate = useNavigate();

  switch (page) {
    case CreateApartmentPages.ApartmentInfo:
      return (
        <ApartmentInfo />
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

export default CreateApartment;

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
