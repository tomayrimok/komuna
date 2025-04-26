// src/api/debts.ts
import axios from "axios";

export const postCreatePayment = async (data: { apartmentId: string, fromId: string, toId: string, amount: number }) => {
    const response = await axios.post("/api/payment/create-payment", data);
    return response.data;
};
