import { createFileRoute } from '@tanstack/react-router';
import { EditProfile } from '../../pages/EditProfile';

export const Route = createFileRoute('/roommate/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditProfile />;
}
