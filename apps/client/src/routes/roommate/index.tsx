import { createFileRoute } from '@tanstack/react-router';
import { RoommateHome } from '../../pages/RoommateHome';

export const Route = createFileRoute('/roommate/')({
  component: () => <RoommateHome />,
});
