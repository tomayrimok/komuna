// src/hooks/useDebts.ts
import { useMutation } from "@tanstack/react-query";
import { postCreateExpense } from "../api/postCreateExpense";

export const useCreateExpense = () => {
    return useMutation({
        mutationFn: postCreateExpense,
        onSuccess: (data) => {
            // toast.success(data.message || 'Expense created successfully!');
            // // Invalidate relevant queries to update the UI
            // queryClient.invalidateQueries({ queryKey: ['debt-details', debtId] }); // Example: Invalidate debt details
            // queryClient.invalidateQueries({ queryKey: ['debts'] }); // Invalidate list of debts
            //  setValue(undefined); //removed setValue and changed state to amount
        },
        onError: (error: Error) => {
            // toast.error(`Failed to create Expense: ${error.message}`);
        },
    });
};
