import { Flex, For, Image, SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useTasks } from '../../hooks/query/useTasks';
import TaskCard from './TaskCard';

const Tasks = () => {
  const { data: tasks, isLoading } = useTasks();
  const { t } = useTranslation();

  return (
    <Flex gap="2" direction="column" width="100%" p={6} pb={11}>
      {isLoading && <SkeletonText noOfLines={1} width="50%" mb="2" />}
      {!tasks ? <NoTasks /> :
        (!tasks?.length
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
              <For each={tasks}>{(task) => <TaskCard key={task.taskId} task={task} />}</For>
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
