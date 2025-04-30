import { createFileRoute } from '@tanstack/react-router'
import CreateExpensePage from '../../../../components/Payments/createExpensePage'

export const Route = createFileRoute(
    '/roommate/payments/expenses/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <CreateExpensePage />
}
