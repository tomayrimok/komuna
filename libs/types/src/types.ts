import { ContextType } from "./enums";
import { ShoppingListItemWithIdDto } from "./generated";
import { UserRole } from "./enums";
import { User, UserApartment } from "./generated";

export type ShoppingList = {

    shoppingListId: string;

    contextType: ContextType;

    contextId: string;

    items: ShoppingListItemWithIdDto[];

    updatedAt: Date;

    createdAt: Date;
}



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

// export type ApartmentExpensesResponse = {
//     expenseId: string;
//     apartmentId: string;
//     description: string;
//     amount: number;
//     paidById: string;
//     paidByUser: User;
//     splits: { [userId: string]: number };
//     createdAt: string;
//     paidByMe?: boolean;
//     splitAmount?: string;
// }

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
