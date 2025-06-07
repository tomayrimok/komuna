import { createFileRoute } from '@tanstack/react-router';
import SettleUpSuccessPage from '../../../../components/Payments/SettleUp/SettleUpSuccessPage';

export const Route = createFileRoute('/roommate/payments/settle-up/success')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettleUpSuccessPage />;
}
