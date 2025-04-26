// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchApartment } from "../api/apartment";

export const useApartment = (apartmentId: string) => {
    return useQuery({
        queryKey: ["apartment", apartmentId],
        queryFn: () => fetchApartment(apartmentId),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
    });
};
