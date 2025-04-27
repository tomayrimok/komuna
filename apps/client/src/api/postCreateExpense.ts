// src/api/debts.ts
import axios from "axios";

export const postCreateExpense = async (data: { apartmentId: string, splits: any, amount: number, description: string, userId: string }) => {
    const response = await axios.post("/api/expense/create-expense", data);
    response.data;
};
