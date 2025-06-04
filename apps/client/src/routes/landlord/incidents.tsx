import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import IncidentsPage from '../../components/Incidents/incidentsPage';

export const Route = createFileRoute('/landlord/incidents')({
  component: RouteComponent,
});

function RouteComponent() {
  return <IncidentsPage />
}
