import { createFileRoute } from '@tanstack/react-router'
import PaymentPage from '../../../components/Payments/PaymentPage'

export const Route = createFileRoute('/roommate/payments/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <PaymentPage />
}
