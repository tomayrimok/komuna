import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { Button, PinInput, Spacer } from '@chakra-ui/react';
import { useState } from 'react';
import { times } from 'lodash';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { useMutation } from '@tanstack/react-query';

const JoinApartment = () => {
  const [pincode, setPincode] = useState(['', '', '', '']);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const joinApartmentMutation = useMutation({
    mutationFn: async (code: string) => {
      await axios.post(`/api/apartment/join/${code}`);
    },
    onSuccess: () => {
      toaster.create({
        title: t('join_existing_apartment.success'),
        type: 'success',
      });
    },
    onError: () => {
      toaster.create({
        title: t('error.action_failed'),
        type: 'error',
      });
    },
  });

  return (
    <ApartmentLayout
      goBack={() => {
        navigate({ to: '/new-apartment' });
      }}
    >
      <ApartmentTitle
        title={t('join_existing_apartment.title')}
        description={t('join_existing_apartment.description')}
      />
      <PinInput.Root
        otp
        autoFocus
        value={pincode}
        onValueChange={(e) => setPincode(e.value)}
        size="2xl"
        variant="outline"
        // onValueComplete={(details) => ({ code: details.valueAsString })}
      >
        <PinInput.HiddenInput />
        <PinInput.Control fontWeight="bold" fontSize="2xl" dir="ltr">
          {times(4, (i) => (
            <PinInput.Input key={i} index={i} background="white" fontSize="40px" />
          ))}
        </PinInput.Control>
      </PinInput.Root>
      <Spacer />
      <Button size="xl" fontSize="2xl" fontWeight="bold" onClick={() => joinApartmentMutation.mutate(pincode.join(''))}>
        {t('join_existing_apartment.join_btn')}
      </Button>
    </ApartmentLayout>
  );
};

export default JoinApartment;
