import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/roommate/payments')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/member/payments"!</div>;
}
