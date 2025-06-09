import { createFileRoute } from '@tanstack/react-router'
import CreateTask from '../../../pages/Tasks/CreateTask';

export const Route = createFileRoute('/roommate/tasks/create-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateTask />
}
