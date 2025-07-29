import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/auth/AuthProvider";
import axios from "axios";
import { toaster } from "../../chakra/ui/toaster";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

export const useDeleteIncident = () => {
    const queryClient = useQueryClient();
    const { sessionDetails: { apartmentId, role } } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (incidentId: string) => axios.post(`/api/incident/delete?incidentId=${incidentId}`),
        onSuccess: () => {
            toaster.create({
                title: t('incidents.incident_deleted'),
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['incidents', apartmentId] });
            navigate({ to: `/${role?.toLowerCase()}/incidents` });
        },
    });
};