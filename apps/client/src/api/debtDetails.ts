// src/api/debts.ts
import axios from "axios";

export type DebtDetails = {
    debt_amount: number;
    debt_debtId: string;
    fromId: string;
    toId: string;
    userFrom_firstName: string;
    userFrom_lastName: string;
    userTo_firstName: string;
    userTo_lastName: string;
    userFrom_phoneNumber: string;
    userTo_phoneNumber: string;
    userTo_image: string;
    userFrom_image: string;
}


export const fetchDebtDetails = async (debtId: string): Promise<DebtDetails> => {
    const response = await axios.get("/api/debt-edge/debt-details", {
        params: {
            debtId
        }
    });
    return response.data;
};
