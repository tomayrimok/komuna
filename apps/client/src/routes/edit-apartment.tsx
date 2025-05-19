import { createFileRoute, redirect } from '@tanstack/react-router';
import { EditApartment } from '../pages/EditApartment/EditApartment';

export const Route = createFileRoute('/edit-apartment')({
  beforeLoad: ({ context }) => {
    if (!context.currentUserDetails) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <EditApartment />,
});
