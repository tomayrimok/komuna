import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/roommate/tasks')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/member/tasks"!</div>;
}
