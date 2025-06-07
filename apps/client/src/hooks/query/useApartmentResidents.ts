import { useQuery } from '@tanstack/react-query';
import { API } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';

export const useApartmentResidents = () => {
  const {
    sessionDetails: { apartmentId },
  } = useAuth();

  return useQuery({
    queryKey: ['apartmentResidents', apartmentId],
    queryFn: async () => {
      const { data } = await API.apartmentControllerGetApartmentWithResidents({
        query: { apartmentId: apartmentId! },
      });
      return data?.residents;
    },
    enabled: !!apartmentId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
