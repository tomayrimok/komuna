import { createFileRoute } from '@tanstack/react-router';
import { LandlordHome } from '../../pages/LandlordHome';

export const Route = createFileRoute('/landlord/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <LandlordHome />;
}
