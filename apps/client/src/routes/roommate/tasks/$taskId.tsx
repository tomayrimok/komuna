import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roommate/tasks/$taskId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/roommate/tasks/$taskId"!</div>
}
