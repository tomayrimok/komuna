import { Button, HStack, Image, PinInput, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { LoginLayout } from './LoginLayout';
import { BackNavigationBar } from '../../components/BackNavigationBar';

interface VerifyPincodeStepProps {
  goBack: () => void;
}

export const VerifyPincodeStep = ({ goBack }: VerifyPincodeStepProps) => {
  const { t } = useTranslation();
  const [pincode, setPincode] = useState(['', '', '', '']);

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
              values={{ phone: '+972509550506' }}
              components={{ phone: <b dir="ltr" /> }}
            />
          </Text>
        </VStack>
        <PinInput.Root value={pincode} onValueChange={(e) => setPincode(e.value)} size="2xl" variant="outline">
          <PinInput.HiddenInput />
          <PinInput.Control fontWeight="bold" fontSize="2xl" dir="ltr">
            <PinInput.Input index={0} background="white" />
            <PinInput.Input index={1} background="white" />
            <PinInput.Input index={2} background="white" />
            <PinInput.Input index={3} background="white" />
          </PinInput.Control>
        </PinInput.Root>
      </VStack>

      <HStack dir="ltr"></HStack>
      <VStack paddingBottom={'7'}>
        <Button size="xl" fontSize="2xl" fontWeight="bold">
          {t('login.pin_code.continue')}
        </Button>
        <Button
          variant="plain"
          color="brand.950"
          fontWeight="bold"
          fontSize="md"
          //   TODO: Add resend code functionality
          onClick={() => alert('נשמע לי כמו בעיה שלך')}
        >
          {t('login.pin_code.didnt_get_code')}
        </Button>
      </VStack>
    </LoginLayout>
  );
};
