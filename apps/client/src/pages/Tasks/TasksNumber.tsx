import { SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../hooks/query/useTasks';
import { useMemo } from 'react';
import { TaskType } from '@komuna/types';
import { useAuth } from '../../context/auth/AuthProvider';

const TasksNumber = () => {
    const { data, isLoading } = useTasks();
    const { t } = useTranslation();
    const { currentUserDetails } = useAuth();

    const personalOpenTasks = useMemo(() => {
        const currentUserId = currentUserDetails?.userId;
        if (!currentUserId) return 0;

        const openTasks = data?.filter(task => {
            if (task.taskType === TaskType.GROUP) {
                return task.completions?.length === 0;
            }
            return task.assignedTo?.some(user => user.userId === currentUserId) && !task.completions?.includes(currentUserId);
        });
        return openTasks?.length || 0;
    }, [data, currentUserDetails?.userId]);

    if (isLoading || !data) {
        return <SkeletonText noOfLines={1} width="50%" m="auto" />;
    }

    return (
        <Text fontWeight={'bold'} fontSize="xl" whiteSpace="pre-line">
            {t('tasks.num_open_tasks', { count: personalOpenTasks }) || ''}
        </Text>
    );
};

export default TasksNumber;
