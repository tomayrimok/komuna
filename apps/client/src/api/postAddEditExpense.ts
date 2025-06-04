import { API, ApiTypes } from "@komuna/types";

export const postAddEditExpense = async (data: ApiTypes.AddEditExpenseDto) => {
    const response = await API.expenseControllerAddEditExpense({ body: data, throwOnError: true });
    return response.data;
};
