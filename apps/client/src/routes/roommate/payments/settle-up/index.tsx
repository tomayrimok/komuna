import { createFileRoute } from '@tanstack/react-router'
import SettleUp from '../../../../components/Payments/settleUpPage'

export const Route = createFileRoute('/roommate/payments/settle-up/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <SettleUp />
}
