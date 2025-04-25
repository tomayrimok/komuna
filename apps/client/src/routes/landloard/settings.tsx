import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/landloard/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/manager/settings"!</div>;
}
