import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/create-apartment')({
  component: () => <div>Create Apartment</div>,
});
