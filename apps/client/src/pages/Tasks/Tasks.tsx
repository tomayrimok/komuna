import { Flex, For, Image, SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useTasks } from '../../hooks/query/useTasks';
import TaskCard from './TaskCard';
import type { ApiTypes } from '@komuna/types';

const TASKS = [{ taskId: '', title: 'לטאטא', description: 'יש הרבהה לטאטא', assignedTo: ['שני קהתי', 'נטע טי', 'נעם משה',], dueDate: '', dueTime: '', createdBy: 'שני קהתי', createdAt: '', },
{ taskId: '', title: 'לטאטא', description: 'יש הרבהה לטאטא', assignedTo: ['שני קהתי', 'נטע טי', 'נעם משה',], dueDate: '', dueTime: '', createdBy: 'שני קהתי', createdAt: '', },
{ taskId: '', title: 'לטאטא', description: 'יש הרבהה לטאטא', assignedTo: ['שני קהתי', 'נטע טי', 'נעם משה',], dueDate: '', dueTime: '', createdBy: 'שני קהתי', createdAt: '', },
{ taskId: '', title: 'לטאטא', description: 'יש הרבהה לטאטא', assignedTo: ['שני קהתי', 'נטע טי', 'נעם משה',], dueDate: '', dueTime: '', createdBy: 'שני קהתי', createdAt: '', },];

const Tasks = () => {
  const { data, isLoading } = useTasks();
  //TODO: Get the type to work! So `tasks` is typed as `ApiTypes.Task[]`
  const tasks = data as ApiTypes.TaskResDto[] | undefined;
  console.log('useTasks().data: ', data);
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
                {t('incidents.no_incidents')}
              </Text>
            </Flex>
          )
          : (
            <>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                {t('incidents.open_incidents')}
              </Text>
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
