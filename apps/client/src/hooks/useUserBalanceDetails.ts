// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDebtPayments } from "../api/userBalanceDetails";

export const useUserBalanceDetails = (apartmentId: string, userId: string) => {
    return useQuery({
        queryKey: ["debtPayments"],
        queryFn: () => fetchDebtPayments(apartmentId, userId),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
    });
};
