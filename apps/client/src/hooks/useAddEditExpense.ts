import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddEditExpense } from "../api/postAddEditExpense";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth/AuthProvider";
import { toaster } from "../chakra/ui/toaster";
import { useTranslation } from "react-i18next";

export const useAddEditExpense = () => {

    const queryClient = useQueryClient();
    const { currentUserDetails } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: postAddEditExpense,
        onSuccess: (data, variables) => {
            navigate({ to: '/roommate/payments' });
            toaster.success({ title: t('payments.expense.expense-saved') });
            queryClient.invalidateQueries({ queryKey: ["apartmentExpenses", variables.apartmentId, currentUserDetails?.userId] });
            queryClient.invalidateQueries({ queryKey: ["userBalanceDetails", variables.apartmentId, currentUserDetails?.userId] });
        },
        onError: (error: any) => {
            toaster.error({ title: error?.response.data.error || t('error.action_failed'), });
        },
    });
};
