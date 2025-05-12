
import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";

const getPersonalShoppingList = async () => {
    const { data } = await API.get('/shopping-list/personal');
    return data;
}

export const usePersonalShoppingList = () => {

    const { data: personalShoppingList, isLoading: isPersonalShoppingListLoading } = useQuery({
        queryKey: ['personalShoppingList'],
        queryFn: getPersonalShoppingList,
    });

    return { personalShoppingList, isPersonalShoppingListLoading };
}