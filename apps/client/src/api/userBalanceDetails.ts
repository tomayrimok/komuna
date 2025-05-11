import { BalanceDetailsResponse } from "@komuna/types";
import axios from "axios";

export const fetchDebtPayments = async (apartmentId: string, userId: string) => {
    const userBalanceDetailsRequest = axios.get<BalanceDetailsResponse>("/api/debt-edge/user-balance-details", {
        params: {
            apartmentId,
            userId,
        }
    });

    const userBalanceRequest = axios.get("/api/debt-edge/user-balance", {
        params: {
            userId,
            apartmentId,
        },
    });

    const [userBalanceDetailsResponse, userBalanceResponse] = await Promise.all([userBalanceDetailsRequest, userBalanceRequest]);
    return { balanceDetails: userBalanceDetailsResponse.data, balance: userBalanceResponse.data };
};
