// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDebtDetails } from "../api/debtDetails";

export const useDebtDetails = (debtId: string) => {
    return useQuery({
        queryKey: ["debtDetails", debtId],
        queryFn: () => fetchDebtDetails(debtId),
        refetchOnWindowFocus: false,
    });
};
