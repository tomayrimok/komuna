import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/select-role')({
  component: () => <div>Select Role</div>,
});
