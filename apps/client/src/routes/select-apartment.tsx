import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { SelectApartment } from '../pages/SelectApartment';
import { useEffect } from 'react';
import { useAuth } from '../context/auth/AuthProvider';

export const Route = createFileRoute('/select-apartment')({
  beforeLoad: ({ context }) => {
    if (!context.currentUserDetails) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <SelectApartmentPage />,
});

const SelectApartmentPage = () => {
  const { currentUserDetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserDetails) {
      navigate({ to: '/login' });
    } else if (!currentUserDetails?.apartments?.length && !currentUserDetails?.landlordApartments?.length) {
      navigate({ to: '/new-apartment' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserDetails]);

  return <SelectApartment />;
};
