import { useQuery } from '@tanstack/react-query';
import { API, type ApiTypes } from '../../../../../libs/types/src';
import { useAuth } from '../../context/auth/AuthProvider';

const fetchTasks = async (apartmentId: string): Promise<ApiTypes.TaskResponseDto[] | undefined> => {
  const response = await API.taskControllerGetAllTasks({ query: { apartmentId } });
  return response.data;
}

export const useTasks = () => {
  const { sessionDetails: { apartmentId } } = useAuth();

  return useQuery({
    refetchOnMount: "always",
    queryKey: ['tasks', apartmentId],
    queryFn: () => fetchTasks(apartmentId!),
    enabled: !!apartmentId,
  });
};
