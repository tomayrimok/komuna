import { createFileRoute } from '@tanstack/react-router'
import { SettleUpDebt } from '../../../../components/Payments/settleUpDebt'

export const Route = createFileRoute('/roommate/payments/settle-up/$debtId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <SettleUpDebt />
}
