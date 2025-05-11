import axios from "axios";

export const postAddEditExpense = async (data: { expenseId?: string, apartmentId: string, splits: any, amount: number, description: string, paidById: string }) => {
    const response = await axios.post("/api/expense/add-edit-expense", data);
    return response.data;
};
