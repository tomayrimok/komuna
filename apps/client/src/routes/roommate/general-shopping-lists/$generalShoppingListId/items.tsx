import { createFileRoute } from '@tanstack/react-router';
import GeneralShoppingListItemsPage from '../../../../pages/ShoppingLists/GeneralShoppingListItemsPage';
import { GeneralShoppingListProvider } from '../../../../context/auth/GeneralShoppingListProvider';

function GeneralShoppingListItemsRoute() {
    const generalShoppingListId = Route.useParams().generalShoppingListId;
    return (
        <GeneralShoppingListProvider generalShoppingListId={generalShoppingListId}>
            <GeneralShoppingListItemsPage />
        </GeneralShoppingListProvider>
    );
}

export const Route = createFileRoute('/roommate/general-shopping-lists/$generalShoppingListId/items')({
    component: GeneralShoppingListItemsRoute
});

