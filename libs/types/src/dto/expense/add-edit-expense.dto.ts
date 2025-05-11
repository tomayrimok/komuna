export class AddEditExpenseDto {
    expenseId?: string;
    amount: number;
    description: string;
    paidById: string;
    apartmentId: string;
    splits: { [userId: string]: number };
}