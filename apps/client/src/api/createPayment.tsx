import { API } from "@komuna/types";
import axios from "axios";

export const postCreatePayment = async (data: { apartmentId: string, fromId: string, toId: string, amount: number }) => {
    const response = await API.paymentControllerCreatePayment({
        query: data
    });
    return response.data;
};
