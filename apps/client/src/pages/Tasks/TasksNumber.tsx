import { SkeletonText, Text } from '@chakra-ui/react';
import { IncidentStatus } from '@komuna/types';
import { useTranslation } from 'react-i18next';
import { useIncidents } from '../../hooks/query/useIncidents';
import { useTasks } from '../../hooks/query/useTasks';

const TasksNumber = () => {
    const { data, isLoading } = useTasks();
    const { t } = useTranslation();

    const numberOfOpenIncidents = data?.length || 0;

    if (isLoading || !data) {
        return <SkeletonText noOfLines={1} width="50%" m="auto" />;
    }

    return (
        <Text fontWeight={'bold'} fontSize="xl">
            {t('tasks.num_open_tasks', { count: numberOfOpenIncidents }) || ''}
        </Text>
    );
};

export default TasksNumber;
