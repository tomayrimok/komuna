import React from 'react';
import { EnterPhoneStep } from './EnterPhoneStep';
import { VerifyPincodeStep } from './VerifyPincodeStep';

export const Login = () => {
  const [isPincodeSent, setIsPincodeSent] = React.useState(false);

  const onSendPincodeSuccess = () => {
    // Simulate sending a pincode
    setTimeout(() => {
      setIsPincodeSent(true);
    }, 1000);
  };

  const goBack = () => {
    setIsPincodeSent(false);
  };

  if (isPincodeSent) return <VerifyPincodeStep goBack={goBack} />;
  return <EnterPhoneStep onSendPincodeSuccess={onSendPincodeSuccess} />;
};
