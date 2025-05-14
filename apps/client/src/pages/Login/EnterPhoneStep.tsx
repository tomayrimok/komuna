import { useState } from 'react';
import { Button, Heading, HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { withMask } from 'use-mask-input';
import { LoginLayout } from './LoginLayout';
import { useRequestVerificationCode } from '../../hooks/query/useRequestVerificationCode';

interface EnterPhoneStepProps {
  onSendPincodeSuccess: (phone: string) => void;
}

export const EnterPhoneStep = ({ onSendPincodeSuccess }: EnterPhoneStepProps) => {
  const [prefix, setPrefix] = useState('+972');
  const [phone, setPhone] = useState('');
  const { t } = useTranslation();
  const { sendCode, isPending, isSuccess } = useRequestVerificationCode({
    onSuccess: ({ phoneNumber }) => {
      onSendPincodeSuccess(phoneNumber);
    },
  });

  const isLoading = isPending || isSuccess;

  const onSendCode = () => {
    const phonePrefix = prefix.replace(/[()]/g, '');
    const number = phone.replace(/\s+/g, '');
    const phoneNumber = `${phonePrefix}${number}`.trim();
    sendCode({ phoneNumber });
  };

  return (
    <LoginLayout
      heading={
        <VStack gap="1" paddingTop="16">
          <Heading fontFamily="logo" size="4xl" height="5" letterSpacing="wide">
            {t('komuna')}
          </Heading>
          <Text fontWeight="bold" fontSize="5xl">
            {t('welcome')}
          </Text>
        </VStack>
      }
    >
      <VStack>
        <Text fontSize="2xl" fontWeight="bold">
          {t('login.title')}
        </Text>
        <Text>{t('login.description')}</Text>
      </VStack>

      <HStack dir="rtl">
        <Input
          backgroundColor="white"
          size="2xl"
          fontSize="2xl"
          type="tel"
          letterSpacing="widest"
          dir="ltr"
          placeholder="50 9999999"
          ref={withMask('99 9999999')}
          width="200px"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          value={phone}
        />
        <Input
          backgroundColor="white"
          fontSize="2xl"
          letterSpacing="widest"
          size="2xl"
          type="tel"
          dir="ltr"
          onChange={(e) => setPrefix(e.target.value)}
          value={prefix}
          placeholder="(+972)"
          ref={withMask('(+999)')}
          width="120px"
        />
      </HStack>
      <Button disabled={!phone} size="xl" fontSize="2xl" fontWeight="bold" loading={isLoading} onClick={onSendCode}>
        {t('login.send_code')}
      </Button>
      <Image src="/meerkats/waving.png" width="20vh" />
    </LoginLayout>
  );
};
