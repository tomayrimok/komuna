import { createFileRoute, redirect } from '@tanstack/react-router';
import { SelectApartment } from '../pages/SelectApartment';

export const Route = createFileRoute('/select-apartment')({
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
  component: () => <SelectApartment />,
});
