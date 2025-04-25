import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/landloard/incidents')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/manager/incidents"!</div>;
}
