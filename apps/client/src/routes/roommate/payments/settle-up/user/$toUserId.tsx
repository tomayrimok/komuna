import { createFileRoute } from '@tanstack/react-router';
import { SettleUpUser } from '../../../../../components/Payments/SettleUp/SettleUpUserPage';

export const Route = createFileRoute('/roommate/payments/settle-up/user/$toUserId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettleUpUser />;
}
