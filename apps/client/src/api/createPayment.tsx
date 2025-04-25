// src/api/debts.ts
import axios from "axios";



export const postCreatePayment = async (data: { apartmentId: string, fromId: string, toId: string, amount: number }) => {
    const response = await axios.post("/api/payment/create-payment", data);

    return {
        message: response.data.message,
        paymentId: response.data.paymentId,
        fromId: response.data.fromId,
        toId: response.data.toId,
        amount: response.data.amount,
        createdAt: response.data.createdAt,
    }
};
