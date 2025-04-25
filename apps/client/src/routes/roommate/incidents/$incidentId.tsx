import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/roommate/incidents/$incidentId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/member/incidents/$incidentId"!</div>;
}
