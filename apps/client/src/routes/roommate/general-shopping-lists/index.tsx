import { createFileRoute } from '@tanstack/react-router';
import GeneralShoppingLists from '../../../pages/ShoppingLists/GeneralShoppingLists';

export const Route = createFileRoute('/roommate/general-shopping-lists/')({
    component: GeneralShoppingLists,
}); 