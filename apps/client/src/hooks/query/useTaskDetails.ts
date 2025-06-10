import { useQuery } from '@tanstack/react-query';

import { API } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';



export const useTaskDetails = (taskId: string) => {
  const { sessionDetails: { apartmentId }, } = useAuth();

  return useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: async () => API.taskControllerGetTaskById({ query: { taskId, apartmentId: apartmentId! } }),
    refetchOnWindowFocus: false,
    enabled: !!taskId,
  });
};
