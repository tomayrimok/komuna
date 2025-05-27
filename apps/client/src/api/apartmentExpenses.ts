import { API } from "@komuna/types";
import axios from "axios";


export const fetchApartmentExpenses = async (apartmentId: string, userId: string) => {

    const apartmentExpensesResponse = await API.expenseControllerGetApartmentExpenses({
        query: {
            apartmentId,
            userId
        }
    });

    return { apartmentExpenses: apartmentExpensesResponse.data };
}