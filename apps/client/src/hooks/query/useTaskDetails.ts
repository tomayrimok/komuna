import { useQuery } from '@tanstack/react-query';

import { API } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';


const fetchTaskDetails = async (taskId: string, apartmentId: string) => {
  const response = await API.taskControllerGetTaskById({ query: { taskId, apartmentId } });
  if (!response) {
    throw new Error('Task details not found');
  }
  return response.data;
};


export const useTaskDetails = (taskId: string) => {
  const { sessionDetails: { apartmentId }, } = useAuth();

  return useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: () => fetchTaskDetails(taskId, apartmentId!),
    refetchOnWindowFocus: false,
    enabled: !!taskId,
  });
};
