import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/roommate/')({
  component: () => <div>Member Home Dashboard</div>,
});
