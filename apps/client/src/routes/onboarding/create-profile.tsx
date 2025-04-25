import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/create-profile')({
  component: () => <div>Create Profile</div>,
});
