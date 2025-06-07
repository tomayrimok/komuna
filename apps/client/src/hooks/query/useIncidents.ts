import { API } from "@komuna/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/auth/AuthProvider";


export const useIncidents = () => {

    const { sessionDetails: { apartmentId } } = useAuth();

    return useQuery({
        queryKey: ["incidents", apartmentId],
        queryFn: () => API.incidentControllerGetAllIncidents({ query: { apartmentId: apartmentId! } }),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
