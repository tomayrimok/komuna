import { useTranslation } from 'react-i18next';
import ApartmentLayout from '../NewApartment/ApartmentLayout';
import { ApartmentTitle } from '../NewApartment/ApartmentTitle';
import { Button, PinInput, Spacer, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { times } from 'lodash';
import { useNavigate } from '@tanstack/react-router';
import axios, { AxiosError } from 'axios';
import { toaster } from '../../chakra/ui/toaster';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/auth/AuthProvider';
import { UserRole } from 'libs/types/src/enums';
import { ApiTypes } from '@komuna/types';
import MainButton from '../../components/mainButton';

const JoinApartment = () => {
  const [pincode, setPincode] = useState(['', '', '', '']);
  const [sessionSet, setSessionSet] = useState(false);

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
      setSessionSet(true);
    },
    onError: (error) => {
      const isConflict = (error as AxiosError).response?.status === 409;
      const isNotFound = (error as AxiosError).response?.status === 404;
      let title = t('error.action_failed');
      if (isConflict) title = t('join_existing_apartment.apartment_already_joined');
      if (isNotFound) title = t('join_existing_apartment.apartment_not_found');
      toaster.create({
        title,
        type: 'error',
      });
    },
  });

  useEffect(() => {
    if (currentUserDetails?.apartments.length && sessionSet) {
      navigate({ to: `/select-apartment` });
    }
  }, [currentUserDetails?.apartments.length, sessionSet, navigate]);

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
        mt={"30px"}
        w="full"
        display="flex"
        justifyContent="center"
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
      <MainButton
        bottom="20px"
        loading={joinApartmentMutation.isPending}
        onClick={() => joinApartmentMutation.mutate(pincode.join(''))}
      >
        {t('join_existing_apartment.join_btn')}
      </MainButton>
    </ApartmentLayout>
  );
};

export default JoinApartment;
