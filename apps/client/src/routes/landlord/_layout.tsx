import { Box } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';
import RoommateBottomNav from '../../components/RoommateBottomNav/RoommateBottomNav';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth/AuthProvider';

export const Route = createFileRoute('/landlord/_layout')({
  component: () => <Layout />,
  beforeLoad: ({ context }) => {
    if (context.sessionDetails.role !== UserRole.LANDLORD) {
      throw redirect({ to: '/login' });
    }
  },
});

export const Layout = () => {
  const { sessionDetails, currentUserDetails } = useAuth();

  useEffect(() => {
    if (!currentUserDetails) {
      throw redirect({ to: '/login' });
    }
    if (sessionDetails?.role === UserRole.ROOMMATE) {
      throw redirect({ to: '/roommate' });
    }
  }, [sessionDetails, currentUserDetails]);

  return (
    <Box flex="1" display="flex" flexDirection="column" gap="0" height="100%">
      <Box overflowY="auto" flex="1" display="flex" flexDirection="column" gap="0" height="100%">
        <Outlet />
      </Box>
      <RoommateBottomNav />
    </Box>
  );
};
