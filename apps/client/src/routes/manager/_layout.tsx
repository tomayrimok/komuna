import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/manager/_layout')({
  component: () => <Outlet />,
  beforeLoad: ({ context }) => {
    if (context.auth.role !== 'MANAGER') {
      throw redirect({ to: '/' });
    }
  },
});
