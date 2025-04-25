// src/api/debts.ts
import axios from "axios";

export type BalanceDetails = {
    debt_amount: number;
    debt_debtId: string;
    debtor: boolean;
    debt_fromId: string;
    debt_toId: string;
    userFrom_firstName: string;
    userFrom_lastName: string;
    userTo_firstName: string;
    userTo_lastName: string;
    userFrom_phoneNumber: string;
    userTo_phoneNumber: string;
    debt_updatedAt: string;
};


export const fetchDebtPayments = async (apartmentId: string, userId: string): Promise<{ balanceDetails: BalanceDetails[]; balance: number }> => {
    const userBalanceDetailsRequest = axios.get("/api/debt-edge/user-balance-details", {
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
