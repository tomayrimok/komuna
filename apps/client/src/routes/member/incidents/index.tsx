import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/member/incidents/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/member/incidents"!</div>;
}
