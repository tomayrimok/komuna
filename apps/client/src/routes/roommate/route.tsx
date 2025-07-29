import { Box } from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import BottomNav from '../../components/RoommateBottomNav/RoommateBottomNav';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth/AuthProvider';

export const Route = createFileRoute('/roommate')({
  component: () => <RoomateLayout />,
  beforeLoad: ({ context }) => {
    // TODO: Return this when the roles/apartments selection is implemented
    // if (context.sessionDetails.role !== UserRole.ROOMMATE) {
    //   throw redirect({ to: '/login' });
    // }
  },
});

const RoomateLayout = () => {
  const { sessionDetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionDetails.apartmentId) {
      navigate({ to: '/select-apartment' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionDetails]);

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
