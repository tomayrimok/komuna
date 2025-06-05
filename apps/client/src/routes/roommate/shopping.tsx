import { createFileRoute } from '@tanstack/react-router';
import CurrentShoppingLists from '../../pages/ShoppingLists';

export const Route = createFileRoute('/roommate/shopping')({
  component: RouteComponent,
});

function RouteComponent() {
  return <CurrentShoppingLists />;
}
