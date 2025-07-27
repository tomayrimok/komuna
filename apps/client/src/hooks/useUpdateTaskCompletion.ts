import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toaster } from '../chakra/ui/toaster';
import { useAuth } from '../context/auth/AuthProvider';

const postUpdateTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    return await axios.post(`/api/task/update-completion`, { isCompleted, taskId });
}

export const useUpdateTaskCompletion = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { sessionDetails } = useAuth();

    return useMutation({
        mutationFn: async (data: { taskId: string; isCompleted: boolean }) => {
            const { taskId, isCompleted } = data;
            return postUpdateTaskCompletion(taskId, isCompleted);
        },
        onSuccess: (data, variables) => {
            toaster.success({ title: t('tasks.status_updated') });
            queryClient.invalidateQueries({
                queryKey: ['tasks', sessionDetails.apartmentId],
            });
        },
        onError: (error: any) => {
            toaster.error({ title: t('error.action_failed') });
        },
    });
};
