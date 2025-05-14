import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/auth/AuthProvider';
import { BalanceDetailsResponse } from '@komuna/types';
import axios from 'axios';

export const fetchDebtPayments = async (apartmentId: string, userId: string) => {
  const params = { apartmentId, userId };

  const [{ data: balanceDetails }, { data: balance }] = await Promise.all([
    axios.get<BalanceDetailsResponse[]>('/api/debt-edge/user-balance-details', { params }),
    axios.get('/api/debt-edge/user-balance', { params }),
  ]);
  return { balanceDetails, balance };
};

export const useUserBalanceDetails = (userId: string) => {
  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  return useQuery({
    queryKey: ['debtPayments', apartmentId, userId],
    queryFn: () => fetchDebtPayments(apartmentId!, userId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
