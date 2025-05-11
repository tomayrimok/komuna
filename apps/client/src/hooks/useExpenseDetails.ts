import { useQuery } from "@tanstack/react-query";
import { fetchExpenseDetails } from "../api/expenseDetails";

export const useExpenseDetails = (expenseId: string) => {
    return useQuery({
        queryKey: ["expenseDetails", expenseId],
        queryFn: () => fetchExpenseDetails(expenseId),
        refetchOnWindowFocus: false,
        enabled: !!expenseId,
    });
};
