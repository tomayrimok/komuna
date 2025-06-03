import { useMutation } from "@tanstack/react-query";
import { API, ShoppingListContextType } from "@komuna/types";
import { useAuth } from "../../context/auth/AuthProvider";

const getShoppingList = async (contextType: ShoppingListContextType, apartmentId: string) => {
    const { data } = await API.shoppingListControllerGetShoppingList({
        query: { contextType, apartmentId },
    });
    return data;
};

export const useShoppingListQuery = () => {
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: (contextType: ShoppingListContextType) =>
            getShoppingList(contextType, apartmentId!),
    });
};
