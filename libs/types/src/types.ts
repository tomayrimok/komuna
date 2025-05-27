import { User, UserApartment } from "./generated";

// export type User = {
//     userId: string;
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
//     image?: string;
// }

export type ApartmentResponse = {
    apartmentId: string;
    name: string;
    residents: UserApartment[];
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
    apartmentId: string;
    amount: number;
    debtId: string;
    fromId: string;
    toId: string;
    fromUser: User;
    toUser: User;
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
    amount: number;
    debtId: string;
    debtor: boolean;
    fromId: string;
    toId: string;
    fromUser: User;
    toUser: User;
    updatedAt: string;
};
