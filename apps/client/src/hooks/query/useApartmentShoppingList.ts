import { useQuery } from "@tanstack/react-query";
import { API } from "../../axios";
import { useAuth } from "../../context/auth/AuthProvider";

const getApartmentShoppingList = async (apartmentId: string) => {
    const { data } = await API.get('/shopping-list/apartment')
    return data;
}

export const useApartmentShoppingList = () => {

    const { sessionDetails: { apartmentId } } = useAuth();

    const { data: apartmentShoppingList, isLoading: isApartmentShoppingListLoading } = useQuery({
        queryKey: ['apartmentShoppingList', apartmentId],
        queryFn: () => getApartmentShoppingList(apartmentId!),
    });

    return { apartmentShoppingList, isApartmentShoppingListLoading }
}