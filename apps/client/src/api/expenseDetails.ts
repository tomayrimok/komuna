import { API } from '@komuna/types';

export const fetchExpenseDetails = async (expenseId: string) => {
  const response = await API.expenseControllerGetExpenseDetails({
    query: {
      expenseId,
    },
  });

  return response.data;
};
