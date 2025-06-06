import { createFileRoute } from '@tanstack/react-router';
import IncidentDetailsPage from '../../../../components/Incidents/incidentDetailsPage';

export const Route = createFileRoute('/landlord/incident/details/$incidentId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IncidentDetailsPage />;
}
