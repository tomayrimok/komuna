import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useApartment } from "../useApartment";
import { toaster } from "../../chakra/ui/toaster";
import { API } from "@komuna/types";
import axios from "axios";

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const { history } = useRouter();
    const { t } = useTranslation();
    const { data: apartmentData, isLoading: isApartmentDataLoading, isError: isApartmentDataError } = useApartment();
    return useMutation({
        mutationFn: async (data: { taskId: string, apartmentId: string }) => {
            const response = await axios.post('/api/task/delete', data);
            return response.data;
        },
        onSuccess: (data, variables) => {
            toaster.success({ title: 'המשימה נמחקה בהצלחה' });
            queryClient.invalidateQueries({ queryKey: ['tasks', apartmentData?.apartmentId] });
        },
        onError: () => {
            toaster.error({ title: t('error.action_failed') });
        },
    });
};