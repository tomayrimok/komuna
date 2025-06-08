import { createFileRoute } from '@tanstack/react-router';
import IncidentsPage from '../../../components/Incidents/incidentPage';

export const Route = createFileRoute('/roommate/incident/$incidentId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IncidentsPage />;
}
