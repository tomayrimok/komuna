import axios from "axios";
import { AddEditExpenseDto } from "@komuna/types";


export const postAddEditExpense = async (data: AddEditExpenseDto) => {
    const response = await axios.post("/api/expense/add-edit-expense", data);
    return response.data;
};
