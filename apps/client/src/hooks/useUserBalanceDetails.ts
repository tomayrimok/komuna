import { useQuery } from '@tanstack/react-query';
import { fetchUserBalanceDetails } from '../api/userBalanceDetails';
import { useAuth } from '../context/auth/AuthProvider';

export const useUserBalanceDetails = () => {
  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  return useQuery({
    queryKey: ['userBalanceDetails', apartmentId],
    queryFn: () => fetchUserBalanceDetails(apartmentId!),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
