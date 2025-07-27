import { Flex, For, Image, SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useTasks } from '../../hooks/query/useTasks';
import TaskCard from './TaskCard';
import { useAuth } from '../../context/auth/AuthProvider';
import { parseDate } from '../../utils/dateUtils';
import { useMemo } from 'react';
import { TaskType } from '@komuna/types';

const Tasks = () => {
  const { data: tasks, isLoading } = useTasks();
  const { t } = useTranslation();
  const { currentUserDetails } = useAuth();

  const extendedTasks = tasks?.map((task) => {
    const assignedUserIds = task.assignedTo?.map((user) => user.userId) ?? [];
    const completions = task.completions ?? [];
    const isCompletedByMe = completions.includes(currentUserDetails?.userId || '');
    const isCompletedByAll = assignedUserIds.every((userId) => completions.includes(userId));
    return {
      ...task,
      isCompletedByMe,
      isCompletedByAll,
    };
  });

  const generalOpenTasks = useMemo(() => {
    const openTasks = tasks?.filter(task => {
      if (task.taskType === TaskType.GROUP) {
        return task.completions?.length === 0;
      }
      return task.completions?.length !== task.assignedTo?.length;
    });
    return openTasks?.length || 0;
  }, [tasks]);


  const orderedTasks = extendedTasks?.sort((a, b) => {
    // Priority 1: Tasks not completed by me (highest priority)
    if (!a.isCompletedByMe && b.isCompletedByMe) return -1;
    if (a.isCompletedByMe && !b.isCompletedByMe) return 1;

    // Priority 2: Among completed by me, prioritize those not completed by all
    if (a.isCompletedByMe && b.isCompletedByMe) {
      if (!a.isCompletedByAll && b.isCompletedByAll) return -1;
      if (a.isCompletedByAll && !b.isCompletedByAll) return 1;
    }

    // Priority 3: Sort by due date if both tasks have the same completion status
    const aDate = a.dueDate ? parseDate(a.dueDate) : null;
    const bDate = b.dueDate ? parseDate(b.dueDate) : null;

    // Tasks with due dates come before tasks without due dates
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;

    // If both have due dates, sort by earliest first
    if (aDate && bDate) {
      return aDate.getTime() - bDate.getTime();
    }

    // If neither has due date, maintain original order
    return 0;
  });

  return (
    <Flex gap="2" direction="column" width="100%" p={6} pb={11}>
      {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
      {!orderedTasks ? <NoTasks /> :
        (!orderedTasks?.length
          ? (
            <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="15vh">
              <Image src="/meerkats/relaxing.png" width="80vw" />
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {t('tasks.create_task')}
              </Text>
            </Flex>
          )
          : (
            <>
              {/* <Text fontSize="xl" fontWeight="bold" mb={2}>
              {t('tasks.solved_tasks')}
              </Text> */}
              <Text fontSize="md" mb={2} color="gray.500">
                {t('tasks.num_apartment_tasks', { total: generalOpenTasks }) || ''}
              </Text>
              {orderedTasks.map((task) => (
                <TaskCard key={task.taskId} task={task} />
              ))}
              {/* <For each={orderedTasks}>{(task) => <TaskCard key={task.taskId} task={task} />}</For> */}
            </>
          )
        )
      }
    </Flex>
  );
};

export default Tasks;

const NoTasks = () => {
  return null;
}
