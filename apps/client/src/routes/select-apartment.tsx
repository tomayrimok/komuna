import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/select-apartment')({
  component: () => <div>Select Apartment</div>,
});
