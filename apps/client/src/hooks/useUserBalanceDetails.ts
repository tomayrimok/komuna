import { useQuery } from "@tanstack/react-query";
import { fetchUserBalanceDetails } from "../api/userBalanceDetails";
import { useAuth } from "../context/auth/AuthProvider";

export const useUserBalanceDetails = (userId: string) => {

    const { sessionDetails: { apartmentId } } = useAuth();

    return useQuery({
        queryKey: ["userBalanceDetails", apartmentId, userId],
        queryFn: () => fetchUserBalanceDetails(apartmentId!, userId),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
