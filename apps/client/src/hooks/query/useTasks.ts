import { useQuery } from '@tanstack/react-query';
import { API, type ApiTypes } from '../../../../../libs/types/src';
import { useAuth } from '../../context/auth/AuthProvider';

export const useTasks = () => {
  const { sessionDetails: { apartmentId }, } = useAuth();

  return useQuery({
    queryKey: ['tasks', apartmentId],
    queryFn: async () => apartmentId != null && API.taskControllerGetAllTasks({ path: { apartmentId } }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
