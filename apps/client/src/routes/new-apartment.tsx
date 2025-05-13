import { createFileRoute, redirect } from '@tanstack/react-router';
import { NewApartment } from '../pages/CreateApartment';

export const Route = createFileRoute('/new-apartment')({
  beforeLoad: ({ context, location }) => {
    if (!context.currentUserDetails) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <NewApartment />,
});
