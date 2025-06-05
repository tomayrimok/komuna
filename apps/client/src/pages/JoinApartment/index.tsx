import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { Button, PinInput, Spacer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { times } from 'lodash';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/auth/AuthProvider';
import { UserRole } from 'libs/types/src/enums';
import { ApiTypes } from '@komuna/types';

const JoinApartment = () => {
  const [pincode, setPincode] = useState(['', '', '', '']);
  const { setSession, currentUserDetails } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const joinApartmentMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await axios.post<ApiTypes.UserApartment>(`/api/apartment/join/${code}`);
      return data;
    },
    onSuccess: async (data) => {
      toaster.create({
        title: t('join_existing_apartment.success'),
        type: 'success',
        duration: 5000,
      });

      await setSession({
        apartmentId: data.apartmentId,
        role: data.role as UserRole,
      });
    },
    onError: () => {
      toaster.create({
        title: t('error.action_failed'),
        type: 'error',
      });
    },
  });

  useEffect(() => {
    if (currentUserDetails?.apartments.length) {
      navigate({ to: `/select-apartment` });
    }
  }, [currentUserDetails?.apartments.length]);

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
