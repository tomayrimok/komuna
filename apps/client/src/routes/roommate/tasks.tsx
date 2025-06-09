import { createFileRoute } from '@tanstack/react-router';
import { TasksHome } from '../../pages/Tasks';

export const Route = createFileRoute('/roommate/tasks')({
  component: () => <TasksHome />,
});
