import { createFileRoute } from '@tanstack/react-router'
import GeneralShoppingListDetailsPage from '../../../../pages/ShoppingLists/GeneralShoppingListDetailsPage'

export const Route = createFileRoute(
    '/roommate/general-shopping-lists/$generalShoppingListId/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <GeneralShoppingListDetailsPage />
    )
}
