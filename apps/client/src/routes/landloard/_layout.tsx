import { UserRole } from '@komuna/types';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/landloard/_layout')({
  component: () => <Outlet />,
  beforeLoad: ({ context }) => {
    if (context.sessionDetails.role !== UserRole.LANDLORD) {
      throw redirect({ to: '/login' });
    }
  },
});
