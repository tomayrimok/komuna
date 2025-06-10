import { useQuery } from '@tanstack/react-query';
import { API, type ApiTypes } from '../../../../../libs/types/src';
import { useAuth } from '../../context/auth/AuthProvider';

const fetchTasks = async (apartmentId: string): Promise<ApiTypes.TaskResDto[] | undefined> => {
  const response = await API.taskControllerGetAllTasks({ query: { apartmentId } });
  return response.data;
}

export const useTasks = () => {
  const { sessionDetails: { apartmentId } } = useAuth();

  return useQuery({
    queryKey: ['tasks', apartmentId],
    queryFn: () => fetchTasks(apartmentId!),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!apartmentId,
  });
};
