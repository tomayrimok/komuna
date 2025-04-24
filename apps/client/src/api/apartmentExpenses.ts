import axios from "axios";

export const fetchApartmentExpenses = async (apartmentId: string, userId: string) => {

    const apartmentExpensesResponse = await axios.get("/api/expense/apartment-expenses", {
        params: {
            apartmentId,
            userId,
        }
    });

    return { apartmentExpenses: apartmentExpensesResponse.data };
}