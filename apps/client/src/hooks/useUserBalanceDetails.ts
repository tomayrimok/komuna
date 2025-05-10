// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDebtPayments } from "../api/userBalanceDetails";
import { useAuth } from "../context/auth/AuthProvider";

export const useUserBalanceDetails = (userId: string) => {

    const { sessionDetails: { apartmentId } } = useAuth();

    return useQuery({
        queryKey: ["debtPayments", apartmentId, userId],
        queryFn: () => fetchDebtPayments(apartmentId!, userId),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
    });
};
