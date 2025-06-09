import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roommate/tasks/update-task')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/roommate/tasks/update-task"!</div>
}
