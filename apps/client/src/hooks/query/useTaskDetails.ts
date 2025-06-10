import { useQuery } from '@tanstack/react-query';

import { API } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';



export const useTaskDetails = (taskId: string) => {
  const { sessionDetails: { apartmentId }, } = useAuth();

  return useQuery({
    queryKey: ['taskDetails', taskId],
    // TODO: Get the type workkkk!
    queryFn: async () => API.taskControllerGetTaskById({ path: { taskId, apartmentId } }),
    refetchOnWindowFocus: false,
    enabled: !!taskId,
  });
};
