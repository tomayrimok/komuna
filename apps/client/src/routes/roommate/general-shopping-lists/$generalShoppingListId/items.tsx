import { createFileRoute } from '@tanstack/react-router';
import GeneralShoppingListItemsPage from '../../../../pages/ShoppingLists/GeneralShoppingListItemsPage';

export const Route = createFileRoute('/roommate/general-shopping-lists/$generalShoppingListId/items')({
    component: RouteComponent,
});

function RouteComponent() {
    return <GeneralShoppingListItemsPage />;
} 