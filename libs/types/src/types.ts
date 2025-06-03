import { ShoppingListContextType } from "./enums";
import { ShoppingListItemWithIdDto } from "./generated";
import { UserRole } from "./enums";

export type ShoppingList = {

    shoppingListId: string;

    contextType: ShoppingListContextType;

    contextId: string;

    items: ShoppingListItemWithIdDto[];

    updatedAt: Date;

    createdAt: Date;
}

export type User = {
    userId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    image?: string;
}

export type ApartmentResponse = {
    apartmentId: string;
    name: string;
    residents: {
        userId: string;
        rent: number | null;
        role: UserRole;
        user: User | null;
    }[];
}

export type ApartmentExpenseResponse = {
    expense_amount: number;
    expense_apartmentId: string;
    expense_createdAt: string;
    expense_description: string;
    expense_expenseId: string;
    expense_paidById: string;
    expense_splits: { [userId: string]: number };
    paidByMe: boolean;
    splitAmount: string;
    paidByFirstName: string;
    paidByLastName: string;
}

export type PaymentResponse = {
    paymentId: string;
    apartmentId: string;
    fromId: string;
    toId: string;
    amount: number;
    createdAt: string;
}

export type DebtDetailsResponse = {
    debt_apartmentId: string;
    debt_amount: number;
    debt_debtId: string;
    debt_fromId: string;
    debt_toId: string;
    userFrom_firstName: string;
    userFrom_lastName: string;
    userTo_firstName: string;
    userTo_lastName: string;
    userFrom_phoneNumber: string;
    userTo_phoneNumber: string;
    userTo_image: string;
    userFrom_image: string;
}

export type ExpenseDetailsResponse = {
    apartmentId: string;
    amount: number;
    createdAt: string;
    description: string;
    expenseId: string;
    paidById: string;
    paidByUser: {
        firstName: string;
        lastName: string;
        image?: string;
        phoneNumber: string;
        userId: string;
    };
    splits: {
        [userId: string]: number;
    };
};

export type BalanceDetailsResponse = {
    debt_amount: number;
    debt_debtId: string;
    debtor: boolean;
    debt_fromId: string;
    debt_toId: string;
    userFrom_firstName: string;
    userFrom_lastName: string;
    userTo_firstName: string;
    userTo_lastName: string;
    userFrom_phoneNumber: string;
    userTo_phoneNumber: string;
    userTo_image: string;
    userFrom_image: string;
    debt_updatedAt: string;
};
