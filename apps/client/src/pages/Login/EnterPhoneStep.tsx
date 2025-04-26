import { useState } from 'react';
import { Button, Heading, HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { withMask } from 'use-mask-input';
import { LoginLayout } from './LoginLayout';
import { useMutation } from '@tanstack/react-query';
import { toaster } from '../../chakra/ui/toaster';

interface EnterPhoneStepProps {
  onSendPincodeSuccess: () => void;
}

export const EnterPhoneStep = ({ onSendPincodeSuccess }: EnterPhoneStepProps) => {
  const [phone, setPhone] = useState('');
  const { t } = useTranslation();
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log('login');
          resolve();
          onSendPincodeSuccess();
        }, 3000);
      });
    },
    onSuccess: () => {
      onSendPincodeSuccess();
    },
    onError: () => {
      toaster.create({
        title: t('error.action_failed'),
        type: 'error',
      });
    },
  });

  const isLoading = isPending || isSuccess;

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

      <HStack>
        <Input
          backgroundColor="white"
          size="2xl"
          fontSize="2xl"
          type="tel"
          letterSpacing="widest"
          dir="ltr"
          placeholder="999 999 9999"
          ref={withMask('### ### ####')}
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
          value={'(+972)'}
          placeholder="(+972)"
          ref={withMask('(+999)')}
          width="120px"
        />
      </HStack>
      <Button disabled={!phone} size="xl" fontSize="2xl" fontWeight="bold" loading={isLoading} onClick={() => mutate()}>
        {t('login.send_code')}
      </Button>
      <Image src="/meerkats/waving.png" width="20vh" />
    </LoginLayout>
  );
};
