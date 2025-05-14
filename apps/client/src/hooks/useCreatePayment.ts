import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCreatePayment } from "../api/createPayment";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "../chakra/ui/toaster";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/auth/AuthProvider";

export const useCreatePayment = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { currentUserDetails } = useAuth();

    return useMutation({
        mutationFn: postCreatePayment,
        onSuccess: (data, variables) => {
            navigate({ to: '/roommate/payments' });
            toaster.success({ title: t('payments.settle-up-success') });
            queryClient.invalidateQueries({ queryKey: ["debtPayments", variables.apartmentId, currentUserDetails?.userId] });
        },
        onError: (error: any) => {
            toaster.error({ title: error?.response.data.error || t('error.action_failed'), });
        },
    });
};
