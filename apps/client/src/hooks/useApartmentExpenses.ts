import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ApartmentExpenseResponse } from '@komuna/types';
import { useAuth } from '../context/auth/AuthProvider';

export const fetchApartmentExpenses = async (apartmentId: string, userId: string) => {
  const { data: apartmentExpenses } = await axios.get<ApartmentExpenseResponse[]>('/api/expense/apartment-expenses', {
    params: {
      apartmentId,
      userId,
    },
  });

  return { apartmentExpenses };
};

export const useApartmentExpenses = (userId = '') => {
  const { sessionDetails } = useAuth();
  const apartmentId = sessionDetails?.apartmentId || '';

  return useQuery({
    queryKey: ['apartmentExpenses', apartmentId, userId],
    queryFn: () => fetchApartmentExpenses(apartmentId, userId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!apartmentId && !!userId,
  });
};
