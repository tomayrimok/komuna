// src/api/debts.ts
import axios from "axios";

export const postCreateExpense = async (data: { expenseId?: string, apartmentId: string, splits: any, amount: number, description: string, paidById: string }) => {
    const response = await axios.post("/api/expense/add-edit-expense", data);
    response.data;
};
