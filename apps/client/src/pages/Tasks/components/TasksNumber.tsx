import { SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../../../hooks/query/useTasks';

export const TasksNumber = () => {
    const { data, isLoading } = useTasks();
    const { t } = useTranslation();

    const numberOfOpenTasks = data?.length || 0;

    if (isLoading || !data) {
        return <SkeletonText noOfLines={1} width="50%" m="auto" />;
    }

    return (
        <Text fontWeight={'bold'} fontSize="xl">
            {t('tasks.num_open_tasks', { count: numberOfOpenTasks }) || ''}
        </Text>
    );
};
