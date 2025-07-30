import { createFileRoute } from '@tanstack/react-router';
import { ResidentsList } from '../../pages/ResidentsList';

export const Route = createFileRoute('/landlord/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ResidentsList hideTopbar />;
}
