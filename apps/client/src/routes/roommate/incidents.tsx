import { createFileRoute } from '@tanstack/react-router';
import IncidentsPage from '../../components/Incidents/incidentsPage';

export const Route = createFileRoute('/roommate/incidents')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IncidentsPage />;
}
