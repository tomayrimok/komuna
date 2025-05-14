import { DebtDetailsResponse } from "@komuna/types";
import axios from "axios";

export const fetchDebtDetails = async (debtId: string) => {
    const response = await axios.get<DebtDetailsResponse>("/api/debt-edge/debt-details", {
        params: {
            debtId
        }
    });
    return response.data;
};
