import { createFileRoute } from '@tanstack/react-router';
import { EditApartment } from '../../pages/EditApartment/EditApartment';

export const Route = createFileRoute('/landlord/edit-apartment')({
  component: () => <EditApartment />,
});
