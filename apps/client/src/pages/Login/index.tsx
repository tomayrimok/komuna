import React, { useEffect, useState } from 'react';
import { EnterPhoneStep } from './EnterPhoneStep';
import { VerifyPincodeStep } from './VerifyPincodeStep';
import { CreateProfileStep } from './CreateProfileStep';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '../../context/auth/AuthProvider';

type LoginSteps = 'enter_phone' | 'verify_pincode' | 'create_profile';

export const Login = () => {
  const { refetchAuth, currentUserDetails } = useAuth();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const navigate = useNavigate();
  const search = useSearch({ from: '/login' });
  const [loginStep, setLoginStep] = useState<LoginSteps>('enter_phone');

  const onSendPincodeSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setLoginStep('verify_pincode');
  };

  const onPincodeSuccess = async (isUser: boolean) => {
    if (isUser) {
      await refetchAuth?.();
    } else {
      setLoginStep('create_profile');
    }
  };

  const onUserCreatedSuccessfully = async () => {
    await refetchAuth?.();
  };

  useEffect(() => {
    if (currentUserDetails) {
      navigate({
        to: search.redirect ?? (
          (currentUserDetails.apartments
            && currentUserDetails.apartments.length > 0)
            ? '/select-apartment'
            : '/new-apartment'
        ),
        replace: true,
      });
    }
  }, [currentUserDetails, navigate, search.redirect]);

  switch (loginStep) {
    case 'enter_phone':
      return <EnterPhoneStep onSendPincodeSuccess={onSendPincodeSuccess} />;
    case 'verify_pincode':
      return (
        <VerifyPincodeStep
          goBack={() => setLoginStep('enter_phone')}
          phoneNumber={phoneNumber}
          onPincodeSuccess={onPincodeSuccess}
        />
      );
    case 'create_profile':
      return <CreateProfileStep phoneNumber={phoneNumber} onUserCreatedSuccessfully={onUserCreatedSuccessfully} />;
    default:
      return null;
  }
};
