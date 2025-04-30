// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchExpenseDetails } from "../api/expenseDetails";

export const useExpenseDetails = (expenseId: string) => {
    return useQuery({
        queryKey: ["expenseDetails", expenseId],
        queryFn: () => fetchExpenseDetails(expenseId),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
        enabled: !!expenseId,
    });
};
