import { Box } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';
import RoommateBottomNav from '../../components/RoommateBottomNav/RoommateBottomNav';

export const Route = createFileRoute('/landlord/_layout')({
  component: () => <Box flex="1" display="flex" flexDirection="column" gap="0" height="100%">
    <Box overflowY="auto" flex="1" display="flex" flexDirection="column" gap="0" height="100%">
      <Outlet />
    </Box>
    <RoommateBottomNav />
  </Box>,
  beforeLoad: ({ context }) => {
    if (context.sessionDetails.role !== UserRole.LANDLORD) {
      throw redirect({ to: '/login' });
    }
  },
});
