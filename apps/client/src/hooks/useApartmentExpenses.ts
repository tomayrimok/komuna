import { useQuery } from '@tanstack/react-query';
import { fetchApartmentExpenses } from '../api/apartmentExpenses';
import { useAuth } from '../context/auth/AuthProvider';

export const useApartmentExpenses = (userId: string) => {
  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  return useQuery({
    queryKey: ['apartmentExpenses', apartmentId, userId],
    queryFn: () => fetchApartmentExpenses(apartmentId!, userId),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
