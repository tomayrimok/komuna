// src/hooks/useDebts.ts
import { useQuery } from "@tanstack/react-query";
import { fetchApartment } from "../api/apartment";
import { useAuth } from "../context/auth/AuthProvider";

export const useApartment = () => {

    const { sessionDetails: { apartmentId } } = useAuth();

    return useQuery({
        queryKey: ["apartment", apartmentId],
        queryFn: () => fetchApartment(apartmentId!),
        staleTime: 1000 * 60 * 5, // 5 דקות
        refetchOnWindowFocus: false,
    });
};
