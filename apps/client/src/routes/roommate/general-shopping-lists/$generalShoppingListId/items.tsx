import { createFileRoute } from '@tanstack/react-router';
import GeneralShoppingListItemsPage from '../../../../pages/ShoppingLists/GeneralShoppingListItemsPage';
import { GeneralShoppingListProvider } from '../../../../context/auth/GeneralShoppingListProvider';

export const Route = createFileRoute('/roommate/general-shopping-lists/$generalShoppingListId/items')({
    component: () => {
        const generalShoppingListId = Route.useParams().generalShoppingListId;
        return (
            <GeneralShoppingListProvider generalShoppingListId={generalShoppingListId}>
                <GeneralShoppingListItemsPage />
            </GeneralShoppingListProvider>
        );
    }
});

