import { times } from 'lodash';
import { Button, HStack, Image, PinInput, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { LoginLayout } from './LoginLayout';
import { BackNavigationBar } from '../../components/BackNavigationBar';
import { useRequestVerificationCode } from '../../hooks/query/useRequestVerificationCode';
import { toaster } from '../../chakra/ui/toaster/toaster-store';
import { useVerifyCode } from '../../hooks/query/useVerifyCode';
import { useAuth } from '../../context/auth/AuthProvider';

interface VerifyPincodeStepProps {
  goBack: () => void;
  phoneNumber: string;
  onPincodeSuccess: (isUser: boolean) => void;
}

export const VerifyPincodeStep = ({ goBack, phoneNumber, onPincodeSuccess }: VerifyPincodeStepProps) => {
  const { t } = useTranslation();
  const { isRefetching } = useAuth();
  const [pincode, setPincode] = useState(['', '', '', '']);
  const { sendVerifyCode, isPending: isVerifyPending } = useVerifyCode({
    onSuccess: (result) => {
      onPincodeSuccess(result.isUser);
    },
  });
  const { sendCode, isPending: isResendPending } = useRequestVerificationCode({
    onSuccess: () => {
      toaster.create({
        title: t('login.pin_code.resend_successfully', { phone: phoneNumber }),
        type: 'success',
      });
    },
  });

  return (
    <LoginLayout
      gap="7"
      onGoBack={goBack}
      heading={
        <Stack gap="0">
          <BackNavigationBar onGoBack={goBack} disableGoBack />
          <VStack>
            <Image src="/detailed_icons/sms.png" width="122px" />
          </VStack>
        </Stack>
      }
    >
      <VStack gap="10">
        <VStack>
          <Text fontSize="2xl" fontWeight="bold">
            {t('login.pin_code.title')}
          </Text>
          <Text>
            <Trans
              i18nKey="login.pin_code.description"
              values={{ phone: phoneNumber }}
              components={{ phone: <b dir="ltr" /> }}
            />
          </Text>
        </VStack>
        <PinInput.Root
          value={pincode}
          onValueChange={(e) => setPincode(e.value)}
          size="2xl"
          variant="outline"
          onValueComplete={(details) => sendVerifyCode({ phoneNumber, code: details.valueAsString })}
        >
          <PinInput.HiddenInput />
          <PinInput.Control fontWeight="bold" fontSize="2xl" dir="ltr">
            {times(4, (i) => (
              <PinInput.Input key={i} index={i} background="white" fontSize="40px" />
            ))}
          </PinInput.Control>
        </PinInput.Root>
      </VStack>

      <HStack dir="ltr"></HStack>
      <VStack paddingBottom={'7'}>
        <Button
          size="xl"
          fontSize="2xl"
          fontWeight="bold"
          onClick={() => sendVerifyCode({ phoneNumber, code: pincode.join('') })}
          loading={isVerifyPending || isRefetching}
        >
          {t('login.pin_code.continue')}
        </Button>
        <Button
          variant="plain"
          color="brand.950"
          fontWeight="bold"
          fontSize="md"
          loading={isResendPending}
          onClick={() => sendCode({ phoneNumber })}
        >
          {t('login.pin_code.didnt_get_code')}
        </Button>
      </VStack>
    </LoginLayout>
  );
};
