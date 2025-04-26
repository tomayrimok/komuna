// src/api/debts.ts
import axios from "axios";

export const postCreateExpense = async (data: { apartmentId: string, fromId: string, toId: string, amount: number }) => {
    const response = await axios.post("/api/expense/create-expense", data);
    response.data;
};
