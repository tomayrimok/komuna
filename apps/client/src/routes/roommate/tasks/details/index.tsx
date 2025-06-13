import { createFileRoute } from '@tanstack/react-router'
import CreateTask from '../../../../pages/Tasks/CreateTask'

export const Route = createFileRoute('/roommate/tasks/details/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <CreateTask />
}
