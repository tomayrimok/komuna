import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/join-apartment')({
  component: () => <div>Select Role</div>,
});
