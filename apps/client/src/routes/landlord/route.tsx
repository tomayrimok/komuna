import { Box } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import BottomNav from '../../components/LandlordBottomNav/LandlordBottomNav';

export const Route = createFileRoute('/landlord')({
  component: () => <LandlordLayout />,
  beforeLoad: ({ context }) => {
    // TODO: Return this when the roles/apartments selection is implemented
    // if (context.sessionDetails.role !== UserRole.ROOMMATE) {
    //   throw redirect({ to: '/login' });
    // }
  },
});

const LandlordLayout = () => {
  return (
    <Box flex="1" display="flex" flexDirection="column" gap="0" height="100%">
      <Box
        data-scroll-container
        overflowY="auto"
        flex="1"
        display="flex"
        flexDirection="column"
        gap="0"
        height="100%"
      >
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
};
