import axios from "axios";

export type ApartmentExpense = {
    expense_amount: number;
    expense_apartmentId: string;
    expense_createdAt: string;
    expense_description: string;
    expense_expenseId: string;
    expense_paidById: string;
    expense_splits: { [userId: string]: number };
    paidByMe: boolean;
    splitAmount: string;
    paidByFirstName: string;
    paidByLastName: string;
}

export const fetchApartmentExpenses = async (apartmentId: string, userId: string) => {

    const apartmentExpensesResponse = await axios.get<ApartmentExpense[]>("/api/expense/apartment-expenses", {
        params: {
            apartmentId,
            userId,
        }
    });

    return { apartmentExpenses: apartmentExpensesResponse.data };
}