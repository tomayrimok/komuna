import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import { useAuth } from "../../context/auth/AuthProvider";
import { ShoppingList, ShoppingListContextType } from "@komuna/types";

const getShoppingList = async (contextType: string) => {
    const { data } = await API.get<ShoppingList>(`/shopping-list/${contextType === ShoppingListContextType.APARTMENT ? 'apartment' : 'personal'}`);
    return data;
}

export const useShoppingListQuery = (contextType: ShoppingListContextType) => {

    const { sessionDetails: { apartmentId } } = useAuth();

    const { data: shoppingList, isLoading: isShoppingListLoading } = useQuery({
        queryKey: ['shoppingList', contextType],
        queryFn: () => getShoppingList(contextType),
    });

    return { shoppingList, isShoppingListLoading }
}