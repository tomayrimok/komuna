import { ExpenseDetailsResponse } from "@komuna/types";
import axios from "axios";

export const fetchExpenseDetails = async (expenseId: string) => {
    const response = await axios.get<ExpenseDetailsResponse>("/api/expense/expense-details", {
        params: {
            expenseId
        }
    });
    return response.data;
};
