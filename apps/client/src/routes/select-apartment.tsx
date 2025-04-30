import { createFileRoute, redirect } from '@tanstack/react-router';

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
  component: () => <div>Select Apartment</div>,
});
