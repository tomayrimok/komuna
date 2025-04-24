// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchApartmentExpenses } from "../api/apartmentExpenses";

export const useApartmentExpenses = (apartmentId: string, userId: string) => {
    return useQuery({
        queryKey: ["apartmentExpenses"],
        queryFn: () => fetchApartmentExpenses(apartmentId, userId),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
    });
};
