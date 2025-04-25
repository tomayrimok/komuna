import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/member/')({
  component: () => <div>Member Home Dashboard</div>,
});
