import { Box } from '@chakra-ui/react';
import { UserRole } from '@komuna/types';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';
import BottomNav from '../../components/RoommateBottomNav/RoommateBottomNav';

export const Route = createFileRoute('/roommate')({
  component: () => <RoomateLayout />,
  beforeLoad: ({ context }) => {
    // if (context.sessionDetails.role !== UserRole.ROOMMATE) {
    //   throw redirect({ to: '/login' });
    // }
  },
});

const RoomateLayout = () => {
  return (
    <Box flex="1" display="flex" flexDirection="column" gap="0">
      <Outlet />
      <BottomNav />
    </Box>
  );
};
