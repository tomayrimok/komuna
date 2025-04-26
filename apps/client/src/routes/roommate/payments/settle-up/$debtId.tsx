import { createFileRoute } from '@tanstack/react-router'
import { SettleUpDebt } from '../../../../components/Payments/settleUpDebtPage'

export const Route = createFileRoute('/roommate/payments/settle-up/$debtId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <SettleUpDebt />
}
