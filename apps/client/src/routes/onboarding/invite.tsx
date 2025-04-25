import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding/invite')({
  component: () => <div>Invite by PIN</div>,
});
