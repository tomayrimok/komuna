import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/_layout')({
  component: () => <Outlet />,
});
