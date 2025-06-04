import { createFileRoute } from '@tanstack/react-router'
import PaymentPage from '../../../components/Payments/paymentPage'

export const Route = createFileRoute('/roommate/payments/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PaymentPage />
}
