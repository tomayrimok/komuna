import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roommate/payments/settle-up/$debtId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/roommate/payments/settle-up/$debtId"!</div>
}
