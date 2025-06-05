import { useQuery } from "@tanstack/react-query";

import { API } from "@komuna/types";

export const fetchIncidentDetails = async (incidentId: string) => {
    console.log('incidentId :', incidentId);
    const response = await API.incidentControllerGetIncidentDetails({
        query: {
            incidentId
        }
    });

    return response.data;
};


export const useIncidentDetails = (incidentId: string) => {
    console.log('incidentId :', incidentId);
    return useQuery({
        queryKey: ["incidentDetails", incidentId],
        queryFn: () => fetchIncidentDetails(incidentId),
        refetchOnWindowFocus: false,
        enabled: !!incidentId,
    });
};
