import { createFileRoute, redirect } from '@tanstack/react-router';
import JoinApartment from '../pages/JoinApartment/JoinApartment';

export const Route = createFileRoute('/join-apartment')({
  beforeLoad: ({ context }) => {
    if (!context.currentUserDetails) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <JoinApartment />,
});
