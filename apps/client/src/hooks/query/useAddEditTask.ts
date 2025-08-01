import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API, ApiTypes } from '@komuna/types';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toaster } from '../../chakra/ui/toaster';

export const useAddEditTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: ApiTypes.AddEditTaskDto) => {
      const response = await API.taskControllerCreateTask({ body: data, throwOnError: true });
      return response.data;
    },
    onSuccess: (data, variables) => {
      navigate({ to: '/roommate/tasks' });
      toaster.success({ title: t('task_category.create_task.success') });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.apartmentId] });
    },
    onError: () => {
      toaster.error({ title: t('error.action_failed') });
    },
  });
};

// export const useEditTask = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   return useMutation({
//     mutationFn: async (data: ApiTypes.UpdateTaskDto) => {
//       const response = await API.taskControllerEditTask({ body: data, throwOnError: true });
//       return response.data;
//     },
//     onSuccess: (data) => {
//       navigate({ to: '/roommate/tasks' });
//       toaster.success({ title: t('tasks.task_saved') });
//       queryClient.invalidateQueries({ queryKey: ['tasks', data.apartmentId] });
//     },
//     onError: () => {
//       toaster.error({ title: t('error.action_failed') });
//     },
//   });
// };
