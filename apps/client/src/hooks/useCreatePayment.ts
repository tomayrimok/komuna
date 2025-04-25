// src/hooks/useDebts.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { postCreatePayment } from "../api/createPayment";

export const useCreatePayment = () => {
    return useMutation({
        mutationFn: postCreatePayment,
        onSuccess: (data) => {
            // toast.success(data.message || 'Payment created successfully!');
            // // Invalidate relevant queries to update the UI
            // queryClient.invalidateQueries({ queryKey: ['debt-details', debtId] }); // Example: Invalidate debt details
            // queryClient.invalidateQueries({ queryKey: ['debts'] }); // Invalidate list of debts
            //  setValue(undefined); //removed setValue and changed state to amount
        },
        onError: (error: Error) => {
            // toast.error(`Failed to create payment: ${error.message}`);
        },
    });
};
