import axios from "axios";

export type ExpenseDetails = {

    apartmentId: string;
    amount: number;
    createdAt: string;
    description: string;
    expenseId: string;
    paidById: string;
    paidByUser: {
        firstName: string;
        lastName: string;
        image?: string;
        phoneNumber: string;
        userId: string;
    };
    splits: {
        [userId: string]: number;
    };
};


export const fetchExpenseDetails = async (expenseId: string): Promise<ExpenseDetails> => {
    const response = await axios.get("/api/expense/expense-details", {
        params: {
            expenseId
        }
    });
    return response.data;
};
