import { UserRole } from '@komuna/types';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/roommate/_layout')({
  component: () => <Outlet />,
  beforeLoad: ({ context }) => {
    if (context.auth.role !== UserRole.ROOMMATE) {
      throw redirect({ to: '/' });
    }
  },
});
