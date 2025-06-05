import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/auth/AuthProvider';
import { useApartment } from '../../../hooks/useApartment';
import { SettleUpDetails } from './SettleUpDetails';
import { User } from 'libs/types/src/generated/types.gen';

export const SettleUpUser = () => {
  const { toUserId } = useParams({ from: '/roommate/payments/settle-up/user/$toUserId' });
  const { data: apartmentData } = useApartment();
  const { currentUserDetails } = useAuth();
  const { t } = useTranslation();

  const fromUser = useMemo<User | null>(() => currentUserDetails!, [toUserId]);
  const toUser = useMemo<User | null>(
    () => apartmentData?.residents.find((user) => user.userId === toUserId)?.user ?? null,
    [apartmentData, toUserId]
  );

  return <SettleUpDetails fromUser={fromUser!} toUser={toUser!} debtAmount={0} />;
};
