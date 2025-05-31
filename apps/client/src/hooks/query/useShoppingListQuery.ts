import { useQuery } from "@tanstack/react-query";
import { API, ShoppingListContextType } from "@komuna/types";

const getShoppingList = async (contextType: string) => {
    const { data } = contextType === ShoppingListContextType.APARTMENT ?
        await API.shoppingListControllerGetApartmentShoppingList() :
        await API.shoppingListControllerGetPersonalShoppingList();
    return data;
}

export const useShoppingListQuery = (contextType: ShoppingListContextType) => {

    const { data: shoppingList, isLoading: isShoppingListLoading } = useQuery({
        queryKey: ['shoppingList', contextType],
        queryFn: () => getShoppingList(contextType),
    });

    return { shoppingList, isShoppingListLoading }
}