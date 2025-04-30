import { createFileRoute } from '@tanstack/react-router'
import CreateExpense from '../../../../components/Payments/createExpensePage'

export const Route = createFileRoute('/roommate/payments/expenses/$expenseId')({

    component: RouteComponent,
})

function RouteComponent() {
    return <CreateExpense />
}
