import { Stack } from '@chakra-ui/react';
import TasksHeader from './TasksHeader';
import CreateTaskButton from './CreateTaskButton';
import Tasks from './Tasks';

const TasksPage = () => {
  return (
    <Stack gap="4" direction="row" wrap="wrap">
      <TasksHeader />
      <Tasks />
      <CreateTaskButton />
    </Stack>
  );
};

export default TasksPage;
