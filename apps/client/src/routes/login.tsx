import { createFileRoute, redirect } from '@tanstack/react-router';
import { Login } from '../pages/Login';
import { z } from 'zod';

const fallback = '/new-apartment' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.currentUserDetails) {
      if (!context.currentUserDetails.apartments.length) {
        throw redirect({ to: search.redirect || '/roommate' });
      } else {
        throw redirect({ to: search.redirect || fallback });
      }
    }
  },
  component: () => <Login />,
});
