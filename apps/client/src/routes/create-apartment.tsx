import { createFileRoute, redirect } from '@tanstack/react-router';
import CreateApartment from '../pages/CreateApartment';

export const Route = createFileRoute('/create-apartment')({
  beforeLoad: ({ context }) => {
    if (!context.currentUserDetails) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <CreateApartment />,
});
