import { useMutation } from "@tanstack/react-query";
import { API, ContextType } from "@komuna/types";
import { useAuth } from "../../context/auth/AuthProvider";

const getShoppingList = async (contextType: ContextType, apartmentId: string) => {
    const { data } = await API.shoppingListControllerGetShoppingList({
        query: { contextType, apartmentId },
    });
    return data;
};

export const useShoppingListQuery = () => {
    const { sessionDetails: { apartmentId } } = useAuth();

    return useMutation({
        mutationFn: (contextType: ContextType) =>
            getShoppingList(contextType, apartmentId!),
    });
};
